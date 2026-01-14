import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product, isFavorite, onToggleFavorite }) {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden border border-love-pink/20 transition-all"
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
        />
        <button
          onClick={onToggleFavorite}
          aria-pressed={!!isFavorite}
          className="absolute top-3 right-3 p-2 bg-white/80 rounded-full transition-colors"
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'text-love-red' : 'text-gray-400'}`} />
        </button>
      </div>
      
      <div className="p-4">
        <div className="text-xs text-love-red font-medium mb-1 uppercase tracking-wider">{product.category}</div>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-love-red transition-colors truncate">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-love-dark">${product.price.toFixed(2)}</span>
          <button 
            onClick={() => {
              if (!currentUser) {
                const go = window.confirm('Please log in to add items to your cart.\nPress OK to log in, or Cancel to browse more.');
                if (go) navigate('/login');
                return;
              }
              const ok = window.confirm('Add this item to your cart?');
              if (!ok) return;
              addToCart(product);
            }}
            className="flex items-center space-x-1 bg-love-light text-love-red px-3 py-2 rounded-lg hover:bg-love-red hover:text-white transition-colors text-sm font-medium"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
