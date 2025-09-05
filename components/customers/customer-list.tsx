'use client';

import { useState, useEffect, useCallback } from 'react';
import { Customer } from '@/lib/db/schema';
import { CustomerFilters, CustomersListResponse } from '@/lib/types/customer';
import { CustomerTable } from './customer-table';
import { CustomerSearch } from './customer-search';
import { CustomerPagination } from './customer-pagination';
import { Plus, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CustomerFilters>({
    page: 1,
    limit: 20,
    search: '',
    sort: 'companyName',
    order: 'asc',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      params.append('sort', filters.sort);
      params.append('order', filters.order);

      const response = await fetch(`/api/customers?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data: CustomersListResponse = await response.json();
      setCustomers(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleSort = (sort: 'companyName' | 'contactName' | 'createdAt') => {
    setFilters(prev => ({
      ...prev,
      sort,
      order: prev.sort === sort && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      // Refresh the customer list
      await fetchCustomers();
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert('Failed to delete customer. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-600">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CustomerSearch
          value={filters.search || ''}
          onChange={handleSearch}
          placeholder="Search by company or contact name..."
        />
        <Link
          href="/dashboard/customers/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-lg shadow">
          <div className="p-8 text-center">
            <div className="mb-4">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filters.search ? 'No customers found' : 'No customers yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {filters.search
                ? `No customers match "${filters.search}". Try adjusting your search.`
                : 'Get started by adding your first customer.'
              }
            </p>
            {filters.search ? (
              <button
                onClick={() => handleSearch('')}
                className="text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            ) : (
              <Link
                href="/dashboard/customers/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <CustomerTable
            customers={customers}
            sort={filters.sort}
            order={filters.order}
            onSort={handleSort}
            onDelete={handleDelete}
          />
          <div className="px-6 py-4 border-t border-gray-200">
            <CustomerPagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
