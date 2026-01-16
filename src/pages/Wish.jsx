import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

export default function Wish() {
  const [you, setYou] = useState('');
  const [partner, setPartner] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [style, setStyle] = useState('classic');

  const preview = useMemo(() => {
    const n1 = you || 'You';
    const n2 = partner || 'Your Love';
    const base = message || 'Wishing us endless love, laughter, and sweet moments.';
    return `${n1} ❤️ ${n2}\n${base}\nHappy Valentine’s Day!`;
  }, [you, partner, message]);

  async function copyWish() {
    setCopied(false);
    try {
      await navigator.clipboard.writeText(preview);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function wrapLines(ctx, text, maxWidth, font) {
    ctx.font = font;
    const words = text.split(' ');
    const lines = [];
    let line = '';
    for (let i = 0; i < words.length; i++) {
      const test = line ? line + ' ' + words[i] : words[i];
      const w = ctx.measureText(test).width;
      if (w > maxWidth && line) {
        lines.push(line);
        line = words[i];
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function buildImage() {
    const n1 = (you || 'You').trim();
    const n2 = (partner || 'Your Love').trim();
    const base = (message || 'Wishing us endless love, laughter, and sweet moments.').trim();
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
    let gradientTop = '#fff1f5';
    let gradientBottom = '#fde0e6';
    let accent = '#cc1d4f';
    let bodyColor = '#6b7280';
    if (style === 'playful') {
      gradientTop = '#ffe4e6';
      gradientBottom = '#fed7e2';
      accent = '#db2777';
    } else if (style === 'dreamy') {
      gradientTop = '#e0f2fe';
      gradientBottom = '#fdf2ff';
      accent = '#1d4ed8';
      bodyColor = '#4b5563';
    }
    g.addColorStop(0, gradientTop);
    g.addColorStop(1, gradientBottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = accent;
    ctx.font = 'bold 72px Georgia';
    const title = 'Happy Valentine’s Day';
    const tw = ctx.measureText(title).width;
    ctx.fillText(title, (canvas.width - tw) / 2, 180);
    ctx.font = 'bold 64px Georgia';
    const names = `${n1} ❤️ ${n2}`;
    const nw = ctx.measureText(names).width;
    ctx.fillText(names, (canvas.width - nw) / 2, 300);
    const fontBody = '48px Arial';
    const lines = wrapLines(ctx, base, 820, fontBody);
    ctx.font = fontBody;
    ctx.fillStyle = bodyColor;
    let y = 420;
    lines.forEach(l => {
      const w = ctx.measureText(l).width;
      ctx.fillText(l, (canvas.width - w) / 2, y);
      y += 68;
    });
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.15;
    ctx.font = 'bold 240px Georgia';
    ctx.fillText('❤', 160, 860);
    ctx.fillText('❤', 760, 940);
    ctx.globalAlpha = 1;
    return canvas.toDataURL('image/png');
  }

  async function downloadImage() {
    setDownloading(true);
    try {
      const url = buildImage();
      const a = document.createElement('a');
      const n1 = (you || 'You').replace(/\s+/g, '_');
      const n2 = (partner || 'Your_Love').replace(/\s+/g, '_');
      a.href = url;
      a.download = `valentine_${n1}_${n2}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-4xl font-cursive text-love-dark mb-6">Create a Valentine Wish</h1>
        <p className="text-gray-600 mb-8">Craft a heartfelt message and share it with your partner.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-love-pink/20">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                  value={you}
                  onChange={(e) => setYou(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Partner's Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                  value={partner}
                  onChange={(e) => setPartner(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wish Message</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                  placeholder="Write your sweet message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 220))}
                />
                <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                  <span>{message.length}/220 characters</span>
                  <button
                    type="button"
                    onClick={() =>
                      setMessage('I am so grateful for every moment with you. Here is to many more memories, laughs, and late-night talks together.')
                    }
                    className="text-love-red hover:underline"
                  >
                    Fill with a sweet idea
                  </button>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Card style</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setStyle('classic')}
                    className={`px-3 py-2 rounded-full text-xs font-medium border transition-colors ${
                      style === 'classic'
                        ? 'bg-love-red text-white border-love-red'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-love-red/60'
                    }`}
                  >
                    Classic
                  </button>
                  <button
                    type="button"
                    onClick={() => setStyle('playful')}
                    className={`px-3 py-2 rounded-full text-xs font-medium border transition-colors ${
                      style === 'playful'
                        ? 'bg-love-red text-white border-love-red'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-love-red/60'
                    }`}
                  >
                    Playful
                  </button>
                  <button
                    type="button"
                    onClick={() => setStyle('dreamy')}
                    className={`px-3 py-2 rounded-full text-xs font-medium border transition-colors ${
                      style === 'dreamy'
                        ? 'bg-love-red text-white border-love-red'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-love-red/60'
                    }`}
                  >
                    Dreamy
                  </button>
                </div>
              </div>
              <button
                onClick={copyWish}
                className="w-full bg-love-red text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg"
              >
                Copy Wish
              </button>
              {copied && <div className="text-green-600 text-sm">Copied to clipboard</div>}
              <button
                onClick={downloadImage}
                disabled={downloading}
                className="w-full bg-love-dark text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors shadow-lg"
              >
                {downloading ? 'Preparing...' : 'Download Image'}
              </button>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-love-pink/20 flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                initial={{ y: 0, opacity: 0.2 }}
                animate={{ y: -20, opacity: 0.3 }}
                transition={{ repeat: Infinity, duration: 4, repeatType: 'reverse' }}
                className="text-love-pink/30 text-7xl select-none"
              >
                ❤ ❤ ❤
              </motion.div>
            </div>
            <div className="relative z-10 max-w-md text-center">
              <h2 className="text-3xl font-cursive text-love-dark mb-4">Your Wish</h2>
              <motion.pre
                key={style + preview}
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className={
                  'whitespace-pre-wrap text-gray-700 rounded-xl p-4 border border-love-pink/20 bg-gradient-to-br ' +
                  (style === 'classic'
                    ? 'from-pink-50 to-rose-100'
                    : style === 'playful'
                    ? 'from-rose-100 to-pink-200'
                    : 'from-indigo-100 to-pink-100')
                }
              >
                {preview}
              </motion.pre>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
