import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Gift, Truck, ShieldCheck, Heart } from 'lucide-react';

const testimonials = [
  {
    names: 'Aiden & Maya',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1517840933442-d2d1a05edb75?auto=format&fit=crop&q=80&w=400',
    message:
      'I ordered a personalised necklace and a handwritten card. The box looked like a mini proposal and arrived the day before our anniversary.'
  },
  {
    names: 'Liam & Noor',
    location: 'Dubai, UAE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    message:
      'We built a memory box with photos, tickets and a custom engraving. It felt like something we would have spent hours DIY-ing, but it came ready to gift.'
  },
  {
    names: 'Ethan & Chloe',
    location: 'Toronto, CA',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=400',
    message:
      'The date-night bundle had everything: candles, snacks and a small keepsake. Shipping updates were clear and the unboxing felt premium, not generic.'
  },
  {
    names: 'Daniel & Priya',
    location: 'Sydney, AU',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
    message:
      'We were late planners and still managed to send a personalised gift across the city. She loved the custom star map and we framed it the same night.'
  },
  {
    names: 'Jonah & Sofia',
    location: 'New York, US',
    avatar: 'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&q=80&w=400',
    message:
      'I picked a couple set and added our initials. The sizes were accurate, the fabric felt good quality and the little note inside made her tear up.'
  },
  {
    names: 'Arjun & Meera',
    location: 'Bangalore, IN',
    avatar: 'https://images.unsplash.com/photo-1544723795-432537d12f6c?auto=format&fit=crop&q=80&w=400',
    message:
      'Customer support helped me swap the delivery address last minute. The spa gift box smelled incredible and looked exactly like the photos.'
  }
];

