import { CustomerRepository, customerRepository } from '../repositories/customer-repository';
import { CreateCustomerDto, UpdateCustomerDto, FindAllOptions, PaginatedResult } from '../types/customer';
import { Customer } from '../db/schema';

export class CustomerService {
  constructor(private customerRepo: CustomerRepository) {}

  async getAllCustomers(options: FindAllOptions): Promise<PaginatedResult<Customer>> {
    return this.customerRepo.findAll(options);
  }

  async getCustomerById(id: number): Promise<Customer | null> {
    return this.customerRepo.findById(id);
  }

  async createCustomer(data: CreateCustomerDto): Promise<Customer> {
    // Sanitize data
    const sanitizedData = {
      companyName: data.companyName.trim(),
      contactName: data.contactName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || undefined,
    };

    // Check if email already exists
    const existingCustomer = await this.customerRepo.findByEmail(sanitizedData.email);
    if (existingCustomer) {
      throw new EmailExistsError('Email already exists');
    }

    return this.customerRepo.create(sanitizedData);
  }

  async updateCustomer(id: number, data: UpdateCustomerDto): Promise<Customer> {
    // Check if customer exists
    const existingCustomer = await this.customerRepo.findById(id);
    if (!existingCustomer) {
      throw new CustomerNotFoundError('Customer not found');
    }

    // Sanitize data
    const sanitizedData: UpdateCustomerDto = {};
    if (data.companyName !== undefined) {
      sanitizedData.companyName = data.companyName.trim();
    }
    if (data.contactName !== undefined) {
      sanitizedData.contactName = data.contactName.trim();
    }
    if (data.email !== undefined) {
      sanitizedData.email = data.email.trim().toLowerCase();

      // Check if email already exists (and it's not the same customer)
      const customerWithEmail = await this.customerRepo.findByEmail(sanitizedData.email);
      if (customerWithEmail && customerWithEmail.id !== id) {
        throw new EmailExistsError('Email already exists');
      }
    }
    if (data.phone !== undefined) {
      sanitizedData.phone = data.phone?.trim() || undefined;
    }

    return this.customerRepo.update(id, sanitizedData);
  }

  async deleteCustomer(id: number): Promise<void> {
    // Check if customer exists
    const existingCustomer = await this.customerRepo.findById(id);
    if (!existingCustomer) {
      throw new CustomerNotFoundError('Customer not found');
    }

    await this.customerRepo.delete(id);
  }
}

// Custom error classes
export class CustomerNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomerNotFoundError';
  }
}

export class EmailExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmailExistsError';
  }
}

// Export singleton instance
export const customerService = new CustomerService(customerRepository);
