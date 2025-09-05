'use client';

import { Customer } from '@/lib/db/schema';
import { ChevronDown, ChevronUp, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface CustomerTableProps {
  customers: Customer[];
  sort: 'companyName' | 'contactName' | 'createdAt';
  order: 'asc' | 'desc';
  onSort: (column: 'companyName' | 'contactName' | 'createdAt') => void;
  onDelete: (id: number) => void;
}

export function CustomerTable({ customers, sort, order, onSort, onDelete }: CustomerTableProps) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getSortIcon = (column: string) => {
    if (sort !== column) return null;
    return order === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const handleDropdownToggle = (customerId: number) => {
    setOpenDropdown(openDropdown === customerId ? null : customerId);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      onDelete(id);
    }
    setOpenDropdown(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort('companyName')}
            >
              <div className="flex items-center space-x-1">
                <span>Company Name</span>
                {getSortIcon('companyName')}
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort('contactName')}
            >
              <div className="flex items-center space-x-1">
                <span>Contact Name</span>
                {getSortIcon('contactName')}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort('createdAt')}
            >
              <div className="flex items-center space-x-1">
                <span>Created</span>
                {getSortIcon('createdAt')}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {customer.companyName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{customer.contactName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{customer.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{customer.phone || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {formatDate(customer.createdAt)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                <button
                  onClick={() => handleDropdownToggle(customer.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {openDropdown === customer.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <Link
                        href={`/dashboard/customers/${customer.id}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <Eye className="w-4 h-4 mr-3" />
                        View Details
                      </Link>
                      <Link
                        href={`/dashboard/customers/${customer.id}/edit`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <Edit className="w-4 h-4 mr-3" />
                        Edit Customer
                      </Link>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <Trash2 className="w-4 h-4 mr-3" />
                        Delete Customer
                      </button>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
