import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function Admin() {
  // Mock products state for demo purposes
  const [products, setProducts] = useState([
    { id: 1, name: "Personalized Heart Necklace", price: 45.00, category: "Jewelry" },
    { id: 2, name: "Handmade Rose Bear", price: 35.50, category: "Handmade" },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-cursive text-love-dark">Admin Dashboard</h1>
        <button className="flex items-center space-x-2 bg-love-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-love-pink/20 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-love-light">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit className="h-4 w-4" /></button>
                  <button className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
