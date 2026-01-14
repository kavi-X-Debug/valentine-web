import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Gift, Truck, ShieldCheck, Heart } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-16 pb-16"
    >
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-love-light via-white to-love-light opacity-90 z-10"></div>
        <div className="absolute inset-0 bg-hearts-pattern opacity-10 z-0"></div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-cursive text-love-red mb-6 drop-shadow-sm">
              Make This Valentine's Unforgettable
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto font-light">
              Discover handcrafted gifts, personalized treasures, and romantic surprises designed to celebrate your unique love story.
            </p>
            <Link to="/products" className="inline-flex items-center bg-love-red text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-red-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
        
        {/* Floating Hearts Animation Background (Simplified) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
           {/* We can add complex CSS animations here later */}
        </div>
      </section>

      {/* Featured Gifts Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-cursive text-love-dark mb-4">Featured Collections</h2>
          <p className="text-gray-600">Handpicked favorites for your special someone</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Personalized Jewelry", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800", link: "/products?cat=jewelry" },
            { title: "Handmade Crafts", img: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800", link: "/products?cat=crafts" },
            { title: "Romantic Gift Sets", img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800", link: "/products?cat=sets" }
          ].map((item, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -10 }}
              className="relative group overflow-hidden rounded-2xl shadow-md aspect-[4/5]"
            >
              <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-white text-2xl font-cursive mb-2">{item.title}</h3>
                  <Link to={item.link} className="text-white/90 text-sm hover:text-white underline">Explore Collection</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-love-light text-love-red mb-4">
                <Gift className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unique Handmade Gifts</h3>
              <p className="text-gray-600">Each item is crafted with love and care, ensuring a unique gift for your partner.</p>
            </div>
            <div className="p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-love-light text-love-red mb-4">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast & Secure Delivery</h3>
              <p className="text-gray-600">We ensure your gifts arrive on time and in perfect condition for the big day.</p>
            </div>
            <div className="p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-love-light text-love-red mb-4">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">Shop with confidence using our secure payment gateways.</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
