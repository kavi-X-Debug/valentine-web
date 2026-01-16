import React from 'react';
import { Heart, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-love-pink/30 pt-12 pb-8 font-oldSans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-love-red fill-current" />
              <span className="font-oldCursive text-2xl text-love-dark font-bold">LoveCraft</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Handcrafted gifts for your special moments. Celebrating love, one gift at a time.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-love-dark mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/products" className="hover:text-love-red transition-colors">All Gifts</Link></li>
              <li><Link to="/products?category=handmade" className="hover:text-love-red transition-colors">Handmade Crafts</Link></li>
              <li><Link to="/products?category=personalized" className="hover:text-love-red transition-colors">Personalized Items</Link></li>
              <li><Link to="/products?category=cards" className="hover:text-love-red transition-colors">Gift Cards</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-love-dark mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/contact" className="hover:text-love-red transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-love-red transition-colors">FAQs</Link></li>
              <li><Link to="/shipping" className="hover:text-love-red transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-love-red transition-colors">Returns</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-love-dark mb-4">Stay in Love</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-love-red transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-love-red transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-love-red transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} LoveCraft. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
