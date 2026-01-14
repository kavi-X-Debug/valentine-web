import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { motion } from 'framer-motion';
import { MOCK_PRODUCTS } from '../data/products';


export default function Profile() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    country: '',
    gender: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    async function load() {
      if (!currentUser) return;
      setSaved(false);
      setError('');
      setLoading(true);
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(userRef);
        const data = snap.exists() ? snap.data() : {};
        setForm({
          name: data.name || currentUser.displayName || '',
          address: data.address || '',
          country: data.country || '',
          gender: data.gender || ''
        });
        setAvatarUrl(data.photoURL || currentUser.photoURL || '');
        setFavorites(Array.isArray(data.favorites) ? data.favorites : []);
      } catch (e) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaved(false);
    try {
      let newPhotoURL = avatarUrl;
      if (avatarFile) {
        if (!avatarFile.type.startsWith('image/')) {
          setError('Please upload a valid image file');
          return;
        }
        if (avatarFile.size > 256 * 1024) {
          setError('Image too large (max 256KB)');
          return;
        }
        newPhotoURL = await fileToDataURL(avatarFile);
      }
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        name: form.name,
        address: form.address,
        country: form.country,
        gender: form.gender,
        photoURL: newPhotoURL || null
      }, { merge: true });
      const profileUpdate = {};
      if (form.name && form.name !== currentUser.displayName) {
        profileUpdate.displayName = form.name;
      }
      if (Object.keys(profileUpdate).length) {
        try {
          await updateProfile(currentUser, profileUpdate);
        } catch {}
      }
      setAvatarUrl(newPhotoURL);
      setSaved(true);
    } catch (e) {
      setError('Failed to save profile');
    }
  }

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-4xl font-cursive text-love-dark mb-8">Your Profile</h1>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-love-pink/20">
          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
              {saved && <div className="bg-green-100 text-green-700 p-3 rounded">Saved</div>}
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-love-light border border-love-pink/30">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="text-sm"
                />
              </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                    value={form.country}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-love-red text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg"
              >
                Save
              </button>
            </form>
          )}
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-love-pink/20 mt-8">
          <h2 className="text-2xl font-semibold text-love-dark mb-4">Your Favorites</h2>
          {favorites.length === 0 ? (
            <div className="text-gray-600">No favorites yet. Tap the heart on items to save them here.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_PRODUCTS.filter(p => favorites.includes(p.id)).map(p => (
                <div key={p.id} className="border border-love-pink/20 rounded-xl overflow-hidden bg-white shadow-sm">
                  <img src={p.image} alt={p.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <div className="text-xs text-love-red font-medium mb-1 uppercase tracking-wider">{p.category}</div>
                    <div className="font-semibold text-gray-800">{p.name}</div>
                    <div className="text-love-dark font-bold mt-2">${p.price.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
