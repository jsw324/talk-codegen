import { z } from 'zod';
import { Customer } from '../db/schema';

// DTO Schemas for validation
export const createCustomerSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(255),
  contactName: z.string().min(1, 'Contact name is required').max(255),
  email: z.string().email('Valid email is required').max(255),
  phone: z.string().max(20).optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const customerFiltersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  sort: z.enum(['companyName', 'contactName', 'createdAt']).default('companyName'),
  order: z.enum(['asc', 'desc']).default('asc'),
});

// Export DTO types
export type CreateCustomerDto = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerDto = z.infer<typeof updateCustomerSchema>;
export type CustomerFilters = z.infer<typeof customerFiltersSchema>;

// Query options for repository
export interface FindAllOptions {
  page: number;
  limit: number;
  search?: string;
  sort: 'companyName' | 'contactName' | 'createdAt';
  order: 'asc' | 'desc';
}

// Paginated result type
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API Response types
export interface CustomerResponse {
  data: Customer;
  message?: string;
}

export interface CustomersListResponse {
  data: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CustomerDeleteResponse {
  message: string;
}
