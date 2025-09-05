# PRD: Customer Management

## Overview
Implement complete CRUD (Create, Read, Update, Delete) operations for customer management, including backend API endpoints and frontend interfaces.

## Database Schema

### Customer Entity
```typescript
interface Customer {
  id: number;              // Primary key
  company_name: string;    // Required, max 255 chars
  contact_name: string;    // Required, max 255 chars
  email: string;          // Required, unique, valid email format
  phone?: string;         // Optional, max 20 chars
  created_at: Date;       // Auto-generated
  updated_at: Date;       // Auto-updated
}
```

## Backend Requirements

### API Endpoints

#### GET /api/customers
**Purpose**: List customers with optional filtering and pagination

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `search` (string) - searches company_name and contact_name
- `sort` (string, options: 'company_name', 'contact_name', 'created_at')
- `order` (string, options: 'asc', 'desc', default: 'asc')

**Response**:
```typescript
{
  data: Customer[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    pages: number
  }
}
```

#### POST /api/customers
**Purpose**: Create new customer

**Request Body**:
```typescript
{
  company_name: string,
  contact_name: string,
  email: string,
  phone?: string
}
```

**Response**:
```typescript
{
  data: Customer,
  message: "Customer created successfully"
}
```

#### GET /api/customers/[id]
**Purpose**: Get customer by ID

**Response**:
```typescript
{
  data: Customer
}
```

#### PUT /api/customers/[id]
**Purpose**: Update customer by ID

**Request Body**: Same as POST (all fields optional for partial updates)

**Response**:
```typescript
{
  data: Customer,
  message: "Customer updated successfully"
}
```

#### DELETE /api/customers/[id]
**Purpose**: Delete customer by ID

**Response**:
```typescript
{
  message: "Customer deleted successfully"
}
```

### Backend Implementation Requirements

#### Repository Layer (`lib/repositories/customer-repository.ts`)
```typescript
interface CustomerRepository {
  findAll(options: FindAllOptions): Promise<PaginatedResult<Customer>>;
  findById(id: number): Promise<Customer | null>;
  create(data: CreateCustomerDto): Promise<Customer>;
  update(id: number, data: UpdateCustomerDto): Promise<Customer>;
  delete(id: number): Promise<void>;
  findByEmail(email: string): Promise<Customer | null>;
}
```

#### Service Layer (`lib/services/customer-service.ts`)
```typescript
class CustomerService {
  // Business logic including:
  // - Email uniqueness validation
  // - Data sanitization
  // - Error handling
  // - Audit logging
}
```

#### Validation
- Company name: Required, 1-255 characters, trim whitespace
- Contact name: Required, 1-255 characters, trim whitespace
- Email: Required, valid email format, unique in database
- Phone: Optional, max 20 characters, accept common formats

#### Error Handling
- 400: Validation errors with field-specific messages
- 404: Customer not found
- 409: Email already exists (on create/update)
- 500: Database/server errors

## Frontend Requirements

### Page Structure
```
app/dashboard/customers/
├── page.tsx              # Customer list view
├── new/
│   └── page.tsx         # Create customer form
├── [id]/
│   ├── page.tsx         # Customer detail view
│   └── edit/
│       └── page.tsx     # Edit customer form
└── loading.tsx          # Loading states
```

### Components
```
components/customers/
├── customer-list.tsx          # Main list component
├── customer-table.tsx         # Data table
├── customer-form.tsx          # Create/edit form
├── customer-card.tsx          # Detail view card
├── customer-search.tsx        # Search input
├── customer-filters.tsx       # Filter controls
└── customer-actions.tsx       # Action buttons (edit/delete)
```

### Customer List View (`/dashboard/customers`)

#### Features
- Paginated table of customers
- Search by company name or contact name
- Sort by company name, contact name, or created date
- Action buttons for each row (View, Edit, Delete)
- "Add Customer" button
- Loading states and empty states

#### Table Columns
1. Company Name (sortable, searchable)
2. Contact Name (sortable, searchable)
3. Email
4. Phone
5. Created Date (sortable)
6. Actions (View/Edit/Delete dropdown)

### Customer Detail View (`/dashboard/customers/[id]`)

#### Features
- Display all customer information
- Edit and Delete action buttons
- List of related sales (if any exist)
- Back to list navigation

### Customer Form (Create/Edit)

#### Form Fields
- Company Name (text input, required)
- Contact Name (text input, required)
- Email (email input, required)
- Phone (tel input, optional)

#### Form Behavior
- Real-time validation on blur
- Submit button disabled while loading
- Success/error toast notifications
- Redirect to detail view on successful create
- Stay on edit form after successful update

#### Validation Messages
- Company Name: "Company name is required"
- Contact Name: "Contact name is required"
- Email: "Valid email is required" / "Email already exists"
- Phone: "Invalid phone number format" (if provided)

### UI/UX Requirements

#### Loading States
- Skeleton loaders for table rows
- Spinner on form submit buttons
- Loading overlay for delete actions

#### Empty States
- "No customers found" with illustration
- "No results" for search with clear filters button
- Helpful text encouraging first customer creation

#### Responsive Design
- Table scrolls horizontally on mobile
- Form adapts to smaller screens
- Touch-friendly action buttons

#### Accessibility
- Proper form labels and ARIA attributes
- Keyboard navigation support
- Screen reader announcements for actions
- Focus management on route changes

## Implementation Phases

### Phase 1: Backend Foundation
- [ ] Database schema and migrations
- [ ] Repository pattern implementation
- [ ] Service layer with validation
- [ ] API routes with error handling
- [ ] Seed data for development

### Phase 2: List and Detail Views
- [ ] Customer list page with table
- [ ] Search and filtering functionality
- [ ] Pagination implementation
- [ ] Customer detail page
- [ ] Loading and empty states

### Phase 3: Create and Edit Forms
- [ ] Customer creation form
- [ ] Form validation and error handling
- [ ] Customer edit functionality
- [ ] Success/error notifications

### Phase 4: Polish and Testing
- [ ] Delete functionality with confirmation
- [ ] Responsive design optimization
- [ ] Accessibility improvements
- [ ] Error boundary implementation

## Success Metrics
- All CRUD operations work correctly
- Forms provide clear validation feedback
- Loading states provide good UX
- Mobile experience is usable
- Search and filtering perform well
- Code follows established patterns from claude.md
