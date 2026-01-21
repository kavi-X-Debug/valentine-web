import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingCart, User, Menu, X, LogOut, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase/config';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhotoURL, setProfilePhotoURL] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [inboxCount, setInboxCount] = useState(0);

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

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setInboxCount(0);
      return;
    }
    const userId = currentUser.uid;
    if (!userId) {
      setInboxCount(0);
      return;
    }
    const q = query(
      collection(db, 'productMessages'),
      where('userId', '==', userId)
    );
    const unsub = onSnapshot(
      q,
      snapshot => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const unread = list.filter(m => {
          const hasAnswer = m.answer && String(m.answer).trim();
          const userHasRead = m.userHasRead === true;
          return hasAnswer && !userHasRead;
        });
        setInboxCount(unread.length);
      },
      (error) => {
        console.error('Navbar inbox subscription error:', error);
        setInboxCount(0);
      }
    );
    return () => unsub();
  }, [currentUser]);

  const linkBase = "relative group text-love-dark font-medium font-oldSans";
  function NavLink({ to, children }) {
    const active = location.pathname === to;
    return (
      <Link to={to} className={`${linkBase} hover:text-love-red transition-colors`}>
        <span>{children}</span>
        <span className={`absolute left-0 -bottom-1 h-0.5 bg-gradient-to-r from-love-red to-love-pink transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
      </Link>
    );
  }

  return (
    <nav className={`sticky top-0 z-50 border-b border-love-pink/30 transition-all font-oldSans ${scrolled ? 'bg-white/85 backdrop-blur-xl shadow-lg' : 'bg-love-light/80 backdrop-blur-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between ${scrolled ? 'h-14' : 'h-16'} transition-all`}>
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Heart className="h-8 w-8 text-love-red fill-current group-hover:animate-pulse" />
              </motion.div>
              <motion.span
                initial={false}
                animate={{ color: scrolled ? '#0f172a' : '#1f2937' }}
                className="font-oldCursive text-3xl font-bold"
              >
                LoveCraft
              </motion.span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/products">Gifts</NavLink>
            <NavLink to="/categories">Categories</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <a
              href="/valentine-surprise/index.html"
              className={`${linkBase} hover:text-love-red transition-colors`}
            >
              <span>Wish</span>
              <span className="absolute left-0 -bottom-1 h-0.5 bg-gradient-to-r from-love-red to-love-pink w-0 group-hover:w-full transition-all duration-300" />
            </a>
            {currentUser && (
              <Link to="/inbox" className="relative group text-love-dark hover:text-love-red transition-colors">
                <motion.div whileHover={{ scale: 1.1 }} className="relative">
                  <Mail className="h-6 w-6" />
                  {inboxCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-love-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                      {inboxCount > 9 ? '9+' : inboxCount}
                    </span>
                  )}
                </motion.div>
              </Link>
            )}
            <Link to="/cart" className="relative group text-love-dark hover:text-love-red transition-colors">
              <motion.div whileHover={{ scale: 1.1 }} className="relative">
                <ShoppingCart className="h-6 w-6" />
              </motion.div>
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
                    <img src={profilePhotoURL || currentUser.photoURL} alt="Avatar" loading="lazy" className="h-8 w-8 rounded-full object-cover border border-love-pink/30" />
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
                <NavLink to="/login">Login</NavLink>
                <Link to="/signup" className="bg-love-red text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
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
              <Link to="/categories" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-love-dark hover:text-love-red hover:bg-love-light">Categories</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-love-dark hover:text-love-red hover:bg-love-light">Contact</Link>
              <a href="/valentine-surprise/index.html" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-love-dark hover:text-love-red hover:bg-love-light">Wish</a>
              {currentUser && (
                <Link to="/inbox" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-love-dark hover:text-love-red hover:bg-love-light">Inbox</Link>
              )}
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
