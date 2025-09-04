export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Sales Management</h2>
          <p className="text-sm text-gray-600 mt-1">Track and manage your sales transactions</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">$127,450</p>
              <p className="text-sm text-gray-500">Total Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">1,284</p>
              <p className="text-sm text-gray-500">Total Sales</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">47</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">$99.32</p>
              <p className="text-sm text-gray-500">Avg. Order</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">Sales management interface will be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
