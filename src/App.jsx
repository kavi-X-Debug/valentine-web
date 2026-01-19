import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingHearts from './components/FloatingHearts';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Admin = lazy(() => import('./pages/Admin'));
const Profile = lazy(() => import('./pages/Profile'));
const Contact = lazy(() => import('./pages/Contact'));
const Faq = lazy(() => import('./pages/Faq'));
const Returns = lazy(() => import('./pages/Returns'));
const Categories = lazy(() => import('./pages/Categories'));

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { currentUser, isAdmin } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-love-light/10 flex flex-col relative">
          <FloatingHearts />
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<div className="py-16 text-center text-gray-500">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/returns" element={<Returns />} />
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } 
                />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
