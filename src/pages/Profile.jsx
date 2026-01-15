import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
    postalCode: '',
    country: '',
    gender: '',
    billingName: '',
    billingAddress: '',
    billingPostalCode: '',
    billingCountry: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef(null);

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
          postalCode: data.postalCode || '',
          country: data.country || '',
          gender: data.gender || '',
          billingName: data.billingName || data.name || currentUser.displayName || '',
          billingAddress: data.billingAddress || data.address || '',
          billingPostalCode: data.billingPostalCode || data.postalCode || '',
          billingCountry: data.billingCountry || data.country || ''
        });
        setAvatarUrl(data.photoURL || currentUser.photoURL || '');
        setFavorites(Array.isArray(data.favorites) ? data.favorites : []);
      } catch (e) {
        setError('Failed to load profile');
      } finally {
        setEditing(false);
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
        postalCode: form.postalCode,
        country: form.country,
        gender: form.gender,
        billingName: form.billingName,
        billingAddress: form.billingAddress,
        billingPostalCode: form.billingPostalCode,
        billingCountry: form.billingCountry,
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
      setEditing(false);
    } catch (e) {
      setError('Failed to save profile');
    }
  }

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-love-pink/20">
          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-cursive text-love-dark">Personal Details</h2>
                <button
                  type="button"
                  onClick={() => setEditing(prev => !prev)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-love-red text-love-red hover:bg-love-red hover:text-white transition-colors"
                >
                  {editing ? 'Cancel' : 'Update Personal Details'}
                </button>
              </div>
              {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
              {saved && <div className="bg-green-100 text-green-700 p-3 rounded">Saved</div>}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-love-light border border-love-pink/30">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-love-dark">
                      {form.name || currentUser.displayName || 'No name set'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {currentUser.email}
                    </div>
                  </div>
                </div>
                {editing && (
                  <div className="flex flex-col items-end">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-love-light text-love-dark hover:bg-love-pink/40 transition-colors"
                    >
                      Change Photo
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={form.name}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={form.address}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={form.postalCode}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={form.country}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={form.gender}
                    onChange={handleChange}
                    disabled={!editing}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-cursive text-love-dark">Billing Details</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Billing Name</label>
                    <input
                      type="text"
                      name="billingName"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={form.billingName}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Billing Address</label>
                    <input
                      type="text"
                      name="billingAddress"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={form.billingAddress}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Billing Postal Code</label>
                      <input
                        type="text"
                        name="billingPostalCode"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                        value={form.billingPostalCode}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Billing Country</label>
                      <input
                        type="text"
                        name="billingCountry"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                        value={form.billingCountry}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {editing && (
                <button
                  type="submit"
                  className="w-full bg-love-red text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg"
                >
                  Save
                </button>
              )}
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
