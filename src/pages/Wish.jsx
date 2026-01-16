import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

export default function Wish() {
  const [faceYou, setFaceYou] = useState(null);
  const [facePartner, setFacePartner] = useState(null);
  const [template, setTemplate] = useState('dance');
  const [created, setCreated] = useState(false);
  const [creating, setCreating] = useState(false);
  const [downloading, setDownloading] = useState(false);
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
    setCreating(true);
    setCreated(false);
    setTimeout(() => {
      setCreating(false);
      setCreated(true);
    }, 800);
  }

  async function handleDownload() {
    if (!faceYou || !facePartner) {
      alert('Please upload both faces first');
      return;
    }
    if (!created) {
      alert('Please create the video first');
      return;
    }
    if (typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (typeof MediaRecorder === 'undefined' || typeof canvas.captureStream !== 'function') {
      alert('Video download is not supported in this browser');
      return;
    }
    setDownloading(true);
    const stream = canvas.captureStream(30);
    const chunks = [];
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    recorder.ondataavailable = e => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };
    const downloadPromise = new Promise(resolve => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'love-video.webm';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        resolve();
      };
    });
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
      alert('Failed to load images for video');
      setDownloading(false);
      stream.getTracks().forEach(track => track.stop());
      return;
    }
    const width = canvas.width;
    const height = canvas.height;
    const fps = 30;
    const duration = 4;
    const totalFrames = fps * duration;
    let frame = 0;
    function drawFrame() {
      const t = frame / fps;
      const grad = ctx.createLinearGradient(0, 0, width, height);
      if (template === 'dance') {
        grad.addColorStop(0, '#fee2e2');
        grad.addColorStop(1, '#f97373');
      } else if (template === 'hearts') {
        grad.addColorStop(0, '#ffe4e6');
        grad.addColorStop(1, '#fb7185');
      } else {
        grad.addColorStop(0, '#e0e7ff');
        grad.addColorStop(1, '#f9a8d4');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      const centerY = height / 2;
      const baseY = centerY;
      const baseYouX = width * 0.3;
      const basePartnerX = width * 0.7;
      const baseRadius = Math.min(width, height) * 0.16;
      let youX = baseYouX;
      let partnerX = basePartnerX;
      let youY = baseY;
      let partnerY = baseY;
      let youScale = 1;
      let partnerScale = 1;
      let youRot = 0;
      let partnerRot = 0;
      if (template === 'dance') {
        const a = Math.sin(t * Math.PI * 2);
        youY = baseY + a * -20;
        partnerY = baseY + a * 20;
        youRot = a * -0.25;
        partnerRot = a * 0.25;
      } else if (template === 'hearts') {
        const a = Math.sin(t * Math.PI * 2);
        youY = baseY + a * -25;
        partnerY = baseY + a * 25;
        youX = baseYouX + a * -width * 0.03;
        partnerX = basePartnerX + a * width * 0.03;
      } else if (template === 'zoom') {
        const a = Math.sin(t * Math.PI * 2);
        const s = 1 + 0.08 * a;
        youScale = s;
        partnerScale = s;
        youY = baseY + a * -10;
        partnerY = baseY + Math.sin(t * Math.PI * 2 + Math.PI) * 10;
      }
      function drawFace(img, cx, cy, scale, rot) {
        const r = baseRadius * scale;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, -r, -r, r * 2, r * 2);
        ctx.restore();
        ctx.save();
        ctx.translate(cx, cy);
        ctx.beginPath();
        ctx.arc(0, 0, r + 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.restore();
      }
      drawFace(imgYou, youX, youY, youScale, youRot);
      drawFace(imgPartner, partnerX, partnerY, partnerScale, partnerRot);
      ctx.font = 'bold 32px system-ui';
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.textAlign = 'center';
      if (template === 'dance') {
        ctx.fillText('Dance of Love', width / 2, height - 40);
      } else if (template === 'hearts') {
        ctx.fillText('Love Vibes', width / 2, height - 40);
      } else {
        ctx.fillText('Zoom in Love', width / 2, height - 40);
      }
      frame += 1;
      if (frame < totalFrames) {
        requestAnimationFrame(drawFrame);
      } else {
        recorder.stop();
        stream.getTracks().forEach(track => track.stop());
      }
    }
    recorder.start();
    drawFrame();
    await downloadPromise;
    setDownloading(false);
  }

  const bgClass =
    template === 'dance'
      ? 'from-pink-100 to-red-200'
      : template === 'hearts'
      ? 'from-rose-100 to-pink-200'
      : 'from-indigo-100 to-pink-100';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-4xl font-cursive text-love-dark mb-6">Create a Funny Love Video</h1>
        <p className="text-gray-600 mb-8">Upload two faces and generate a short, looping fun scene.</p>
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
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Funny video type</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTemplate('dance')}
                    className={`px-3 py-2 rounded-full text-xs font-medium border transition-colors ${
                      template === 'dance'
                        ? 'bg-love-red text-white border-love-red'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-love-red/60'
                    }`}
                  >
                    Dance
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemplate('hearts')}
                    className={`px-3 py-2 rounded-full text-xs font-medium border transition-colors ${
                      template === 'hearts'
                        ? 'bg-love-red text-white border-love-red'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-love-red/60'
                    }`}
                  >
                    Hearts
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemplate('zoom')}
                    className={`px-3 py-2 rounded-full text-xs font-medium border transition-colors ${
                      template === 'zoom'
                        ? 'bg-love-red text-white border-love-red'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-love-red/60'
                    }`}
                  >
                    Zoom
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCreate}
                className="w-full bg-love-red text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create video'}
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
                      Upload two faces and click <span className="font-semibold">Create video</span> to see them in a fun scene.
                    </p>
                  </div>
                )}
                {created && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      {faceYou && (
                        <motion.img
                          src={faceYou}
                          alt="You video"
                          className="absolute w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-lg"
                          initial={{ x: -80, y: 0, rotate: 0 }}
                          animate={
                            template === 'dance'
                              ? { y: [-10, 10, -10], rotate: [-8, 8, -8] }
                              : template === 'hearts'
                              ? { y: [0, -20, 0], x: [-20, 0, 20] }
                              : { scale: [1, 1.1, 1], y: [-6, 6, -6] }
                          }
                          transition={{ duration: 1.6, repeat: Infinity, repeatType: 'reverse' }}
                          style={{ left: '18%', top: '50%', transform: 'translate(-50%, -50%)' }}
                        />
                      )}
                      {facePartner && (
                        <motion.img
                          src={facePartner}
                          alt="Partner video"
                          className="absolute w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-lg"
                          initial={{ x: 80, y: 0, rotate: 0 }}
                          animate={
                            template === 'dance'
                              ? { y: [10, -10, 10], rotate: [8, -8, 8] }
                              : template === 'hearts'
                              ? { y: [-10, 10, -10], x: [20, 0, -20] }
                              : { scale: [1.1, 1, 1.1], y: [6, -6, 6] }
                          }
                          transition={{ duration: 1.6, repeat: Infinity, repeatType: 'reverse' }}
                          style={{ right: '18%', top: '50%', transform: 'translate(50%, -50%)' }}
                        />
                      )}
                      {template === 'dance' && (
                        <motion.div
                          className="absolute inset-x-0 bottom-8 flex items-center justify-center text-3xl"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.4, repeat: Infinity, repeatType: 'reverse' }}
                        >
                          <span className="mx-1">🎵</span>
                          <span className="mx-1">💃</span>
                          <span className="mx-1">🎶</span>
                        </motion.div>
                      )}
                      {template === 'hearts' && (
                        <>
                          <motion.div
                            className="absolute left-6 bottom-6 text-4xl"
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse' }}
                          >
                            ❤️
                          </motion.div>
                          <motion.div
                            className="absolute right-6 top-6 text-4xl"
                            animate={{ y: [-8, 8, -8] }}
                            transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse' }}
                          >
                            💘
                          </motion.div>
                        </>
                      )}
                      {template === 'zoom' && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center text-4xl text-white/90"
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                        >
                          💞
                        </motion.div>
                      )}
                    </div>
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
                    <span>{downloading ? 'Preparing video...' : 'Download video'}</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
      <canvas ref={canvasRef} width={640} height={360} className="hidden" />
    </div>
  );
}
