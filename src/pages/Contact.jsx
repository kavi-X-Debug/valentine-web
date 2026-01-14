import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-4xl font-cursive text-love-dark mb-6">Contact Us</h1>
        <p className="text-gray-600 mb-8">We’d love to hear from you. Send us a note and we’ll get back soon.</p>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-love-pink/20">
          {submitted && <div className="mb-4 bg-green-100 text-green-700 px-4 py-2 rounded">Message sent. Thank you!</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                value={form.message}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-love-red text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
