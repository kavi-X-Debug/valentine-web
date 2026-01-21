import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageCircle, Instagram, MessageSquare } from 'lucide-react';

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-4xl font-cursive text-love-dark mb-3">Contact Us</h1>
        <p className="text-gray-600 mb-8">We’d love to hear from you. Choose the way that suits you best.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-love-pink/20">
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
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-love-pink/20">
              <h2 className="text-lg font-semibold text-love-dark mb-3">Instant contact</h2>
              <p className="text-sm text-gray-600 mb-4">Reach us quickly using your favourite app.</p>
              <div className="space-y-3">
                <a
                  href="https://wa.me/15551234567"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-4 py-3 rounded-xl border border-green-500 text-green-600 hover:bg-green-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-green-500 text-white">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">WhatsApp</div>
                      <div className="text-xs text-gray-500">Tap to open chat</div>
                    </div>
                  </div>
                </a>
                <a
                  href="https://instagram.com/lovecraft_gifts"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-4 py-3 rounded-xl border border-pink-500 text-pink-600 hover:bg-pink-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-pink-500 text-white">
                      <Instagram className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Instagram DM</div>
                      <div className="text-xs text-gray-500">@lovecraft_gifts</div>
                    </div>
                  </div>
                </a>
                <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-blue-500 text-white">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Live chat (coming soon)</div>
                      <div className="text-xs text-gray-500">Chat with our support team</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-love-pink/20">
              <h2 className="text-lg font-semibold text-love-dark mb-3">More ways to reach us</h2>
              <div className="space-y-3 text-sm text-gray-700">
                <a href="mailto:support@lovecraft.com" className="flex items-center space-x-3 hover:text-love-red transition-colors">
                  <Mail className="h-4 w-4 text-love-red" />
                  <span>support@lovecraft.com</span>
                </a>
                <a href="tel:+94763919823" className="flex items-center space-x-3 hover:text-love-red transition-colors">
                  <Phone className="h-4 w-4 text-love-red" />
                  <span>+94 763919823</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
