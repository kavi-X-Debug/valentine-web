import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, arrayRemove, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
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
  const [fieldErrors, setFieldErrors] = useState({});
  const fileInputRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [reviewOrderId, setReviewOrderId] = useState(null);
  const [reviewProductId, setReviewProductId] = useState(null);
  const [reviewProductName, setReviewProductName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

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

  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }
    const userId = currentUser.uid;
    if (!userId) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }
    setOrdersLoading(true);
    const q = query(
      collection(db, 'orders'),
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
        setOrders(list);
        setOrdersLoading(false);
      },
      (error) => {
        console.error('Orders subscription error:', error);
        setOrders([]);
        setOrdersLoading(false);
      }
    );
    return () => unsub();
  }, [currentUser]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    const next = {};
    const name = form.name.trim();
    if (!name) {
      next.name = 'Full name is required';
    } else if (name.length < 2) {
      next.name = 'Full name must be at least 2 characters';
    }
    const address = form.address.trim();
    if (address && address.length < 5) {
      next.address = 'Address should be at least 5 characters';
    }
    const billingName = form.billingName.trim();
    if (billingName && billingName.length < 2) {
      next.billingName = 'Billing name should be at least 2 characters';
    }
    const billingAddress = form.billingAddress.trim();
    if (billingAddress && billingAddress.length < 5) {
      next.billingAddress = 'Billing address should be at least 5 characters';
    }
    function validatePostal(value, key) {
      const v = value.trim();
      if (!v) return;
      if (v.length < 3 || v.length > 10) {
        next[key] = 'Postal code should be 3 to 10 characters';
      }
      if (!/^[0-9A-Za-z\- ]+$/.test(v)) {
        next[key] = 'Postal code can use letters and numbers only';
      }
    }
    validatePostal(form.postalCode, 'postalCode');
    validatePostal(form.billingPostalCode, 'billingPostalCode');
    function validateCountry(value, key) {
      const v = value.trim();
      if (!v) return;
      if (v.length < 2) {
        next[key] = 'Country name should be at least 2 characters';
      }
    }
    validateCountry(form.country, 'country');
    validateCountry(form.billingCountry, 'billingCountry');
    setFieldErrors(next);
    return Object.keys(next).length === 0;
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
    const ok = validateForm();
    if (!ok) {
      return;
    }
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

  async function removeFavorite(id) {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        favorites: arrayRemove(id)
      });
      setFavorites(prev => prev.filter(x => x !== id));
    } catch (e) {
      console.error('Failed to remove favorite', e);
    }
  }

  async function submitReview(order, item) {
    if (!currentUser || !order || !item) return;
    const trimmed = reviewText.trim();
    if (!trimmed) return;
    setReviewSubmitting(true);
    try {
      const reviewsRef = collection(db, 'reviews');
      const displayName = form.name || currentUser.displayName || '';
      const nameFallback = displayName || currentUser.email || 'Anonymous';
      await setDoc(
        doc(reviewsRef),
        {
          productId: item.id,
          productName: item.name || '',
          userId: currentUser.uid,
          userName: nameFallback,
          message: trimmed,
          createdAt: new Date(),
          orderId: order.id || null
        }
      );
      setReviewText('');
      setReviewOrderId(null);
      setReviewProductId(null);
      setReviewProductName('');
      setReviewSuccess(true);
      setTimeout(() => {
        setReviewSuccess(false);
      }, 3000);
    } catch (e) {
      console.error('Failed to submit review', e);
    } finally {
      setReviewSubmitting(false);
    }
  }

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-10 -top-10 h-40 bg-gradient-to-r from-love-light/60 via-white to-love-light/60 blur-3xl opacity-60"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        />
        <motion.div
          layout
          className="bg-white p-8 rounded-2xl shadow-lg border border-love-pink/20 relative overflow-hidden"
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <motion.h2
                  className="text-2xl font-cursive text-love-dark"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  Personal Details
                </motion.h2>
                <motion.button
                  type="button"
                  onClick={() => setEditing(prev => !prev)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-love-red text-love-red hover:bg-love-red hover:text-white transition-colors"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ translateY: -1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {editing ? 'Cancel' : 'Update Personal Details'}
                </motion.button>
              </div>
              {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
              {saved && (
                <motion.div
                  className="bg-green-100 text-green-700 p-3 rounded inline-flex items-center gap-2"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                >
                  <span>Saved</span>
                </motion.div>
              )}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="w-20 h-20 rounded-full overflow-hidden bg-love-light border border-love-pink/30 ring-2 ring-love-light/60"
                    whileHover={{ scale: 1.03, rotate: 1.5 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </motion.div>
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
                    <motion.button
                      type="button"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-love-light text-love-dark hover:bg-love-pink/40 transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      Change Photo
                    </motion.button>
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
                {fieldErrors.name && (
                  <div className="mt-1 text-xs text-red-600">{fieldErrors.name}</div>
                )}
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
                {fieldErrors.address && (
                  <div className="mt-1 text-xs text-red-600">{fieldErrors.address}</div>
                )}
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
                  {fieldErrors.postalCode && (
                    <div className="mt-1 text-xs text-red-600">{fieldErrors.postalCode}</div>
                  )}
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
                  {fieldErrors.country && (
                    <div className="mt-1 text-xs text-red-600">{fieldErrors.country}</div>
                  )}
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
                    {fieldErrors.billingName && (
                      <div className="mt-1 text-xs text-red-600">{fieldErrors.billingName}</div>
                    )}
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
                    {fieldErrors.billingAddress && (
                      <div className="mt-1 text-xs text-red-600">{fieldErrors.billingAddress}</div>
                    )}
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
                      {fieldErrors.billingPostalCode && (
                        <div className="mt-1 text-xs text-red-600">{fieldErrors.billingPostalCode}</div>
                      )}
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
                      {fieldErrors.billingCountry && (
                        <div className="mt-1 text-xs text-red-600">{fieldErrors.billingCountry}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {editing && (
                <motion.button
                  type="submit"
                  className="w-full bg-love-red text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ translateY: -1 }}
                >
                  Save
                </motion.button>
              )}
            </form>
          )}
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          layout
          className="bg-white p-8 rounded-2xl shadow-lg border border-love-pink/20 mt-8"
        >
          <h2 className="text-2xl font-semibold text-love-dark mb-4">Your Favorites</h2>
          {favorites.length === 0 ? (
            <div className="text-gray-600">No favorites yet. Tap the heart on items to save them here.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_PRODUCTS.filter(p => favorites.includes(p.id)).map((p, index) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * index }}
                  whileHover={{ y: -4, boxShadow: '0 18px 35px rgba(15,23,42,0.16)' }}
                  className="border border-love-pink/20 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col"
                >
                  <motion.img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-40 object-cover"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  />
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="text-xs text-love-red font-medium mb-1 uppercase tracking-wider">{p.category}</div>
                    <div className="font-semibold text-gray-800">{p.name}</div>
                    <div className="text-love-dark font-bold mt-2 mb-4">${p.price.toFixed(2)}</div>
                    <motion.button
                      type="button"
                      onClick={() => removeFavorite(p.id)}
                      className="mt-auto inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium border border-gray-300 text-gray-700 hover:border-love-red hover:text-love-red transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      Remove from favorites
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          layout
          className="bg-white p-8 rounded-2xl shadow-lg border border-love-pink/20 mt-8"
        >
          <h2 className="text-2xl font-semibold text-love-dark mb-4">Your Orders</h2>
          {ordersLoading ? (
            <div className="text-gray-600 text-sm">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-600 text-sm">You have not placed any orders yet.</div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">In progress</h3>
                <div className="space-y-3">
                  {orders.filter(o => (o.status || 'pending') !== 'delivered').length === 0 && (
                    <div className="text-xs text-gray-500">No active orders.</div>
                  )}
                  {orders
                    .filter(o => (o.status || 'pending') !== 'delivered')
                    .map(order => {
                      const status = (order.status || 'pending').toLowerCase();
                      const createdAt = order.createdAt && order.createdAt.toDate
                        ? order.createdAt.toDate().toLocaleString()
                        : '—';
                      const total = Number(order.total || 0).toFixed(2);
                      const items = Array.isArray(order.items) ? order.items : [];
                      const firstItem = items[0];
                      const restCount = items.length > 1 ? items.length - 1 : 0;
                      return (
                        <div
                          key={order.id}
                          className="border border-gray-100 rounded-2xl p-4 bg-gray-50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="text-xs text-gray-500">
                                Placed on {createdAt}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-love-dark">
                                ${total}
                              </div>
                              <div
                                className={
                                  'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ' +
                                  (status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : status === 'processing'
                                    ? 'bg-blue-100 text-blue-800'
                                    : status === 'shipped'
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : status === 'cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-green-100 text-green-800')
                                }
                              >
                                {status[0].toUpperCase() + status.slice(1)}
                              </div>
                            </div>
                          </div>
                          {firstItem && (
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-white">
                                {firstItem.image ? (
                                  <img
                                    src={firstItem.image}
                                    alt={firstItem.name || 'Item'}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                                    No image
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-800 truncate">
                                  {firstItem.name || 'Item'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Qty {firstItem.quantity || 1} • ${Number(firstItem.price || 0).toFixed(2)}
                                </div>
                                {restCount > 0 && (
                                  <div className="text-[11px] text-gray-500">
                                    + {restCount} more item{restCount > 1 ? 's' : ''}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Completed orders</h3>
                <div className="space-y-4">
                  {orders.filter(o => (o.status || 'pending') === 'delivered').length === 0 && (
                    <div className="text-xs text-gray-500">No completed orders yet.</div>
                  )}
                  {orders
                    .filter(o => (o.status || 'pending') === 'delivered')
                    .map(order => {
                      const createdAt = order.createdAt && order.createdAt.toDate
                        ? order.createdAt.toDate().toLocaleString()
                        : '—';
                      const total = Number(order.total || 0).toFixed(2);
                      const items = Array.isArray(order.items) ? order.items : [];
                      return (
                        <div
                          key={order.id}
                          className="border border-gray-100 rounded-2xl p-4 bg-gray-50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="text-xs text-gray-500">
                                Placed on {createdAt}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-love-dark">
                                ${total}
                              </div>
                              <div className="text-[11px] text-green-700 bg-green-100 inline-flex px-2 py-0.5 rounded-full mt-1">
                                Delivered
                              </div>
                            </div>
                          </div>
                          {items.length > 0 && (
                            <div className="space-y-3">
                              {items.map((item, index) => (
                                <div
                                  key={`${order.id}-${index}`}
                                  className="flex items-center gap-3"
                                >
                                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-white">
                                    {item.image ? (
                                      <img
                                        src={item.image}
                                        alt={item.name || 'Item'}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                                        No image
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-800 truncate">
                                      {item.name || 'Item'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Qty {item.quantity || 1} • ${Number(item.price || 0).toFixed(2)}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setReviewOrderId(order.id);
                                        setReviewProductId(item.id);
                                        setReviewProductName(item.name || '');
                                        setReviewText('');
                                      }}
                                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:border-love-red hover:text-love-red transition-colors"
                                    >
                                      {reviewOrderId === order.id && reviewProductId === item.id
                                        ? 'Writing...'
                                        : 'Write review'}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {reviewOrderId === order.id && reviewProductId && (
                            <div className="mt-4 border-t border-gray-200 pt-3">
                              <div className="text-xs font-semibold text-gray-700 mb-1">
                                Review for {reviewProductName || 'item'}
                              </div>
                              <textarea
                                rows={3}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                                placeholder="Write a short message about this item..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                              />
                              <div className="mt-2 flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReviewOrderId(null);
                                    setReviewProductId(null);
                                    setReviewProductName('');
                                    setReviewText('');
                                  }}
                                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-600 hover:bg-gray-50"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  disabled={reviewSubmitting || !reviewText.trim()}
                                  onClick={() => {
                                    const targetItem = (Array.isArray(order.items) ? order.items : []).find(
                                      it => it && it.id === reviewProductId
                                    );
                                    submitReview(order, targetItem);
                                  }}
                                  className="px-4 py-1.5 rounded-lg bg-love-red text-white text-xs font-medium hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                  {reviewSubmitting ? 'Saving...' : 'Submit review'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
      {reviewSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full bg-love-dark text-white text-sm shadow-lg"
        >
          Your Review is Successfully Submitted
        </motion.div>
      )}
    </div>
  );
}
