import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Wish() {
  const [faceYou, setFaceYou] = useState(null);
  const [facePartner, setFacePartner] = useState(null);
  const [template, setTemplate] = useState('dance');
  const [created, setCreated] = useState(false);
  const [creating, setCreating] = useState(false);
  const youInputRef = useRef(null);
  const partnerInputRef = useRef(null);

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
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
