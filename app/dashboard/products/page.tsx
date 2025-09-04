export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Product Catalog</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your product inventory and pricing</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">89</p>
              <p className="text-sm text-gray-500">Total Products</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">12</p>
              <p className="text-sm text-gray-500">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">5</p>
              <p className="text-sm text-gray-500">Low Stock</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">Product catalog interface will be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
