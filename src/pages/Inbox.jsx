import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Inbox() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasMessages = !loading && messages.length > 0;
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replySendingId, setReplySendingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

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
        const deduped = [];
        const seen = new Set();
        for (const m of list) {
          const key = String(m.productId || 'none') + '|' + String(m.messageType || 'product');
          if (seen.has(key)) continue;
          seen.add(key);
          deduped.push(m);
        }
        setMessages(deduped);
        setLoading(false);
      },
      () => {
        setMessages([]);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [currentUser]);

  useEffect(() => {
    if (!hasMessages) {
      if (selectedId !== null) {
        setSelectedId(null);
      }
      return;
    }
    if (selectedId === null && messages.length > 0) {
      const first = messages[0];
      setSelectedId(first.id);
      const hasAnswer = first.answer && String(first.answer).trim();
      const userHasRead = first.userHasRead === true;
      if (hasAnswer && !userHasRead) {
        const ref = doc(db, 'productMessages', first.id);
        updateDoc(ref, { userHasRead: true }).catch(() => {});
      }
      return;
    }
    if (selectedId !== null) {
      const current = messages.find(m => m.id === selectedId) || null;
      if (!current && messages.length > 0) {
        const first = messages[0];
        setSelectedId(first.id);
        const hasAnswer = first.answer && String(first.answer).trim();
        const userHasRead = first.userHasRead === true;
        if (hasAnswer && !userHasRead) {
          const ref = doc(db, 'productMessages', first.id);
          updateDoc(ref, { userHasRead: true }).catch(() => {});
        }
      } else if (current) {
        const hasAnswer = current.answer && String(current.answer).trim();
        const userHasRead = current.userHasRead === true;
        if (hasAnswer && !userHasRead) {
          const ref = doc(db, 'productMessages', current.id);
          updateDoc(ref, { userHasRead: true }).catch(() => {});
        }
      }
    }
  }, [hasMessages, messages, selectedId]);

  async function handleThreadReply(thread) {
    if (!currentUser || !thread || !thread.id) return;
    const raw = replyDrafts[thread.id] || '';
    const text = raw.trim();
    if (!text) return;
    setReplySendingId(thread.id);
    try {
      const ref = doc(db, 'productMessages', thread.id);
      await updateDoc(ref, {
        question: text,
        status: 'open',
        answeredAt: null,
        userHasRead: true,
        thread: arrayUnion({
          from: 'user',
          text,
          createdAt: Date.now()
        })
      });
      setReplyDrafts(prev => ({ ...prev, [thread.id]: '' }));
    } catch (err) {
      console.error('Failed to send reply', err);
    } finally {
      setReplySendingId(null);
    }
  }

  const unseenChatsCount = useMemo(() => {
    return messages.filter(m => {
      if (!m) return false;
      const hasAnswer = m.answer && String(m.answer).trim();
      const userHasRead = m.userHasRead === true;
      return hasAnswer && !userHasRead;
    }).length;
  }, [messages]);

  const selected = selectedId
    ? messages.find(m => m.id === selectedId) || null
    : null;

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="text-3xl sm:text-4xl font-cursive text-love-dark tracking-tight"
              >
                Your Inbox
              </motion.h1>
              {unseenChatsCount > 0 && (
                <div className="mt-1 inline-flex items-center text-[11px] text-love-red bg-white/80 px-2.5 py-0.5 rounded-full border border-love-red/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-love-red mr-2" />
                  {unseenChatsCount} new {unseenChatsCount === 1 ? 'reply' : 'replies'}
                </div>
              )}
            </div>
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

            {hasMessages && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.7fr)] gap-4">
                <div className="max-h-[32rem] overflow-y-auto pr-1 border border-love-pink/30 rounded-2xl bg-white/70">
                  {messages.map(m => {
                    const isContact =
                      m.messageType === 'contact' || m.productId === 'contact';
                    let thread = [];
                    if (Array.isArray(m.thread) && m.thread.length > 0) {
                      thread = [...m.thread];
                    } else {
                      if (m.question) {
                        thread.push({
                          from: 'user',
                          text: m.question,
                          createdAt: 0
                        });
                      }
                      if (m.answer) {
                        thread.push({
                          from: 'admin',
                          text: m.answer,
                          createdAt: 1
                        });
                      }
                    }
                    thread.sort((a, b) => {
                      const ta = typeof a.createdAt === 'number' ? a.createdAt : 0;
                      const tb = typeof b.createdAt === 'number' ? b.createdAt : 0;
                      return ta - tb;
                    });
                    const last = thread.length > 0 ? thread[thread.length - 1] : null;
                    const lastText = last ? last.text : '';
                    const lastFromUser = last ? last.from === 'user' : false;
                    const createdAt = m.createdAt && m.createdAt.toDate
                      ? m.createdAt.toDate().toLocaleString()
                      : '';
                    const hasAnswer = m.answer && String(m.answer).trim();
                    const isUnseen = hasAnswer && m.userHasRead !== true;
                    const isActive = selected && selected.id === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedId(m.id)}
                        className={
                          'w-full flex items-start gap-3 px-3 py-3 text-left transition-colors border-b border-love-pink/10 last:border-b-0 ' +
                          (isActive ? 'bg-love-light/60' : 'hover:bg-love-light/40')
                        }
                      >
                        <div
                          className={
                            'mt-1 h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ' +
                            (isContact
                              ? 'bg-blue-500 text-white'
                              : 'bg-love-red text-white')
                          }
                        >
                          {isContact ? 'CS' : 'P'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <div className="text-sm font-semibold text-love-dark break-words">
                              {m.productName || (isContact ? 'Customer Service' : 'Product chat')}
                            </div>
                            {createdAt && (
                              <div className="text-[10px] text-gray-400 whitespace-nowrap">
                                {createdAt}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-xs text-gray-600 truncate">
                              {lastText
                                ? `${lastFromUser ? 'You: ' : 'Store: '} ${lastText}`
                                : 'No messages yet'}
                            </div>
                            <div className="shrink-0 flex items-center gap-1">
                              {isUnseen && (
                                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-love-red text-white text-[10px] font-semibold">
                                  1
                                </span>
                              )}
                              {hasAnswer ? (
                                <span
                                  className={
                                    'text-[10px] px-2 py-0.5 rounded-full border ' +
                                    (isContact
                                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                                      : 'bg-green-50 text-green-700 border-green-100')
                                  }
                                >
                                  Replied
                                </span>
                              ) : (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100">
                                  Waiting
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="max-h-[32rem] rounded-2xl bg-white/80 border border-love-pink/30 flex flex-col">
                  {!selected && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-6 text-sm text-gray-500">
                      <div className="mb-2 text-lg font-semibold text-love-dark">
                        Select a chat to view messages
                      </div>
                      <div>
                        Choose a conversation on the left to see previous messages and reply.
                      </div>
                    </div>
                  )}
                  {selected && (
                    <>
                      {(() => {
                        const m = selected;
                        const createdAt = m.createdAt && m.createdAt.toDate
                          ? m.createdAt.toDate().toLocaleString()
                          : '';
                        const answeredAt = m.answeredAt && m.answeredAt.toDate
                          ? m.answeredAt.toDate().toLocaleString()
                          : '';
                        const hasAnswer = m.answer && String(m.answer).trim();
                        const isContact =
                          m.messageType === 'contact' || m.productId === 'contact';
                        let thread = [];
                        if (Array.isArray(m.thread) && m.thread.length > 0) {
                          thread = [...m.thread];
                        } else {
                          if (m.question) {
                            thread.push({
                              from: 'user',
                              text: m.question,
                              createdAt: 0
                            });
                          }
                          if (m.answer) {
                            thread.push({
                              from: 'admin',
                              text: m.answer,
                              createdAt: 1
                            });
                          }
                        }
                        thread.sort((a, b) => {
                          const ta = typeof a.createdAt === 'number' ? a.createdAt : 0;
                          const tb = typeof b.createdAt === 'number' ? b.createdAt : 0;
                          return ta - tb;
                        });
                        const draftValue = replyDrafts[m.id] || '';
                        return (
                          <>
                            <div className="px-4 py-3 border-b border-love-pink/20 flex items-center justify-between gap-2">
                              <div>
                                <div className="text-sm font-semibold text-love-dark">
                                  {m.productName || (isContact ? 'Customer Service' : 'Product chat')}
                                </div>
                                {createdAt && (
                                  <div className="text-[11px] text-gray-500">
                                    Started at {createdAt}
                                  </div>
                                )}
                              </div>
                              <div>
                                {hasAnswer ? (
                                  <span
                                    className={
                                      'text-[10px] px-2 py-0.5 rounded-full border ' +
                                      (isContact
                                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                                        : 'bg-green-50 text-green-700 border-green-100')
                                    }
                                  >
                                    Replied
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100">
                                    Waiting reply
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-base">
                              {thread.map((msg, msgIndex) => {
                                const fromUser = msg.from === 'user';
                                const key = `${m.id}-${msgIndex}`;
                                if (fromUser) {
                                  return (
                                    <div key={key} className="flex justify-end">
                                      <motion.div
                                        className={
                                          'max-w-[80%] rounded-2xl px-3 py-2 text-sm sm:text-base text-white shadow-sm ' +
                                          (isContact
                                            ? 'bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-500'
                                            : 'bg-gradient-to-br from-love-red via-rose-500 to-love-pink')
                                        }
                                        whileHover={{ scale: 1.01 }}
                                      >
                                        {msg.text}
                                      </motion.div>
                                    </div>
                                  );
                                }
                                return (
                                  <div key={key} className="flex justify-start">
                                    <motion.div
                                      className={
                                        'max-w-[80%] rounded-2xl px-3 py-2 text-sm sm:text-base shadow-sm border ' +
                                        (isContact
                                          ? 'bg-blue-50 border-blue-200 text-blue-900'
                                          : 'bg-love-light/70 border-love-pink/40 text-gray-800')
                                      }
                                      whileHover={{ scale: 1.01 }}
                                    >
                                      {msg.text}
                                    </motion.div>
                                  </div>
                                );
                              })}
                              {hasAnswer && answeredAt && (
                                <div className="flex justify-start">
                                  <div className="text-[11px] text-gray-500">
                                    Replied at {answeredAt}
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
                            <div className="px-4 py-3 border-t border-love-pink/20 flex items-center gap-2">
                              <input
                                type="text"
                                value={draftValue}
                                onChange={(e) =>
                                  setReplyDrafts(prev => ({
                                    ...prev,
                                    [m.id]: e.target.value
                                  }))
                                }
                                placeholder="Reply to this conversation..."
                                className="flex-1 px-3 py-1.5 rounded-full border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-love-red focus:border-transparent outline-none bg-white/90"
                              />
                              <button
                                type="button"
                                disabled={
                                  replySendingId === m.id || !draftValue.trim()
                                }
                                onClick={() => handleThreadReply(m)}
                                className="px-3 py-1.5 rounded-full bg-love-red text-white text-xs sm:text-sm font-medium hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                {replySendingId === m.id ? 'Sending...' : 'Reply'}
                              </button>
                            </div>
                          </>
                        );
                      })()}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
