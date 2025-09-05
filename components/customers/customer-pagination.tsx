'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface CustomerPaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

export function CustomerPagination({ pagination, onPageChange }: CustomerPaginationProps) {
  const { page, total, pages } = pagination;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(pages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < pages - 1) {
      rangeWithDots.push('...', pages);
    } else if (pages > 1) {
      rangeWithDots.push(pages);
    }

    return rangeWithDots;
  };

  if (pages <= 1) return null;

  const startItem = (page - 1) * pagination.limit + 1;
  const endItem = Math.min(page * pagination.limit, total);

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span> to{' '}
        <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{total}</span> customers
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getVisiblePages().map((pageNumber, index) => (
          <button
            key={index}
            onClick={() => typeof pageNumber === 'number' ? onPageChange(pageNumber) : undefined}
            disabled={pageNumber === '...'}
            className={`relative inline-flex items-center px-4 py-2 rounded-md border text-sm font-medium ${
              pageNumber === page
                ? 'bg-blue-600 border-blue-600 text-white'
                : pageNumber === '...'
                ? 'border-gray-300 bg-white text-gray-500 cursor-default'
                : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
