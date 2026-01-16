import React from 'react';
import { motion } from 'framer-motion';
import { RotateCw, ShieldCheck, SmilePlus } from 'lucide-react';

export default function Returns() {
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
            <RotateCw className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-cursive text-love-dark mb-2">Returns &amp; Exchanges</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            If something isn&apos;t quite perfect with your LoveCraft order, we&apos;ll help you
            make it right with a simple, friendly returns process.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-love-pink/20 p-6 sm:p-8 space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-love-dark mb-2">Return window</h2>
            <p className="text-sm text-gray-600">
              You can request a return or exchange within <span className="font-semibold">14 days</span> of delivery
              for most non‑personalized items, as long as they are unused and in their original packaging.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-love-dark font-semibold">
                <ShieldCheck className="h-5 w-5 text-love-red" />
                <span>Eligible items</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Standard gifts in new, unused condition</li>
                <li>Items damaged in transit (with photo proof)</li>
                <li>Wrong item received compared to your order</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-love-dark font-semibold">
                <SmilePlus className="h-5 w-5 text-love-red" />
                <span>Not usually returnable</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Fully personalized items with names, dates or custom messages</li>
                <li>Digital products or instant downloads</li>
                <li>Items clearly used or damaged after delivery</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-love-dark mb-2">How to request a return</h2>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
              <li>Have your order number and the email used at checkout ready.</li>
              <li>
                Contact our support team via the{' '}
                <a href="/contact" className="text-love-red hover:underline">
                  contact page
                </a>{' '}
                or email <span className="font-mono text-gray-700">support@lovecraft.com</span>.
              </li>
              <li>Share a short description and, if applicable, photos of the issue.</li>
              <li>We&apos;ll reply with simple instructions and the next steps for your case.</li>
            </ol>
          </div>

          <div className="border-t border-love-pink/20 pt-4 text-xs text-gray-500">
            <p>
              Note: This is a demo store returns policy for Valentine&apos;s gifting scenarios. In a real
              store, always review the detailed legal policy at checkout.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

