# Database Setup Guide

## Overview
This guide provides step-by-step instructions for setting up the PostgreSQL database using Neon, configuring Drizzle ORM, defining schemas, and seeding data for the sales analytics dashboard.

## Prerequisites
- Neon account and database created
- Database connection string available
- Node.js project initialized with required dependencies

## Required Dependencies
```bash
pnpm install drizzle-orm @neondatabase/serverless
pnpm install -D drizzle-kit
```

## Environment Configuration

### Environment Variables
Create `.env.local` file in project root:
```bash
# Neon Database Connection
DATABASE_URL="postgresql://[username]:[password]@[host]/[database]?sslmode=require"

# Development
NODE_ENV="development"
```

### Environment Type Safety
Create `lib/env.ts`:
```typescript
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = envSchema.parse(process.env);
```

## Drizzle Configuration

### Database Connection (`lib/db/connection.ts`)
```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '../env';
import * as schema from './schema';

// Create connection
const sql = neon(env.DATABASE_URL);

// Export drizzle instance with schema
export const db = drizzle(sql, { schema });

// Export types
export type Database = typeof db;
```

### Drizzle Kit Configuration (`drizzle.config.ts`)
Create in project root:
```typescript
import type { Config } from 'drizzle-kit';
import { env } from './lib/env';

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config;
```

## Database Schema Definition

### Schema File (`lib/db/schema.ts`)
```typescript
import {
  pgTable,
  serial,
  varchar,
  text,
  decimal,
  integer,
  timestamp,
  pgEnum
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const saleStatusEnum = pgEnum('sale_status', ['pending', 'completed', 'cancelled']);

// Customers Table
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  contactName: varchar('contact_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Products Table
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Sales Table
export const sales = pgTable('sales', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').notNull().references(() => customers.id),
  productId: integer('product_id').notNull().references(() => products.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull().default(1),
  saleDate: timestamp('sale_date').notNull(),
  status: saleStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const customersRelations = relations(customers, ({ many }) => ({
  sales: many(sales),
}));

export const productsRelations = relations(products, ({ many }) => ({
  sales: many(sales),
}));

export const salesRelations = relations(sales, ({ one }) => ({
  customer: one(customers, {
    fields: [sales.customerId],
    references: [customers.id],
  }),
  product: one(products, {
    fields: [sales.productId],
    references: [products.id],
  }),
}));

// Export types
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Sale = typeof sales.$inferSelect;
export type NewSale = typeof sales.$inferInsert;

// Enum types
export type SaleStatus = typeof sales.status.enumValues[number];
```

## Migration Management

### Generate Migration
```bash
npm run db:generate
```

### Run Migrations
```bash
npm run db:migrate
```

### Migration Scripts (`package.json`)
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx lib/db/seed.ts"
  }
}
```

## Seed Data Implementation

### Seed Script (`lib/db/seed.ts`)
```typescript
import { db } from './connection';
import { customers, products, sales } from './schema';
import type { NewCustomer, NewProduct, NewSale } from './schema';

// Sample data arrays
const sampleCustomers: NewCustomer[] = [
  {
    companyName: 'Acme Corporation',
    contactName: 'John Smith',
    email: 'john.smith@acme.com',
    phone: '+1-555-0123',
  },
  {
    companyName: 'TechStart Solutions',
    contactName: 'Sarah Johnson',
    email: 'sarah@techstart.com',
    phone: '+1-555-0456',
  },
  {
    companyName: 'Global Industries',
    contactName: 'Michael Chen',
    email: 'mchen@global.com',
    phone: '+1-555-0789',
  },
  // Add 47 more customers for realistic dataset
];

const sampleProducts: NewProduct[] = [
  {
    name: 'Professional Software License',
    description: 'Annual enterprise software license',
    price: '2999.99',
    category: 'Software',
  },
  {
    name: 'Consulting Services',
    description: 'Strategic business consulting package',
    price: '5000.00',
    category: 'Services',
  },
  {
    name: 'Hardware Package',
    description: 'Complete hardware setup and installation',
    price: '1299.99',
    category: 'Hardware',
  },
  // Add 22 more products across categories
];

