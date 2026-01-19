import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

export default function Wish() {
  const [faceYou, setFaceYou] = useState(null);
  const [facePartner, setFacePartner] = useState(null);
  const [created, setCreated] = useState(false);
  const [creating, setCreating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const youInputRef = useRef(null);
  const partnerInputRef = useRef(null);
  const canvasRef = useRef(null);

  function handleFileChange(e, setFace) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const val = ev.target && ev.target.result;
      setFace(typeof val === 'string' ? val : null);
    };
    reader.readAsDataURL(file);
  }

  async function handleCreate() {
    if (!faceYou || !facePartner) {
      alert('Please upload both faces first');
      return;
    }
    if (typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setCreating(true);
    setCreated(false);
    setPreviewUrl('');
    const imgYou = new Image();
    const imgPartner = new Image();
    imgYou.src = faceYou;
    imgPartner.src = facePartner;
    function waitForImage(img) {
      return new Promise((resolve, reject) => {
        if (img.complete && img.naturalWidth) {
          resolve();
          return;
        }
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      });
    }
    try {
      await Promise.all([waitForImage(imgYou), waitForImage(imgPartner)]);
    } catch {
      alert('Failed to load images for wish');
      setCreating(false);
      return;
    }
    const width = canvas.width;
    const height = canvas.height;
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#ffe4e6');
    grad.addColorStop(1, '#fb7185');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = 'bold 72px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♥', width * 0.2, height * 0.25);
    ctx.fillText('♥', width * 0.8, height * 0.3);
    ctx.fillText('♥', width * 0.5, height * 0.65);
    function drawCircleImage(img, cx, cy, r) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.95)';
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.restore();
    }
    const radius = Math.min(width, height) * 0.18;
    const centerY = height * 0.45;
    const youX = width * 0.3;
    const partnerX = width * 0.7;
    drawCircleImage(imgYou, youX, centerY, radius);
    drawCircleImage(imgPartner, partnerX, centerY, radius);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 42px system-ui';
    ctx.fillText("Happy Valentine's Day", width / 2, height * 0.15);
    ctx.font = '500 26px system-ui';
    ctx.fillText('Together this Valentine', width / 2, height * 0.8);
    ctx.font = '400 18px system-ui';
    ctx.fillText(`LoveCraft • ${new Date().getFullYear()}`, width / 2, height * 0.9);
    const url = canvas.toDataURL('image/png');
    setPreviewUrl(url);
    setCreated(true);
    setCreating(false);
  }

  async function handleDownload() {
    if (!faceYou || !facePartner) {
      alert('Please upload both faces first');
      return;
    }
    if (!created || !previewUrl) {
      await handleCreate();
    }
    if (!previewUrl) return;
    setDownloading(true);
    try {
      const link = document.createElement('a');
      link.href = previewUrl;
      link.download = 'valentine-wish.png';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setDownloading(false);
    }
  }

  const bgClass = 'from-rose-100 to-pink-200';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-4xl font-cursive text-love-dark mb-6">Create a Valentine Wish Image</h1>
        <p className="text-gray-600 mb-8">Upload two faces and generate a romantic image for this Valentine.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-love-pink/20">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Add your faces (optional)</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => youInputRef.current && youInputRef.current.click()}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:border-love-red hover:text-love-red transition-colors"
                    >
                      Upload you
                    </button>
                    <input
                      ref={youInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setFaceYou)}
                    />
                    {faceYou && (
                      <div className="flex justify-center">
                        <img
                          src={faceYou}
                          alt="You"
                          className="w-16 h-16 rounded-full object-cover border border-love-pink/50"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => partnerInputRef.current && partnerInputRef.current.click()}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:border-love-red hover:text-love-red transition-colors"
                    >
                      Upload partner
                    </button>
                    <input
                      ref={partnerInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setFacePartner)}
                    />
                    {facePartner && (
                      <div className="flex justify-center">
                        <img
                          src={facePartner}
                          alt="Partner"
                          className="w-16 h-16 rounded-full object-cover border border-love-pink/50"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCreate}
                className="w-full bg-love-red text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create image'}
              </button>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-love-pink/20 flex items-center justify-center"
          >
            <div className="w-full max-w-md">
              <h2 className="text-3xl font-cursive text-love-dark mb-4 text-center">Preview</h2>
              <div className={`relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br ${bgClass}`}>
                {!created && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-700 px-6">
                    <div className="text-5xl mb-3">❤</div>
                    <p className="text-sm">
                      Upload two faces and click <span className="font-semibold">Create image</span> to see your Valentine wish.
                    </p>
                  </div>
                )}
                {created && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Valentine wish"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}
              </div>
              {created && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={downloading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-love-red text-white font-medium shadow-md hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Download className="h-5 w-5" />
                    <span>{downloading ? 'Preparing image...' : 'Download image'}</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
      <canvas ref={canvasRef} width={800} height={800} className="hidden" />
    </div>
  );
}
