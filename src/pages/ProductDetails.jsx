import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Star, Check, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOCK_PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetails() {
  const { id } = useParams();
  const product = MOCK_PRODUCTS.find(p => p.id === parseInt(id));
  const [customText, setCustomText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAddToCart = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setShowConfirm(true);
  };
  
  function downloadWishImage() {
    const size = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0, '#ffe4e6');
    g.addColorStop(1, '#fb7185');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    function heart(x, y, s, c) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s, s);
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.bezierCurveTo(12, -28, 40, -18, 40, 6);
      ctx.bezierCurveTo(40, 26, 18, 40, 0, 52);
      ctx.bezierCurveTo(-18, 40, -40, 26, -40, 6);
      ctx.bezierCurveTo(-40, -18, -12, -28, 0, -10);
      ctx.closePath();
      ctx.fillStyle = c;
      ctx.fill();
      ctx.restore();
    }
    for (let i = 0; i < 24; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const s = 0.3 + Math.random() * 0.8;
      const c = Math.random() < 0.5 ? 'rgba(225,29,72,0.15)' : 'rgba(251,113,133,0.15)';
      heart(x, y, s, c);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    const r = 80;
    ctx.beginPath();
    ctx.moveTo(140 + r, 180);
    ctx.arcTo(size - 140, 180, size - 140, size - 180, r);
    ctx.arcTo(size - 140, size - 180, 140, size - 180, r);
    ctx.arcTo(140, size - 180, 140, 180, r);
    ctx.arcTo(140, 180, size - 140, 180, r);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#e11d48';
    ctx.textAlign = 'center';
    ctx.font = 'bold 72px Georgia';
    ctx.fillText('With Love', size / 2, 300);
    ctx.fillStyle = '#0f172a';
    ctx.font = '600 56px Georgia';
    ctx.fillText(product.name, size / 2, 390);
    ctx.fillStyle = '#334155';
    ctx.font = 'italic 36px Georgia';
    const msg = customText?.trim() ? customText.trim() : 'You make my world brighter';
    const lines = [];
    let current = '';
    const words = msg.split(/\s+/);
    words.forEach(w => {
      const test = current ? current + ' ' + w : w;
      if (ctx.measureText(test).width > size - 360) {
        lines.push(current);
        current = w;
      } else {
        current = test;
      }
    });
    if (current) lines.push(current);
    lines.slice(0, 4).forEach((line, i) => {
      ctx.fillText(line, size / 2, 480 + i * 48);
    });
    ctx.fillStyle = '#e11d48';
    heart(size / 2, 620, 1.2, '#e11d48');
    ctx.fillStyle = '#64748b';
    ctx.font = '500 28px Georgia';
    ctx.fillText('LoveCraft', size / 2, size - 220);
    const link = document.createElement('a');
    link.download = 'wish-card.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <Link to="/products" className="mt-4 text-love-red hover:underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-love-red mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Gifts
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl overflow-hidden shadow-lg border border-love-pink/20"
        >
          <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover object-top" />
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <div className="text-sm text-love-red font-medium uppercase tracking-wider mb-2">{product.category}</div>
            <h1 className="text-4xl font-cursive text-love-dark mb-2">{product.name}</h1>
            <div className="flex items-center space-x-2 text-yellow-500 text-sm mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-gray-400">(24 reviews)</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
          </div>

          <p className="text-gray-600 leading-relaxed">
            {product.description || "Celebrate your love with this handcrafted treasure. Perfect for anniversaries, Valentine's Day, or just because."}
          </p>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div>
              <label htmlFor="custom-text" className="block text-sm font-medium text-gray-700 mb-2">
                Custom Message (Optional)
              </label>
              <textarea
                id="custom-text"
                rows={3}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-love-pink focus:ring-love-pink text-sm p-3 border"
                placeholder="Enter names, dates, or a short love note..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-50"
              >
                -
              </button>
              <span className="px-3 py-2 font-medium w-12 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-50"
              >
                +
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full">
              <button 
                onClick={handleAddToCart}
                disabled={added}
                className={`w-full sm:flex-1 px-6 py-3 rounded-lg font-medium transition-colors shadow-md flex items-center justify-center space-x-2 ${added ? 'bg-green-600 text-white' : 'bg-love-red text-white hover:bg-red-700'}`}
              >
                {added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                <span>{added ? 'Added to Cart' : 'Add to Cart'}</span>
              </button>
              <button
                onClick={downloadWishImage}
                className="w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-colors shadow-md flex items-center justify-center space-x-2 bg-white text-love-red border border-love-pink/30 hover:bg-love-light"
              >
                <Download className="h-5 w-5" />
                <span>Download Wish Image</span>
              </button>
              <button className="w-full sm:w-auto p-3 border border-gray-300 rounded-lg hover:border-love-red hover:text-love-red transition-colors flex items-center justify-center">
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-4">
             <div className="flex items-center"><Check className="h-4 w-4 mr-1 text-green-500" /> In Stock</div>
             <div className="flex items-center"><Check className="h-4 w-4 mr-1 text-green-500" /> Free Shipping</div>
          </div>
        </motion.div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl border border-love-pink/30 p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold text-love-dark mb-2">Add to cart?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Add "{product.name}"{quantity > 1 ? ` (x${quantity})` : ''} to your cart?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  addToCart(product, quantity, customText);
                  setAdded(true);
                  setShowConfirm(false);
                  setTimeout(() => setAdded(false), 2000);
                }}
                className="px-4 py-2 rounded-lg bg-love-red text-white hover:bg-red-700 text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
