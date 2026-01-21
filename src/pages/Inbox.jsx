import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Inbox() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setMessages([]);
      setLoading(false);
      return;
    }
    const userId = currentUser.uid;
    if (!userId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(
      collection(db, 'productMessages'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(
      q,
      snapshot => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setMessages(list);
        setLoading(false);
      },
      () => {
        setMessages([]);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-love-pink/20 p-8 text-center"
        >
          <h1 className="text-2xl font-cursive text-love-dark mb-3">Inbox</h1>
          <p className="text-sm text-gray-600 mb-6">
            Please sign in to view your messages and replies from the store.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-love-red text-white text-sm font-medium hover:bg-red-700 transition-colors shadow-md"
          >
            Go to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-10 -top-10 h-40 bg-gradient-to-r from-love-light/60 via-white to-love-light/60 blur-3xl opacity-60"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        />
        <motion.div
          layout
          className="bg-white rounded-2xl shadow-lg border border-love-pink/20 p-6 sm:p-8 relative overflow-hidden"
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <div className="flex items-center justify-between gap-3 mb-4">
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="text-2xl sm:text-3xl font-cursive text-love-dark"
            >
              Your Inbox
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="hidden sm:flex items-center text-[11px] text-gray-500 bg-love-light/40 px-3 py-1 rounded-full border border-love-pink/40"
            >
              <span className="w-2 h-2 rounded-full bg-love-red mr-2 animate-pulse" />
              Real-time updates from the store team
            </motion.div>
          </div>

          {loading ? (
            <div className="text-gray-600 text-sm">Loading your messages...</div>
          ) : messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-gray-600 text-sm"
            >
              You have no messages yet. Ask questions on product pages to see replies here.
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="space-y-4 max-h-[32rem] overflow-y-auto pr-1"
            >
              {messages.map((m, index) => {
                const createdAt = m.createdAt && m.createdAt.toDate
                  ? m.createdAt.toDate().toLocaleString()
                  : '';
                const answeredAt = m.answeredAt && m.answeredAt.toDate
                  ? m.answeredAt.toDate().toLocaleString()
                  : '';
                const hasAnswer = m.answer && String(m.answer).trim();
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.03 * index }}
                    className="border border-gray-100 rounded-2xl p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold text-gray-800">
                        {m.productName || 'Product question'}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {createdAt}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-end">
                        <div className="max-w-[80%] rounded-2xl px-3 py-2 bg-love-red text-white text-xs sm:text-sm">
                          {m.question}
                        </div>
                      </div>
                      {hasAnswer && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] rounded-2xl px-3 py-2 bg-white border border-love-pink/40 text-xs sm:text-sm text-gray-800">
                            {m.answer}
                            {answeredAt && (
                              <div className="mt-1 text-[10px] text-gray-400">
                                Replied at {answeredAt}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {!hasAnswer && (
                        <div className="flex justify-start">
                          <div className="text-[11px] text-gray-500">
                            Waiting for reply from the store
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

