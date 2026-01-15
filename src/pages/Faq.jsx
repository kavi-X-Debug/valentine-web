import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HeartHandshake, Gift, ShieldCheck, Truck } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    question: 'How long will my Valentine\'s gift take to arrive?',
    answer: 'Most Valentine\'s orders are prepared within 24–48 hours and arrive in 3–5 business days with standard shipping. Express options are available at checkout for last‑minute surprises.'
  },
  {
    id: 2,
    question: 'Can I personalize my gift with names or a custom message?',
    answer: 'Yes. Many of our gifts support custom engraving, names and personal messages. Look for the “Personalize it” options on the product page and add your details before checkout.'
  },
  {
    id: 3,
    question: 'What if my partner is in another city or country?',
    answer: 'We ship to most regions worldwide. Simply enter their address at checkout, and we\'ll show available delivery times and costs for their location.'
  },
  {
    id: 4,
    question: 'Do you include the price inside the gift box?',
    answer: 'Never. Our packages are romance‑ready with no price tags inside the box, so your partner only sees the love, not the receipt.'
  },
  {
    id: 5,
    question: 'Can I track my order in real time?',
    answer: 'Once your order ships, you receive an email with a live tracking link so you can follow your gift\'s journey from our studio to their doorstep.'
  }
];

export default function Faq() {
  const [openId, setOpenId] = useState(QUESTIONS[0]?.id ?? null);

  function toggle(id) {
    setOpenId(prev => (prev === id ? null : id));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-10"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-love-light text-love-red mb-4">
            <HeartHandshake className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-cursive text-love-dark mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Answers to the most common questions about gifting, delivery and making this Valentine&apos;s unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] gap-8 items-start">
          <div className="bg-white rounded-2xl shadow-lg border border-love-pink/20 divide-y divide-gray-100">
            {QUESTIONS.map((item) => {
              const isOpen = item.id === openId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item.id)}
                  className={`w-full text-left px-5 sm:px-6 py-4 sm:py-5 focus:outline-none transition-colors ${
                    isOpen ? 'bg-love-light/40' : 'bg-white hover:bg-love-light/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm uppercase tracking-wider text-love-red mb-1 hidden sm:block">
                        {item.id < 10 ? `0${item.id}` : item.id}
                      </div>
                      <h2 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {item.question}
                      </h2>
                    </div>
                    <motion.div
                      initial={false}
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0 mt-1 text-love-red"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </div>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md border border-love-pink/20 p-6">
              <h3 className="text-lg font-semibold text-love-dark mb-3">Still can&apos;t find your answer?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our team is happy to help you choose the right gift, track an order, or create
                something uniquely romantic.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Gift className="h-4 w-4 text-love-red" />
                  <span>Ask us for personalized gift recommendations for your partner.</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-love-red" />
                  <span>Get live help if you&apos;re unsure your gift will arrive in time.</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-love-red" />
                  <span>Learn about returns, exchanges and our happiness guarantee.</span>
                </div>
              </div>
              <a
                href="mailto:support@lovecraft.com?subject=FAQ%20question"
                className="inline-flex items-center justify-center mt-5 w-full px-4 py-3 rounded-xl bg-love-red text-white text-sm font-medium shadow-lg hover:bg-red-700 transition-colors"
              >
                Send us your question
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

