import { CustomerList } from "@/components/customers/customer-list";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Customer Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your customer relationships and data
        </p>
      </div>

      <CustomerList />
    </div>
  );
}
