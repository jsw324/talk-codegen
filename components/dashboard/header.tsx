'use client';

import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const pageTitle: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/customers': 'Customers',
  '/dashboard/products': 'Products',
  '/dashboard/sales': 'Sales',
  '/dashboard/reports': 'Reports',
};

const breadcrumbs: Record<string, string[]> = {
  '/dashboard': ['Dashboard', 'Overview'],
  '/dashboard/customers': ['Dashboard', 'Customers'],
  '/dashboard/products': ['Dashboard', 'Products'],
  '/dashboard/sales': ['Dashboard', 'Sales'],
  '/dashboard/reports': ['Dashboard', 'Reports'],
};

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const title = pageTitle[pathname] || 'Dashboard';
  const breadcrumbItems = breadcrumbs[pathname] || ['Dashboard'];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page title and breadcrumbs */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              {breadcrumbItems.map((item, index) => (
                <span key={item} className="flex items-center gap-2">
                  {item}
                  {index < breadcrumbItems.length - 1 && (
                    <span className="text-gray-300">/</span>
                  )}
                </span>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
        </div>

        {/* User info placeholder */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-900">John Doe</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">JD</span>
          </div>
        </div>
      </div>
    </header>
  );
}
