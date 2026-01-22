import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Inbox() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasMessages = !loading && messages.length > 0;

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
      where('userId', '==', userId)
    );
    const unsub = onSnapshot(
      q,
      snapshot => {
        const list = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => {
            const ta = a.createdAt && a.createdAt.toDate ? a.createdAt.toDate().getTime() : 0;
            const tb = b.createdAt && b.createdAt.toDate ? b.createdAt.toDate().getTime() : 0;
            return tb - ta;
          });
        setMessages(list);
        setLoading(false);
        const unseenWithAnswer = list.filter(m => {
          const hasAnswer = m.answer && String(m.answer).trim();
          const userHasRead = m.userHasRead === true;
          return hasAnswer && !userHasRead;
        });
        if (unseenWithAnswer.length > 0) {
          unseenWithAnswer.forEach(m => {
            const ref = doc(db, 'productMessages', m.id);
            updateDoc(ref, { userHasRead: true }).catch(() => {});
          });
        }
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
          <h1 className="text-3xl font-cursive text-love-dark mb-3">Inbox</h1>
          <p className="text-base text-gray-600 mb-6">
            Please sign in to view your messages and replies from the store.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-love-red text-white text-base font-medium hover:bg-red-700 transition-colors shadow-md"
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
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-10 -top-10 h-48 bg-gradient-to-r from-love-red/20 via-love-pink/20 to-love-light/50 blur-3xl opacity-70"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        />
        <motion.div
          layout
          className="bg-gradient-to-br from-white via-love-light/40 to-love-pink/10 rounded-3xl shadow-xl border border-love-pink/30 p-6 sm:p-8 relative overflow-hidden"
          whileHover={{ y: -3, boxShadow: '0 20px 40px rgba(15,23,42,0.18)' }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <div className="flex items-center justify-between gap-3 mb-4">
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl sm:text-4xl font-cursive text-love-dark tracking-tight"
            >
              Your Inbox
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="hidden sm:flex items-center text-xs text-love-dark bg-white/70 backdrop-blur px-3 py-1 rounded-full border border-love-pink/40 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-love-red mr-2 animate-ping" />
              Real-time replies from the store team
            </motion.div>
          </div>

          <div className="mt-2">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-gray-600 text-base"
              >
                <span className="inline-flex h-3 w-3 rounded-full bg-love-red/70 animate-pulse" />
                Loading your messages...
              </motion.div>
            )}

            {!loading && !hasMessages && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center text-center text-gray-600 text-base py-6"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="mb-3 inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-love-red to-love-pink text-white shadow-md"
                >
                  <span className="text-xl">💌</span>
                </motion.div>
                <div className="font-medium text-lg mb-1">No messages yet</div>
                <div className="text-sm text-gray-500 max-w-xs">
                  Ask questions on product pages and you&apos;ll see all replies from the store here.
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {hasMessages && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
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
                    const isContact =
                      m.messageType === 'contact' || m.productId === 'contact';
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.35, delay: 0.03 * index }}
                        className={
                          'border rounded-2xl p-4 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow ' +
                          (isContact ? 'border-blue-300/90 bg-blue-50/70' : 'border-love-pink/30')
                        }
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-base font-semibold text-love-dark">
                            {m.productName || (isContact ? 'Contact message' : 'Product question')}
                          </div>
                          <div className="flex items-center gap-2">
                            {hasAnswer ? (
                              <span
                                className={
                                  'text-xs px-2 py-0.5 rounded-full border ' +
                                  (isContact
                                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                                    : 'bg-green-50 text-green-700 border-green-100')
                                }
                              >
                                Replied
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100">
                                Waiting reply
                              </span>
                            )}
                            <div className="text-xs text-gray-400">
                              {createdAt}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3 text-base">
                          <div className="flex justify-end">
                            <motion.div
                              className={
                                'max-w-[80%] rounded-2xl px-3 py-2 text-sm sm:text-base text-white shadow-sm ' +
                                (isContact
                                  ? 'bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-500'
                                  : 'bg-gradient-to-br from-love-red via-rose-500 to-love-pink')
                              }
                              whileHover={{ scale: 1.01 }}
                            >
                              {m.question}
                            </motion.div>
                          </div>
                          {hasAnswer && (
                            <div className="flex justify-start">
                              <motion.div
                                className={
                                  'max-w-[80%] rounded-2xl px-3 py-2 text-sm sm:text-base shadow-sm border ' +
                                  (isContact
                                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                                    : 'bg-love-light/70 border-love-pink/40 text-gray-800')
                                }
                                whileHover={{ scale: 1.01 }}
                              >
                                {m.answer}
                                {answeredAt && (
                                  <div className="mt-1 text-xs text-gray-500">
                                    Replied at {answeredAt}
                                  </div>
                                )}
                              </motion.div>
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
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
