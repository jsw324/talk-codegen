export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">$127,450</p>
          <p className="text-sm text-gray-500 mt-1">+12.5% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Sales</h3>
          <p className="text-3xl font-bold text-blue-600">1,284</p>
          <p className="text-sm text-gray-500 mt-1">+8.2% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Customers</h3>
          <p className="text-3xl font-bold text-purple-600">542</p>
          <p className="text-sm text-gray-500 mt-1">+3.1% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Products</h3>
          <p className="text-3xl font-bold text-orange-600">89</p>
          <p className="text-sm text-gray-500 mt-1">2 new this month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">Order #{1000 + i}</p>
                  <p className="text-sm text-gray-500">Customer {i}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${(Math.random() * 1000 + 100).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Today</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-3">
            {['Product A', 'Product B', 'Product C', 'Product D', 'Product E'].map((product, i) => (
              <div key={product} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{product}</p>
                  <p className="text-sm text-gray-500">{Math.floor(Math.random() * 100 + 20)} sales</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${(Math.random() * 500 + 50).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
