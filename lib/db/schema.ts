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
