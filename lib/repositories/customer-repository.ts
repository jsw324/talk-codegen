import { eq, ilike, or, asc, desc, count } from 'drizzle-orm';
import { db } from '../db/connection';
import { customers, Customer } from '../db/schema';
import { CreateCustomerDto, UpdateCustomerDto, FindAllOptions, PaginatedResult } from '../types/customer';

export interface CustomerRepository {
  findAll(options: FindAllOptions): Promise<PaginatedResult<Customer>>;
  findById(id: number): Promise<Customer | null>;
  create(data: CreateCustomerDto): Promise<Customer>;
  update(id: number, data: UpdateCustomerDto): Promise<Customer>;
  delete(id: number): Promise<void>;
  findByEmail(email: string): Promise<Customer | null>;
}

export class DrizzleCustomerRepository implements CustomerRepository {
  async findAll(options: FindAllOptions): Promise<PaginatedResult<Customer>> {
    const { page, limit, search, sort, order } = options;
    const offset = (page - 1) * limit;

    // Build where clause for search
    const searchCondition = search
      ? or(
          ilike(customers.companyName, `%${search}%`),
          ilike(customers.contactName, `%${search}%`)
        )
      : undefined;

    // Build order clause
    const orderClause = () => {
      const column = sort === 'companyName' ? customers.companyName
                   : sort === 'contactName' ? customers.contactName
                   : customers.createdAt;
      return order === 'desc' ? desc(column) : asc(column);
    };

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(customers)
      .where(searchCondition);

    const total = totalResult[0]?.count || 0;

    // Get paginated data
    const data = await db
      .select()
      .from(customers)
      .where(searchCondition)
      .orderBy(orderClause())
      .limit(limit)
      .offset(offset);

    const pages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };
  }

  async findById(id: number): Promise<Customer | null> {
    const result = await db
      .select()
      .from(customers)
      .where(eq(customers.id, id))
      .limit(1);

    return result[0] || null;
  }

  async create(data: CreateCustomerDto): Promise<Customer> {
    const now = new Date();
    const result = await db
      .insert(customers)
      .values({
        ...data,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return result[0];
  }

  async update(id: number, data: UpdateCustomerDto): Promise<Customer> {
    const result = await db
      .update(customers)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Customer not found');
    }

    return result[0];
  }

  async delete(id: number): Promise<void> {
    const result = await db
      .delete(customers)
      .where(eq(customers.id, id))
      .returning({ id: customers.id });

    if (result.length === 0) {
      throw new Error('Customer not found');
    }
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const result = await db
      .select()
      .from(customers)
      .where(eq(customers.email, email))
      .limit(1);

    return result[0] || null;
  }
}

// Export singleton instance
export const customerRepository = new DrizzleCustomerRepository();
