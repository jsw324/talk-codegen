export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Analytics & Reports</h2>
          <p className="text-sm text-gray-600 mt-1">Generate insights and business intelligence reports</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Sales Performance</h3>
              <p className="text-sm text-blue-700">Monthly sales trends and forecasting</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Customer Analytics</h3>
              <p className="text-sm text-green-700">Customer behavior and segmentation analysis</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">Product Insights</h3>
              <p className="text-sm text-purple-700">Product performance and inventory analysis</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-2">Financial Reports</h3>
              <p className="text-sm text-orange-700">Revenue, profit, and financial projections</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">Advanced reporting dashboard will be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