// Utility functions
function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Seed function
async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.delete(sales);
    await db.delete(products);
    await db.delete(customers);

    // Insert customers
    console.log('👥 Seeding customers...');
    const insertedCustomers = await db.insert(customers).values(sampleCustomers).returning();
    console.log(`✅ Inserted ${insertedCustomers.length} customers`);

    // Insert products
    console.log('📦 Seeding products...');
    const insertedProducts = await db.insert(products).values(sampleProducts).returning();
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    // Generate sales data
    console.log('💰 Generating sales data...');
    const salesData: NewSale[] = [];
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Create 200+ realistic sales records
    for (let i = 0; i < 250; i++) {
      const customer = getRandomElement(insertedCustomers);
      const product = getRandomElement(insertedProducts);
      const quantity = Math.floor(Math.random() * 5) + 1;
      const baseAmount = parseFloat(product.price);
      const amount = (baseAmount * quantity).toFixed(2);

      salesData.push({
        customerId: customer.id,
        productId: product.id,
        amount,
        quantity,
        saleDate: getRandomDate(oneYearAgo, new Date()),
        status: getRandomElement(['pending', 'completed', 'cancelled'] as const),
      });
    }

    const insertedSales = await db.insert(sales).values(salesData).returning();
    console.log(`✅ Inserted ${insertedSales.length} sales records`);

    console.log('🎉 Database seeding completed successfully!');

    // Print summary
    console.log('\n📊 Seed Summary:');
    console.log(`   Customers: ${insertedCustomers.length}`);
    console.log(`   Products: ${insertedProducts.length}`);
    console.log(`   Sales: ${insertedSales.length}`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('🏁 Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seed script failed:', error);
      process.exit(1);
    });
}

export { seed };
```

### Additional Seed Data Arrays

#### Extended Customer Data
Include customers across various industries:
- Technology companies
- Manufacturing firms
- Retail businesses
- Healthcare organizations
- Financial services
- Educational institutions

#### Extended Product Data
Include products across categories:
- **Software**: Licenses, subscriptions, custom development
- **Services**: Consulting, support, training, implementation
- **Hardware**: Equipment, installations, maintenance contracts
- **Digital**: Marketing services, analytics tools, security solutions

## Database Utilities

### Query Helpers (`lib/db/queries.ts`)
```typescript
import { db } from './connection';
import { customers, products, sales } from './schema';
import { count, desc, asc, like, and, gte, lte } from 'drizzle-orm';

// Common query patterns
export const dbQueries = {
  // Customer queries
  async getAllCustomers(options: {
    limit?: number;
    offset?: number;
    search?: string;
  } = {}) {
    const { limit = 20, offset = 0, search } = options;

    return await db
      .select()
      .from(customers)
      .where(
        search
          ? like(customers.companyName, `%${search}%`)
          : undefined
      )
      .limit(limit)
      .offset(offset)
      .orderBy(asc(customers.companyName));
  },

  // Sales analytics
  async getSalesWithDetails(dateRange?: { start: Date; end: Date }) {
    return await db
      .select({
        sale: sales,
        customer: customers,
        product: products,
      })
      .from(sales)
      .leftJoin(customers, eq(sales.customerId, customers.id))
      .leftJoin(products, eq(sales.productId, products.id))
      .where(
        dateRange
          ? and(
              gte(sales.saleDate, dateRange.start),
              lte(sales.saleDate, dateRange.end)
            )
          : undefined
      )
      .orderBy(desc(sales.saleDate));
  },
};
```

## Development Workflow

### Initial Setup Steps
1. **Generate Initial Migration**:
   ```bash
   pnpm run db:generate
   ```

2. **Run Migration**:
   ```bash
   pnpm run db:migrate
   ```

3. **Seed Database**:
   ```bash
   pnpm run db:seed
   ```

4. **Verify Setup**:
   ```bash
   pnpm run db:studio
   ```

## Testing Database Connection

### Connection Test (`lib/db/test-connection.ts`)
```typescript
import { db } from './connection';
import { customers } from './schema';

export async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');

    const result = await db.select().from(customers).limit(1);

    console.log('✅ Database connection successful');
    console.log(`📊 Found ${result.length} sample record(s)`);

    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}
```

## Troubleshooting

### Common Issues
1. **Connection String Format**: Ensure Neon connection string includes `?sslmode=require`
2. **Environment Variables**: Verify `.env.local` is properly loaded
3. **Migration Conflicts**: Delete and regenerate migrations if schema changes conflict
4. **Seed Data**: Clear existing data before re-seeding to avoid constraint violations

### Verification Commands
```bash
# Test connection
npm run db:studio

# View generated migrations
ls lib/db/migrations/

# Check seed data count
# Connect via Drizzle Studio and verify record counts
```

## Security Considerations
- Never commit `.env.local` to version control
- Use environment-specific connection strings
- Implement proper error handling for production
- Consider connection pooling for high-traffic scenarios

## Production Deployment
- Use connection pooling (e.g., `@neondatabase/serverless` with pooling)
- Set appropriate timeout values
- Implement proper logging and monitoring
- Use read replicas for analytics queries if needed
