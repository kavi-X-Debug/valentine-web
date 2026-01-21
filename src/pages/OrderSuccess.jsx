import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Heart, ArrowRight } from 'lucide-react';
import Lottie from 'lottie-react';
import confettiAnimation from '../../Confetti.json';

export default function OrderSuccess() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-love-light/30 px-4 relative overflow-hidden">
      <Lottie
        animationData={confettiAnimation}
        loop={false}
        autoplay
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none'
        }}
      />
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-love-pink/20 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-love-red to-love-pink" />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="h-10 w-10 text-green-600" />
        </motion.div>
        
        <h1 className="text-3xl font-cursive text-love-dark mb-4">Order Placed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. We're preparing your romantic gifts with love! You'll receive a confirmation email shortly.
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/products" 
            className="block w-full bg-love-red text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Continue Shopping
          </Link>
          
          <Link 
            to="/" 
            className="block w-full bg-white text-love-dark border border-gray-200 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
        
        <div className="mt-8 flex justify-center space-x-2 text-love-pink/60">
          <Heart className="h-4 w-4 fill-current animate-pulse" />
          <Heart className="h-4 w-4 fill-current animate-pulse delay-75" />
          <Heart className="h-4 w-4 fill-current animate-pulse delay-150" />
        </div>
      </motion.div>
    </div>
  );
}
