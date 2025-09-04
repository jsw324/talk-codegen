# Sales Analytics Dashboard - Claude.md

## Project Overview
This is a demonstration Next.js application showcasing best practices for AI-assisted development with Claude Code. The app is a sales analytics dashboard built for a talk targeting full-stack developers from .NET/React backgrounds.

**Primary Purpose**: Demonstrate Claude Code capabilities including:
- Code generation and scaffolding
- Debugging and error resolution
- Refactoring and architectural improvements
- Clean code patterns and best practices

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **UI Components**: Headless components with Tailwind
- **Package Manager**: pnpm

## Architecture
This project follows a clean, layer-based architecture:

```
project-root/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/               # Reusable UI components
│   └── features/         # Domain-specific components
├── lib/
│   ├── db/              # Database configuration & migrations
│   ├── repositories/    # Data access layer
│   ├── services/       # Business logic layer
│   ├── types/          # TypeScript interfaces & DTOs
│   └── utils/          # Utility functions
└── public/             # Static assets
```

## Database Schema

### Core Entities
The dashboard manages three core entities with the following relationships:

1. **Customers**
   - id (primary key)
   - company_name
   - contact_name
   - email
   - phone
   - created_at
   - updated_at

2. **Products**
   - id (primary key)
   - name
   - description
   - price
   - category
   - created_at
   - updated_at

3. **Sales**
   - id (primary key)
   - customer_id (foreign key -> customers)
   - product_id (foreign key -> products)
   - amount
   - quantity
   - sale_date
   - status (pending, completed, cancelled)
   - created_at
   - updated_at

### Relationships
- Sales → Customer (Many-to-One)
- Sales → Product (Many-to-One)
- Customer → Sales (One-to-Many)
- Product → Sales (One-to-Many)

## Development Guidelines

### Code Organization Principles
1. **Separation of Concerns**: Each layer has a single responsibility
2. **Repository Pattern**: Data access isolated in repository layer
3. **Service Layer**: Business logic separated from controllers
4. **Type Safety**: Comprehensive TypeScript usage throughout
5. **Component Composition**: Reusable UI components with clear props

### Naming Conventions
- **Files**: kebab-case (e.g., `sales-repository.ts`)
- **Components**: PascalCase (e.g., `SalesDashboard`)
- **Functions**: camelCase (e.g., `getSalesByCustomer`)
- **Types**: PascalCase with descriptive suffixes (e.g., `CreateSaleDto`, `SalesService`)

### Database Patterns
- Use Drizzle schema definitions in `/lib/db/schema.ts`
- Migrations in `/lib/db/migrations/`
- Connection configuration in `/lib/db/connection.ts`
- Seed data in `/lib/db/seed.ts`


## Code Examples & Patterns

### Repository Pattern Example
```typescript
// lib/repositories/sales-repository.ts
export interface SalesRepository {
  findAll(filters?: SalesFilters): Promise<Sale[]>;
  findById(id: number): Promise<Sale | null>;
  create(data: CreateSaleDto): Promise<Sale>;
  update(id: number, data: UpdateSaleDto): Promise<Sale>;
  delete(id: number): Promise<void>;
}
```

### Service Layer Example
```typescript
// lib/services/sales-service.ts
export class SalesService {
  constructor(private salesRepo: SalesRepository) {}

  async createSale(data: CreateSaleDto): Promise<Sale> {
    // Business logic validation
    // Call repository
    // Return result
  }
}
```


### API Route Pattern
```typescript
// app/api/sales/route.ts
export async function GET(request: Request) {
  // Parse query parameters
  // Call service layer
  // Return response
}
```

## Common Development Process

### Adding New Features
When adding new features, follow this pattern:
1. Define types/interfaces in `/lib/types/`
2. Create/update database schema in `/lib/db/schema.ts`
3. Implement repository interface and implementation
4. Create service layer with business logic
5. Build API routes in `/app/api/`
6. Create UI components in `/components/`
7. Add pages in `/app/dashboard/`

## Environment Setup

### Required Environment Variables
```bash
# Database
DATABASE_URL="postgresql://..."

# Optional: Development
NODE_ENV="development"
```

### Development Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler check
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run end-to-end tests
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Drizzle Studio
```

## Testing Strategy

### Unit Testing
**Framework**: Vitest (recommended for new Next.js projects in 2025)
- **Performance**: 3-4x faster than Jest
- **Compatibility**: Jest API compatible for easy migration
- **Features**: Native ES modules, TypeScript, JSX support out-of-the-box
- **Limitation**: Does not support async Server Components (use E2E tests instead)

**Testing Library**: React Testing Library
- Component testing with user-centric approach
- Testing user interactions and component behavior
- Accessibility-focused testing patterns

### End-to-End Testing
**Framework**: Playwright (Vercel recommended)
- Cross-browser testing (Chrome, Firefox, Safari)
- Fast and reliable
- Built-in screenshot and video recording
- Excellent debugging capabilities

### Test Organization
```
__tests__/
├── components/        # Component unit tests
├── services/         # Service layer tests
├── repositories/     # Repository tests
├── api/             # API route tests
└── e2e/             # End-to-end tests
```

### Testing Patterns
```typescript
// Component testing example
import { render, screen } from '@testing-library/react'
import { SalesDashboard } from '@/components/SalesDashboard'

test('displays sales summary', () => {
  render(<SalesDashboard />)
  expect(screen.getByText('Total Revenue')).toBeInTheDocument()
})

// Service testing example
import { SalesService } from '@/lib/services/sales-service'
import { mockSalesRepository } from '@/tests/mocks'

test('calculates total revenue correctly', async () => {
  const service = new SalesService(mockSalesRepository)
  const total = await service.getTotalRevenue()
  expect(total).toBe(150000)
})
```

## Code Quality & Linting

### ESLint Configuration
**Setup**: Next.js comes with ESLint configured out-of-the-box
- **Config**: `eslint-config-next` (includes React, accessibility, and Next.js rules)
- **TypeScript**: Automatic TypeScript rule integration
- **Custom Rules**: Add project-specific rules in `.eslintrc.js`

### Prettier (Code Formatting)
**Recommended Setup**:
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80
}
```

### TypeScript Configuration
**Strict Mode**: Enable strict TypeScript checking
```json
// tsconfig.json (key settings)
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Pre-commit Hooks (Recommended)
**Husky + lint-staged** for automated code quality:
```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

## Build Verification & Deployment

### Pre-deployment Checklist
Run these commands before pushing or deploying:
```bash
# 1. Type checking
npm run typecheck

# 2. Linting
npm run lint

# 3. Unit tests
npm run test

# 4. Build verification
npm run build

# 5. E2E tests (optional, but recommended)
npm run test:e2e
```
