import { db } from './connection';
import { customers, products, sales } from './schema';
import { count, desc, asc, like, and, gte, lte, eq } from 'drizzle-orm';

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

  // Product queries
  async getAllProducts(options: {
    limit?: number;
    offset?: number;
    category?: string;
  } = {}) {
    const { limit = 20, offset = 0, category } = options;

    return await db
      .select()
      .from(products)
      .where(
        category
          ? eq(products.category, category)
          : undefined
      )
      .limit(limit)
      .offset(offset)
      .orderBy(asc(products.name));
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

  // Sales summary statistics
  async getSalesSummary(dateRange?: { start: Date; end: Date }) {
    return await db
      .select({
        totalSales: count(sales.id),
        // Note: These aggregations would need proper SQL functions for production use
      })
      .from(sales)
      .where(
        dateRange
          ? and(
              gte(sales.saleDate, dateRange.start),
              lte(sales.saleDate, dateRange.end)
            )
          : undefined
      );
  },

  // Customer with sales count
  async getCustomersWithSalesCount() {
    return await db
      .select({
        customer: customers,
        salesCount: count(sales.id),
      })
      .from(customers)
      .leftJoin(sales, eq(customers.id, sales.customerId))
      .groupBy(customers.id)
      .orderBy(desc(count(sales.id)));
  },

  // Product with sales count
  async getProductsWithSalesCount() {
    return await db
      .select({
        product: products,
        salesCount: count(sales.id),
      })
      .from(products)
      .leftJoin(sales, eq(products.id, sales.productId))
      .groupBy(products.id)
      .orderBy(desc(count(sales.id)));
  },

  // Recent sales activity
  async getRecentSales(limit: number = 10) {
    return await db
      .select({
        sale: sales,
        customer: customers,
        product: products,
      })
      .from(sales)
      .leftJoin(customers, eq(sales.customerId, customers.id))
      .leftJoin(products, eq(sales.productId, products.id))
      .orderBy(desc(sales.createdAt))
      .limit(limit);
  },
};
