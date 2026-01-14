import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhotoURL, setProfilePhotoURL] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      if (!currentUser) {
        if (active) {
          setProfileName('');
          setProfilePhotoURL('');
        }
        return;
      }
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(userRef);
        if (!active) return;
        if (snap.exists()) {
          const data = snap.data();
          setProfileName(data.name || '');
          setProfilePhotoURL(data.photoURL || '');
        } else {
          setProfileName('');
          setProfilePhotoURL('');
        }
      } catch {
        setProfileName('');
        setProfilePhotoURL('');
      }
    }
    loadProfile();
    return () => { active = false; };
  }, [currentUser]);

  return (
    <nav className="bg-love-light/80 backdrop-blur-md sticky top-0 z-50 border-b border-love-pink/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Heart className="h-8 w-8 text-love-red fill-current group-hover:animate-pulse" />
              </motion.div>
              <span className="font-cursive text-3xl text-love-dark font-bold">LoveCraft</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-love-dark hover:text-love-red transition-colors font-medium">Home</Link>
            <Link to="/products" className="text-love-dark hover:text-love-red transition-colors font-medium">Gifts</Link>
            <Link to="/contact" className="text-love-dark hover:text-love-red transition-colors font-medium">Contact</Link>
            <Link to="/wish" className="text-love-dark hover:text-love-red transition-colors font-medium">Wish</Link>
            <Link to="/cart" className="relative text-love-dark hover:text-love-red transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-love-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-love-dark hover:text-love-red">
                  {(profilePhotoURL || currentUser.photoURL) ? (
                    <img src={profilePhotoURL || currentUser.photoURL} alt="Avatar" className="h-8 w-8 rounded-full object-cover border border-love-pink/30" />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                  <span className="max-w-[160px] truncate">{profileName || currentUser.displayName || currentUser.email}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-love-light">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-love-light">Sign out</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-love-dark hover:text-love-red font-medium">Login</Link>
                <Link to="/signup" className="bg-love-red text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-love-dark hover:text-love-red focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-love-pink/30 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-love-dark hover:text-love-red hover:bg-love-light">Home</Link>
              <Link to="/products" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-love-dark hover:text-love-red hover:bg-love-light">Gifts</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-love-dark hover:text-love-red hover:bg-love-light">Contact</Link>
              <Link to="/wish" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-love-dark hover:text-love-red hover:bg-love-light">Wish</Link>
              <Link to="/cart" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-love-dark hover:text-love-red hover:bg-love-light">Cart</Link>
              {currentUser ? (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-love-dark hover:text-love-red hover:bg-love-light">Profile</Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-love-dark hover:text-love-red hover:bg-love-light">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-love-dark hover:text-love-red hover:bg-love-light">Login</Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-love-dark hover:text-love-red hover:bg-love-light">Sign Up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
