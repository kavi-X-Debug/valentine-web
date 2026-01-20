import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product, isFavorite, onToggleFavorite }) {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const ratingBase = (product.id % 10) / 10;
  const rating = 4 + ratingBase;
  const ratingText = rating.toFixed(1);
  const reviewsCount = 40 + (product.id % 60);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg overflow-hidden border border-love-pink/30 transition-all h-full flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-110" 
        />
        <button
          onClick={onToggleFavorite}
          aria-pressed={!!isFavorite}
          className="absolute top-3 right-3 p-2 bg-white/80 rounded-full transition-colors"
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'text-love-red' : 'text-gray-400'}`} />
        </button>
      </div>
      
      <div className="p-4 sm:p-5 flex flex-col h-full">
        <div className="text-xs text-love-red font-medium mb-1 uppercase tracking-wider">{product.category}</div>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 hover:text-love-red transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center text-[11px] text-gray-500 mb-2 space-x-1">
          <div className="flex items-center text-yellow-400">
            <Star className="h-3 w-3 fill-current" />
          </div>
          <span>{ratingText}</span>
          <span>•</span>
          <span>{reviewsCount} reviews</span>
        </div>
        <div className="flex flex-col mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-love-dark">${product.price.toFixed(2)}</span>
            <button 
              onClick={() => {
                if (!currentUser) {
                  navigate('/login');
                  return;
                }
                setShowConfirm(true);
              }}
              className="flex items-center space-x-1 bg-love-light text-love-red px-3 py-2 rounded-lg hover:bg-love-red hover:text-white transition-colors text-sm font-medium"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
          {showConfirm && (
            <div className="mt-1 bg-love-light/60 border border-love-pink/40 rounded-lg px-3 py-2 text-xs">
              <p className="text-gray-700 mb-2">Add "{product.name}" to your cart?</p>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="px-2 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(product);
                    setShowConfirm(false);
                  }}
                  className="px-2 py-1 rounded-md bg-love-red text-white hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
