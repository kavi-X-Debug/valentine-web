import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-cursive text-gray-800 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't found the perfect gift yet.</p>
        <Link to="/products" className="inline-flex items-center bg-love-red text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors">
          Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-cursive text-love-dark mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.customText}`} className="flex flex-col sm:flex-row items-start sm:items-center bg-white p-4 rounded-xl shadow-sm border border-love-pink/20 gap-4 sm:gap-6">
              <img src={item.image} alt={item.name} loading="lazy" className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
              <div className="sm:ml-2 flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-love-red font-medium">${item.price.toFixed(2)}</p>
                {item.customText && <p className="text-sm text-gray-500 mt-1">Note: {item.customText}</p>}
              </div>
              <div className="flex items-center sm:items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={() => updateQuantity(item.id, item.customText, item.quantity - 1)}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="px-2 text-sm font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.customText, item.quantity + 1)}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id, item.customText)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-md border border-love-pink/20 md:sticky md:top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <Link 
              to="/checkout"
              className="block text-center w-full mt-8 bg-love-red text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
