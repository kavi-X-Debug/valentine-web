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
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-love-light via-white to-love-light opacity-90 z-10" />
        <div className="absolute inset-0 bg-hearts-pattern opacity-10 z-0" />
        <div className="pointer-events-none absolute -left-24 -top-24 w-72 h-72 bg-pink-400/40 rounded-full blur-3xl z-10" />
        <div className="pointer-events-none absolute -right-24 top-32 w-80 h-80 bg-red-400/30 rounded-full blur-3xl z-10" />

        <div className="relative z-20 px-4 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center md:text-left md:max-w-xl"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 border border-love-pink/40 text-xs font-medium text-love-red mb-4 shadow-sm backdrop-blur">
              <span className="inline-flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                Valentine&apos;s 2025 Collection
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-cursive text-love-red mb-4 md:mb-6 drop-shadow-sm leading-tight">
              Make This Valentine&apos;s Unforgettable
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 md:mb-8 max-w-2xl font-light">
              Discover handcrafted gifts, personalized treasures and romantic surprises designed to
              celebrate your unique love story.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link
                to="/products"
                className="inline-flex items-center bg-love-red text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-red-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Shop Gifts <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/products?cat=sets"
                className="inline-flex items-center px-6 py-3 rounded-full text-sm md:text-base font-medium bg-white/80 backdrop-blur border border-love-pink/40 text-love-dark hover:text-love-red hover:border-love-red transition-all shadow-sm"
              >
                Browse Romantic Sets
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs md:text-sm text-gray-500">
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex h-6 px-3 items-center rounded-full bg-green-100 text-green-700 font-medium">
                  4.9★ loved by couples
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-love-red" />
                <span>Handmade & personalised</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-love-red" />
                <span>Ships in 3–5 business days</span>
              </div>
            </div>
          </motion.div>

          <div className="relative w-full md:w-[380px] h-[320px] md:h-[380px]">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute inset-y-4 left-4 right-10 rounded-3xl shadow-2xl overflow-hidden border border-white/60 bg-white/80 backdrop-blur"
            >
              <img
                src="https://images.unsplash.com/photo-1518895949257-7621c3c786d4?auto=format&fit=crop&q=80&w=900"
                alt="Romantic gift set"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
              className="absolute -bottom-6 right-0 w-40 rounded-2xl shadow-xl overflow-hidden border border-love-pink/40 bg-white"
            >
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600"
                alt="Jewelry gift"
                className="w-full h-28 object-cover"
              />
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-gray-800 truncate">Personalised Jewelry</p>
                <p className="text-[11px] text-love-red font-medium">From $39</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: [-6, 6, -6] }}
              transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', delay: 0.8 }}
              className="absolute -top-4 left-0 px-4 py-3 rounded-2xl bg-white/90 backdrop-blur shadow-lg border border-love-pink/40 flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                <span className="w-7 h-7 rounded-full bg-love-light border border-white" />
                <span className="w-7 h-7 rounded-full bg-love-red/70 border border-white" />
                <span className="w-7 h-7 rounded-full bg-rose-300 border border-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">5,000+ happy couples</p>
                <p className="text-[11px] text-gray-500">Gifting with LoveCraft</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-cursive text-love-dark mb-4">Featured Collections</h2>
          <p className="text-gray-600">Handpicked favorites for your special someone</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
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
                  <h3 className="text-white text-xl md:text-2xl font-cursive mb-2">{item.title}</h3>
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
