import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const hadUserRef = useRef(false);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const key = currentUser ? `cart_${currentUser.uid}` : 'cart_guest';
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const getStorageKey = (user) => (user ? `cart_${user.uid}` : 'cart_guest');
  const loadCartForUser = (user) => {
    try {
      const storedCart = localStorage.getItem(getStorageKey(user));
      setCartItems(storedCart ? JSON.parse(storedCart) : []);
    } catch (error) {
      console.error("Failed to load cart from local storage", error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    loadCartForUser(currentUser);
    hadUserRef.current = !!currentUser;
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(getStorageKey(currentUser), JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to local storage", error);
    }
  }, [cartItems, currentUser]);

  function addToCart(product, quantity = 1, customText = '') {
    if (!currentUser) {
      const go = window.confirm('Please log in to add items to your cart. Go to login now?');
      if (go) navigate('/login');
      return;
    }
    setCartItems(prevItems => {
      // Check if item with same ID and same custom text exists
      const existingItemIndex = prevItems.findIndex(
        item => item.id === product.id && item.customText === customText
      );

      if (existingItemIndex > -1) {
        // Update quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Add new item
        return [...prevItems, { ...product, quantity, customText }];
      }
    });
  }

  function removeFromCart(id, customText = '') {
    setCartItems(prevItems => prevItems.filter(item => !(item.id === id && item.customText === customText)));
  }

  function updateQuantity(id, customText, newQuantity) {
    if (newQuantity < 1) return;
    setCartItems(prevItems => 
      prevItems.map(item => 
        (item.id === id && item.customText === customText) 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