const dateIdeas = [
  {
    title: 'Stay‑in movie night kit',
    description: 'Cozy blankets, snacks and a surprise gift waiting on the sofa.',
    link: '/products?cat=home',
    img: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&q=80&w=900'
  },
  {
    title: 'Memory box of your story',
    description: 'Fill a keepsake box with photos, tickets and a custom note.',
    link: '/products?cat=gifts',
    img: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=900'
  },
  {
    title: 'Breakfast‑in‑bed surprise',
    description: 'Start the day with coffee, flowers and a personalised treat.',
    link: '/products?cat=food',
    img: 'https://images.unsplash.com/photo-1517677129300-07b130802f46?auto=format&fit=crop&q=80&w=900'
  }
];

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  useEffect(() => {
    const id = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-16 pb-16 font-oldSans"
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
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-oldCursive text-love-red mb-4 md:mb-6 drop-shadow-sm leading-tight">
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
          <h2 className="text-3xl sm:text-4xl font-oldCursive text-love-dark mb-4">Featured Collections</h2>
          <p className="text-gray-600">Handpicked favorites for your special someone</p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
        >
          {[
            { title: "Personalized Jewelry", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800", link: "/products?cat=jewelry" },
            { title: "Handmade Crafts", img: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800", link: "/products?cat=crafts" },
            { title: "Romantic Gift Sets", img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800", link: "/products?cat=sets" }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative group overflow-hidden rounded-2xl shadow-md aspect-[4/5]"
            >
              <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-white text-xl md:text-2xl font-oldCursive mb-2">{item.title}</h3>
                  <Link to={item.link} className="text-white/90 text-sm hover:text-white underline">Explore Collection</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <motion.section 
        className="bg-white py-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-oldCursive text-love-dark mb-3">Why Couples Choose LoveCraft</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              From the first idea to the final unboxing moment, we craft every detail with care.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="p-6 rounded-2xl border border-love-pink/20 bg-white shadow-sm"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-love-light text-love-red mb-4">
                <Gift className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unique Handmade Gifts</h3>
              <p className="text-gray-600">Each item is crafted with love and care, ensuring a unique gift for your partner.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.03 }}
              className="p-6 rounded-2xl border border-love-pink/20 bg-white shadow-sm"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-love-light text-love-red mb-4">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast & Secure Delivery</h3>
              <p className="text-gray-600">We ensure your gifts arrive on time and in perfect condition for the big day.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.06 }}
              className="p-6 rounded-2xl border border-love-pink/20 bg-white shadow-sm"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-love-light text-love-red mb-4">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">Shop with confidence using our secure payment gateways.</p>
            </motion.div>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sm sm:text-base">
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="px-4 py-3 rounded-xl bg-love-light/50 border border-love-pink/30"
            >
              <p className="text-2xl sm:text-3xl font-bold text-love-red mb-1">5k+</p>
              <p className="text-gray-600">Gifts delivered worldwide</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="px-4 py-3 rounded-xl bg-love-light/50 border border-love-pink/30"
            >
              <p className="text-2xl sm:text-3xl font-bold text-love-red mb-1">4.9/5</p>
              <p className="text-gray-600">Average rating from happy couples</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="px-4 py-3 rounded-xl bg-love-light/50 border border-love-pink/30"
            >
              <p className="text-2xl sm:text-3xl font-bold text-love-red mb-1">24/7</p>
              <p className="text-gray-600">Support for last‑minute surprises</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-16 bg-love-light/40"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-oldCursive text-love-dark mb-3">How LoveCraft Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              A simple three‑step journey from idea to unboxing that keeps the romance effortless.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative bg-white rounded-2xl shadow-sm border border-love-pink/30 px-6 py-8"
            >
              <div className="absolute -top-4 left-6 w-9 h-9 rounded-full bg-love-red text-white flex items-center justify-center text-sm font-semibold shadow-lg">
                1
              </div>
              <h3 className="mt-4 text-lg font-semibold text-love-dark mb-2">Choose the perfect gift</h3>
              <p className="text-gray-600 text-sm">
                Browse curated collections for every love story, from subtle gestures to grand surprises.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative bg-white rounded-2xl shadow-sm border border-love-pink/30 px-6 py-8"
            >
              <div className="absolute -top-4 left-6 w-9 h-9 rounded-full bg-love-red text-white flex items-center justify-center text-sm font-semibold shadow-lg">
                2
              </div>
              <h3 className="mt-4 text-lg font-semibold text-love-dark mb-2">Personalise every detail</h3>
              <p className="text-gray-600 text-sm">
                Add names, dates, or secret messages so your gift feels like it was made just for them.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative bg-white rounded-2xl shadow-sm border border-love-pink/30 px-6 py-8"
            >
              <div className="absolute -top-4 left-6 w-9 h-9 rounded-full bg-love-red text-white flex items-center justify-center text-sm font-semibold shadow-lg">
                3
              </div>
              <h3 className="mt-4 text-lg font-semibold text-love-dark mb-2">We craft and deliver</h3>
              <p className="text-gray-600 text-sm">
                Our artisans prepare your order and we ship it with care right to their doorstep.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-16 bg-white"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-oldCursive text-love-dark mb-3">Couples Who Gave With LoveCraft</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Stories from real couples who turned small gestures into unforgettable memories.
            </p>
          </div>
          <div className="relative">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-love-light/60 border border-love-pink/30 rounded-3xl px-6 sm:px-10 py-8 sm:py-10 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-200 flex-shrink-0">
                    <img
                      src={testimonials[activeTestimonial].avatar}
                      alt={testimonials[activeTestimonial].names}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-love-dark text-sm sm:text-base">
                      {testimonials[activeTestimonial].names}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {testimonials[activeTestimonial].location}
                    </p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {testimonials[activeTestimonial].message}
                </p>
              </div>
            </motion.div>
            <div className="mt-5 flex items-center justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeTestimonial
                      ? 'w-6 bg-love-red'
                      : 'w-2 bg-gray-300'
                  }`}
                  aria-label={`Show testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-16 bg-love-light/30"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-oldCursive text-love-dark mb-3">Date Night Ideas With LoveCraft</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Pair your next surprise with ready‑to‑gift ideas that keep the romance simple and sweet.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {dateIdeas.map((idea, index) => (
              <motion.div
                key={idea.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-sm border border-love-pink/30 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-40 sm:h-44 overflow-hidden">
                    <img
                      src={idea.img}
                      alt={idea.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="px-6 pt-5 pb-4">
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-love-light text-love-red mb-3">
                      <Heart className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-semibold text-love-dark mb-2">
                      {idea.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {idea.description}
                    </p>
                  </div>
                </div>
                <Link
                  to={idea.link}
                  className="inline-flex items-center text-sm font-medium text-love-red hover:text-red-700 mt-1 px-6 pb-5"
                >
                  Explore matching gifts
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
