import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, orderBy, query, updateDoc, doc, setDoc, increment, addDoc, serverTimestamp, deleteDoc, arrayUnion } from 'firebase/firestore';
import { Search, Loader2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { MOCK_PRODUCTS } from '../data/products';
import emailjs from '@emailjs/browser';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [tab, setTab] = useState('overview');
  const [sort, setSort] = useState('created_desc');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    image: '',
    description: '',
    tags: '',
    subImages: ''
  });
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [productError, setProductError] = useState('');
  const [productSuccess, setProductSuccess] = useState('');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [productListSearch, setProductListSearch] = useState('');
  const [productListCategoryFilter, setProductListCategoryFilter] = useState('all');
  const [editingProductId, setEditingProductId] = useState(null);
  const [editProductForm, setEditProductForm] = useState({
    name: '',
    category: '',
    price: '',
    image: '',
    description: '',
    tags: '',
    subImages: ''
  });
  const [editProductSubmitting, setEditProductSubmitting] = useState(false);
  const [editProductError, setEditProductError] = useState('');
  const [editProductSuccess, setEditProductSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const [categorySuccess, setCategorySuccess] = useState('');
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replySubmittingId, setReplySubmittingId] = useState(null);
  const [inboxShowUnread, setInboxShowUnread] = useState(true);
  const [outOfStockSendingId, setOutOfStockSendingId] = useState(null);
  const [outOfStockNotice, setOutOfStockNotice] = useState(null);

  const unreadMessageCount = useMemo(() => {
    return messages.filter(m => m && m.status !== 'answered').length;
  }, [messages]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      snapshot => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setOrders(list);
        setLoading(false);
      },
      (error) => {
        console.error('Failed to load orders', error);
        setOrders([]);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const productCategories = useMemo(() => {
    const set = new Set();
    MOCK_PRODUCTS.forEach(p => set.add(p.category));
    products.forEach(p => {
      if (p.category) {
        set.add(p.category);
      }
    });
    categories.forEach(cat => {
      if (cat && cat.name) {
        set.add(cat.name);
      }
    });
    return Array.from(set).sort();
  }, [products, categories]);

  useEffect(() => {
    const ref = collection(db, 'products');
    const unsub = onSnapshot(
      ref,
      snapshot => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setProducts(list);
        setProductsLoading(false);
      },
      () => {
        setProducts([]);
        setProductsLoading(false);
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const ref = collection(db, 'categories');
    const q = query(ref, orderBy('name'));
    const unsub = onSnapshot(
      q,
      snapshot => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setCategories(list);
        setCategoriesLoading(false);
      },
      () => {
        setCategories([]);
        setCategoriesLoading(false);
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const ref = collection(db, 'productMessages');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      snapshot => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setMessages(list);
        setMessagesLoading(false);
      },
      () => {
        setMessages([]);
        setMessagesLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const combinedProducts = useMemo(() => {
    const staticList = MOCK_PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      image: p.image,
      description: p.description,
      tags: p.tags || [],
      source: 'mock'
    }));
    const firestoreList = products.map(p => ({
      ...p,
      source: 'firestore'
    }));
    let list = [...firestoreList, ...staticList];
    if (productListCategoryFilter !== 'all') {
      const cat = productListCategoryFilter.toLowerCase();
      list = list.filter(p => (p.category || '').toLowerCase() === cat);
    }
    const term = productListSearch.trim().toLowerCase();
    if (term) {
      list = list.filter(p => {
        const name = (p.name || '').toLowerCase();
        const category = (p.category || '').toLowerCase();
        const description = (p.description || '').toLowerCase();
        const tagsText = Array.isArray(p.tags)
          ? p.tags.join(' ').toLowerCase()
          : String(p.tags || '').toLowerCase();
        return (
          name.includes(term) ||
          category.includes(term) ||
          description.includes(term) ||
          tagsText.includes(term)
        );
      });
    }
    return list;
  }, [products, productListSearch, productListCategoryFilter]);

  const filteredOrders = useMemo(() => {
    let list = orders;
    if (statusFilter !== 'all') {
      list = list.filter(o => (o.status || 'pending') === statusFilter);
    }
    const term = search.trim().toLowerCase();
    if (term) {
      list = list.filter(o => {
        const id = o.id?.toLowerCase() || '';
        const email = o.userEmail?.toLowerCase() || '';
        const name = `${o.shippingDetails?.firstName || ''} ${o.shippingDetails?.lastName || ''}`.toLowerCase();
        const userId = o.userId?.toLowerCase() || '';
        const status = (o.status || 'pending').toLowerCase();
        const totalStr = String(Number(o.total || 0).toFixed(2));
        let itemsText = '';
        if (Array.isArray(o.items)) {
          itemsText = o.items
            .map(it => `${it.name || ''} ${it.customText || ''}`)
            .join(' ')
            .toLowerCase();
        }
        return (
          id.includes(term) ||
          email.includes(term) ||
          name.includes(term) ||
          userId.includes(term) ||
          status.includes(term) ||
          totalStr.includes(term) ||
          itemsText.includes(term)
        );
      });
    }
    return list;
  }, [orders, statusFilter, search]);

  const sortedOrders = useMemo(() => {
    const list = [...filteredOrders];
    if (sort === 'created_asc' || sort === 'created_desc') {
      list.sort((a, b) => {
        const ra = a.createdAt;
        const rb = b.createdAt;
        let da = 0;
        let db = 0;
        if (ra && typeof ra.toDate === 'function') {
          da = ra.toDate().getTime();
        } else if (ra && typeof ra.seconds === 'number') {
          da = ra.seconds * 1000;
        }
        if (rb && typeof rb.toDate === 'function') {
          db = rb.toDate().getTime();
        } else if (rb && typeof rb.seconds === 'number') {
          db = rb.seconds * 1000;
        }
        return sort === 'created_desc' ? db - da : da - db;
      });
    } else if (sort === 'total_asc' || sort === 'total_desc') {
      list.sort((a, b) => {
        const ta = Number(a.total || 0);
        const tb = Number(b.total || 0);
        return sort === 'total_desc' ? tb - ta : ta - tb;
      });
    }
    return list;
  }, [filteredOrders, sort]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const totalOrdersFiltered = sortedOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalOrdersFiltered / pageSize));
  const currentPage = Math.min(page, totalPages);
  const firstIndex = (currentPage - 1) * pageSize;
  const pageItems = sortedOrders.slice(firstIndex, firstIndex + pageSize);

  const analytics = useMemo(() => {
    if (!orders.length) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        recentOrders: 0,
        dailyData: [],
        statusData: []
      };
    }
    const statusCounts = {};
    const byDay = {};
    let totalRevenue = 0;
    const now = new Date();
    const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    let recentOrders = 0;
    orders.forEach(o => {
      const status = (o.status || 'pending').toLowerCase();
      const amount = Number(o.total || 0);
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      const raw = o.createdAt;
      let d;
      if (raw && typeof raw.toDate === 'function') {
        d = raw.toDate();
      } else if (raw && typeof raw.seconds === 'number') {
        d = new Date(raw.seconds * 1000);
      }
      if (d && !Number.isNaN(d.getTime())) {
        const key = d.toISOString().slice(0, 10);
        if (!byDay[key]) {
          byDay[key] = { date: key, orders: 0, revenue: 0 };
        }
        byDay[key].orders += 1;
        if (status !== 'cancelled') {
          byDay[key].revenue += amount;
        }
        if (d >= sevenDaysAgo) {
          recentOrders += 1;
        }
      }
      if (status !== 'cancelled') {
        totalRevenue += amount;
      }
    });
    const daily = Object.values(byDay).sort((a, b) => (a.date > b.date ? 1 : -1));
    const dailyData = daily.slice(-7);
    const statusData = STATUS_OPTIONS.map(s => ({
      status: s[0].toUpperCase() + s.slice(1),
      count: statusCounts[s] || 0
    })).filter(item => item.count > 0);
    return {
      totalRevenue,
      totalOrders: orders.length,
      recentOrders,
      dailyData,
      statusData
    };
  }, [orders]);

  async function handleReply(message) {
    if (!message || !message.id) return;
    const textRaw = replyDrafts[message.id] || '';
    const text = textRaw.trim();
    if (!text) return;
    setReplySubmittingId(message.id);
    try {
      const ref = doc(db, 'productMessages', message.id);
      await updateDoc(ref, {
        answer: text,
        status: 'answered',
        answeredAt: serverTimestamp(),
        userHasRead: false,
        thread: arrayUnion({
          from: 'admin',
          text,
          createdAt: Date.now()
        })
      });
      setReplyDrafts(prev => ({ ...prev, [message.id]: '' }));
    } catch (err) {
      console.error('Failed to send reply', err);
    } finally {
      setReplySubmittingId(null);
    }
  }

  async function handleCreateProduct(e) {
    e.preventDefault();
    const name = productForm.name.trim();
    const category = productForm.category.trim();
    const priceRaw = productForm.price.trim();
    const image = productForm.image.trim();
    const description = productForm.description.trim();
    const tagsRaw = productForm.tags.trim();
    const subImagesRaw = productForm.subImages.trim();
    if (!name || !category || !priceRaw) {
      setProductError('Name, category and price are required.');
      setProductSuccess('');
      return;
    }
    const price = Number(priceRaw);
    if (!Number.isFinite(price) || price <= 0) {
      setProductError('Enter a valid price greater than 0.');
      setProductSuccess('');
      return;
    }
    setProductSubmitting(true);
    setProductError('');
    setProductSuccess('');
    try {
      const tags = tagsRaw
        ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
        : [];
      const subImages = subImagesRaw
        ? subImagesRaw.split(',').map(t => t.trim()).filter(Boolean)
        : [];
      await addDoc(collection(db, 'products'), {
        name,
        category,
        price,
        image,
        description,
        tags,
        subImages,
        active: true,
        createdAt: serverTimestamp()
      });
      setProductForm({
        name: '',
        category: '',
        price: '',
        image: '',
        description: '',
        tags: '',
        subImages: ''
      });
      setProductSuccess('Product has been added.');
    } catch (err) {
      console.error('Failed to add product', err);
      if (err && typeof err === 'object') {
        const code = err.code || '';
        if (code === 'permission-denied') {
          setProductError('Not allowed to add products. Check Firestore rules for "products".');
        } else if (err.message) {
          setProductError(err.message);
        } else {
          setProductError('Failed to add product. Please try again.');
        }
      } else {
        setProductError('Failed to add product. Please try again.');
      }
    } finally {
      setProductSubmitting(false);
    }
  }

  async function handleCreateCategory(e) {
    e.preventDefault();
    const name = categoryName.trim();
    const image = categoryImage.trim();
    if (!name || !image) {
      setCategoryError('Name and image URL are required.');
      setCategorySuccess('');
      return;
    }
    setCategorySubmitting(true);
    setCategoryError('');
    setCategorySuccess('');
    try {
      await addDoc(collection(db, 'categories'), {
        name,
        image,
        createdAt: serverTimestamp()
      });
      setCategoryName('');
      setCategoryImage('');
      setCategorySuccess('Category has been added.');
    } catch (err) {
      console.error('Failed to add category', err);
      if (err && typeof err === 'object') {
        const code = err.code || '';
        if (code === 'permission-denied') {
          setCategoryError('Not allowed to add categories. Check Firestore rules for "categories".');
        } else if (err.message) {
          setCategoryError(err.message);
        } else {
          setCategoryError('Failed to add category. Please try again.');
        }
      } else {
        setCategoryError('Failed to add category. Please try again.');
      }
    } finally {
      setCategorySubmitting(false);
    }
  }

  async function handleDeleteProduct(product) {
    if (!product || !product.id) return;
    const confirmed = window.confirm(`Remove product "${product.name}" from the system?`);
    if (!confirmed) return;
    setDeletingProductId(product.id);
    try {
      const ref = doc(db, 'products', product.id);
      await deleteDoc(ref);
    } catch {
    } finally {
      setDeletingProductId(null);
    }
  }

  function startEditProduct(prod) {
    if (!prod || prod.source !== 'firestore') return;
    setEditingProductId(prod.id);
    setEditProductError('');
    setEditProductSuccess('');
    const tagsValue = Array.isArray(prod.tags) ? prod.tags.join(', ') : String(prod.tags || '');
    const subImagesValue = Array.isArray(prod.subImages) ? prod.subImages.join(', ') : String(prod.subImages || '');
    setEditProductForm({
      name: prod.name || '',
      category: prod.category || '',
      price: prod.price != null ? String(prod.price) : '',
      image: prod.image || '',
      description: prod.description || '',
      tags: tagsValue,
      subImages: subImagesValue
    });
  }

  function cancelEditProduct() {
    setEditingProductId(null);
    setEditProductForm({
      name: '',
      category: '',
      price: '',
      image: '',
      description: '',
      tags: '',
      subImages: ''
    });
    setEditProductError('');
    setEditProductSuccess('');
  }

  async function handleUpdateProduct(e) {
    e.preventDefault();
    if (!editingProductId) return;
    const name = editProductForm.name.trim();
    const category = editProductForm.category.trim();
    const priceRaw = editProductForm.price.trim();
    const image = editProductForm.image.trim();
    const description = editProductForm.description.trim();
    const tagsRaw = editProductForm.tags.trim();
    const subImagesRaw = editProductForm.subImages.trim();
    if (!name || !category || !priceRaw) {
      setEditProductError('Name, category and price are required.');
      setEditProductSuccess('');
      return;
    }
    const price = Number(priceRaw);
    if (!Number.isFinite(price) || price <= 0) {
      setEditProductError('Enter a valid price greater than 0.');
      setEditProductSuccess('');
      return;
    }
    setEditProductSubmitting(true);
    setEditProductError('');
    setEditProductSuccess('');
    try {
      const tags = tagsRaw
        ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
        : [];
      const subImages = subImagesRaw
        ? subImagesRaw.split(',').map(t => t.trim()).filter(Boolean)
        : [];
      const ref = doc(db, 'products', editingProductId);
      await updateDoc(ref, {
        name,
        category,
        price,
        image,
        description,
        tags,
        subImages
      });
      setEditProductSuccess('Product has been updated.');
      setEditingProductId(null);
      setEditProductForm({
        name: '',
        category: '',
        price: '',
        image: '',
        description: '',
        tags: '',
        subImages: ''
      });
    } catch (err) {
      console.error('Failed to update product', err);
      if (err && typeof err === 'object' && err.message) {
        setEditProductError(err.message);
      } else {
        setEditProductError('Failed to update product. Please try again.');
      }
    } finally {
      setEditProductSubmitting(false);
    }
  }

  async function handleStatusChange(order, nextStatus) {
    if (!order || !order.id || !nextStatus) return;
    const currentStatus = (order.status || 'pending').toLowerCase();
    const next = nextStatus.toLowerCase();
    if (currentStatus === next) return;
    setUpdatingId(order.id);
    try {
      const ref = doc(db, 'orders', order.id);
      await updateDoc(ref, { status: next });
      const amount = Number(order.total || 0);
      if (!Number.isNaN(amount) && amount !== 0) {
        let delta = 0;
        if (currentStatus !== 'cancelled' && next === 'cancelled') {
          delta = -amount;
        } else if (currentStatus === 'cancelled' && next !== 'cancelled') {
          delta = amount;
        }
        if (delta !== 0) {
          try {
            const statsRef = doc(db, 'stats', 'global');
            await setDoc(
              statsRef,
              { totalRevenue: increment(delta) },
              { merge: true }
            );
          } catch (err) {
            console.error('Failed to update revenue stats', err);
          }
        }
      }
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleNotifyOutOfStock(order) {
    if (!order || !order.id || !order.userEmail) return;
    setOutOfStockNotice(null);
    setOutOfStockSendingId(order.id);
    try {
      const items = Array.isArray(order.items) ? order.items : [];
      const itemsLines = items
        .map(it => {
          const qty = it.quantity || 1;
          return `- ${it.name || 'Item'} x${qty}`;
        })
        .join('\n');
      const name = `${order.shippingDetails?.firstName || ''} ${order.shippingDetails?.lastName || ''}`
        .trim() || 'Customer';
      const messageBody = `Dear ${name},

We are sorry, but one or more items in your order ${order.id} are currently out of stock.

Order items:
${itemsLines || 'No items recorded.'}

We will contact you shortly to discuss alternatives or a refund.

With love,
LoveCraft support team`;

      const emailParams = {
        order_id: order.id,
        to_name: name,
        to_email: order.userEmail,
        message: messageBody,
        reply_to: 'support@lovecraft.com'
      };

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = 'GNdiN4DMl_vTXQ7iE';
      if (!serviceId || !templateId) {
        setOutOfStockNotice({
          orderId: order.id,
          type: 'error',
          message: 'Email service is not configured. Please check EmailJS settings.'
        });
        return;
      }

      await emailjs.send(serviceId, templateId, emailParams, publicKey);
      setOutOfStockNotice({
        orderId: order.id,
        type: 'success',
        message: 'Customer has been notified about out-of-stock items.'
      });
    } catch (err) {
      console.error('Failed to send out-of-stock email', err);
      setOutOfStockNotice({
        orderId: order.id,
        type: 'error',
        message: 'Failed to send notification. Please try again.'
      });
    } finally {
      setOutOfStockSendingId(null);
    }
  }

  function formatDate(ts) {
    if (!ts) return '—';
    try {
      const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
      return d.toLocaleString();
    } catch {
      return '—';
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-cursive text-love-dark">Admin Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Overview and management of customer orders.
          </p>
        </div>
        <div className="inline-flex items-center rounded-full bg-white/60 border border-love-pink/30 p-1 text-xs sm:text-sm">
          <button
            type="button"
            className={`px-4 py-1.5 rounded-full transition-all ${
              tab === 'overview'
                ? 'bg-love-red text-white shadow-sm'
                : 'text-gray-600 hover:text-love-red'
            }`}
            onClick={() => setTab('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            className={`px-4 py-1.5 rounded-full transition-all ${
              tab === 'orders'
                ? 'bg-love-red text-white shadow-sm'
                : 'text-gray-600 hover:text-love-red'
            }`}
            onClick={() => setTab('orders')}
          >
            Orders
          </button>
          <button
            type="button"
            className={`px-4 py-1.5 rounded-full transition-all ${
              tab === 'products'
                ? 'bg-love-red text-white shadow-sm'
                : 'text-gray-600 hover:text-love-red'
            }`}
            onClick={() => setTab('products')}
          >
            Products
          </button>
          <button
            type="button"
            className={`px-4 py-1.5 rounded-full transition-all ${
              tab === 'inbox'
                ? 'bg-love-red text-white shadow-sm'
                : 'text-gray-600 hover:text-love-red'
            }`}
            onClick={() => setTab('inbox')}
          >
            Inbox
            {unreadMessageCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-white/90 text-love-red text-[10px] font-semibold px-2 py-0.5 border border-love-red/40">
                {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-love-pink/30 rounded-xl p-4 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Total revenue</div>
              <div className="text-2xl font-semibold text-love-dark">${analytics.totalRevenue.toFixed(2)}</div>
            </div>
            <div className="bg-white border border-love-pink/30 rounded-xl p-4 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Total orders</div>
              <div className="text-2xl font-semibold text-love-dark">{analytics.totalOrders}</div>
            </div>
            <div className="bg-white border border-love-pink/30 rounded-xl p-4 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Orders last 7 days</div>
              <div className="text-2xl font-semibold text-love-dark">{analytics.recentOrders}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-xl shadow-sm border border-love-pink/20">
              <div className="px-6 py-4 border-b border-gray-100 text-sm font-medium text-gray-800">
                Orders last 7 days
              </div>
              <div className="h-64 px-4 py-4">
                {analytics.dailyData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-sm text-gray-500">
                    Not enough data to show trend yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.dailyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#fee2e2" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#e11d48"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-love-pink/20">
              <div className="px-6 py-4 border-b border-gray-100 text-sm font-medium text-gray-800">
                Orders by status
              </div>
              <div className="h-64 px-4 py-4">
                {analytics.statusData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-sm text-gray-500">
                    No orders yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.statusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#fee2e2" />
                      <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#fb7185" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'orders' && (
        <>
          <div className="bg-white border border-love-pink/30 rounded-xl p-4 mb-4 shadow-sm flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email, name, order ID, product..."
                className="pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-love-red focus:border-transparent outline-none w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-gray-500 hidden sm:inline">Status</span>
                <select
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-love-red focus:border-transparent outline-none w-full sm:w-44"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All statuses</option>
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-52">
                <span className="text-xs text-gray-500 hidden sm:inline">Sort</span>
                <select
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-love-red focus:border-transparent outline-none w-full"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="created_desc">Newest first</option>
                  <option value="created_asc">Oldest first</option>
                  <option value="total_desc">Total high → low</option>
                  <option value="total_asc">Total low → high</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-love-pink/20 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between text-xs sm:text-sm text-gray-600">
              <div>
                Total orders: <span className="font-semibold">{orders.length}</span>
                {statusFilter !== 'all' && (
                  <span className="ml-2">
                    • Showing <span className="font-semibold">{totalOrdersFiltered}</span> {statusFilter}
                  </span>
                )}
              </div>
              {loading && (
                <div className="inline-flex items-center gap-1 text-gray-500">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Loading orders...</span>
                </div>
              )}
            </div>

            {totalOrdersFiltered === 0 && !loading && (
              <div className="px-6 py-10 text-center text-sm text-gray-500">
                No orders found for the current filters.
              </div>
            )}

            {totalOrdersFiltered > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-love-light/70">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {pageItems.map(order => {
                      const created = formatDate(order.createdAt);
                      const fullName = `${order.shippingDetails?.firstName || ''} ${order.shippingDetails?.lastName || ''}`.trim() || 'Guest';
                      const status = order.status || 'pending';
                      const address = order.shippingDetails || {};
                      const deliveryLine1 = address.address || '';
                      const deliveryLine2 = [address.city, address.country].filter(Boolean).join(', ');
                      return (
                        <tr key={order.id} className="align-top">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-xs font-mono text-gray-600 truncate max-w-[120px] sm:max-w-xs">{order.id}</div>
                            <div className="text-[11px] text-gray-400">User: {order.userId || 'guest'}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{fullName}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[140px] sm:max-w-xs">
                              {order.userEmail || 'No email'}
                            </div>
                            {address.phone && (
                              <div className="text-xs text-gray-500 truncate max-w-[140px] sm:max-w-xs">
                                {address.phone}
                              </div>
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-xs text-gray-700 truncate max-w-[160px] sm:max-w-xs">
                              {deliveryLine1 || 'No address'}
                            </div>
                            <div className="text-[11px] text-gray-400 truncate max-w-[160px] sm:max-w-xs">
                              {deliveryLine2}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-love-dark">
                              ${Number(order.total || 0).toFixed(2)}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              {Array.isArray(order.items) ? `${order.items.length} items` : '0 items'}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <span
                                className={
                                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ' +
                                  (status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : status === 'processing'
                                    ? 'bg-blue-100 text-blue-800'
                                    : status === 'shipped'
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : status === 'delivered'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800')
                                }
                              >
                                {status[0].toUpperCase() + status.slice(1)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                            {created}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                              <select
                                className="border border-gray-300 rounded-lg text-xs px-2 py-1 focus:ring-1 focus:ring-love-red focus:border-transparent outline-none"
                                value={status}
                                disabled={updatingId === order.id}
                                onChange={(e) => handleStatusChange(order, e.target.value)}
                              >
                                {STATUS_OPTIONS.map(opt => (
                                  <option key={opt} value={opt}>
                                    {opt[0].toUpperCase() + opt.slice(1)}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                                className="text-xs px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                {expandedId === order.id ? 'Hide details' : 'View details'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {filteredOrders.map(order => {
            if (expandedId !== order.id) return null;
            const address = order.shippingDetails || {};
            return (
              <div
                key={`details-${order.id}`}
                className="mt-6 bg-white rounded-xl shadow-sm border border-love-pink/20 p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-love-dark">Order details</h2>
                    <p className="text-xs text-gray-500 font-mono truncate max-w-md">ID: {order.id}</p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-2 text-xs text-gray-500">
                    <div>
                      Status: <span className="font-semibold">{(order.status || 'pending').toUpperCase()}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNotifyOutOfStock(order)}
                      disabled={outOfStockSendingId === order.id || !order.userEmail}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg border border-love-red text-love-red font-medium hover:bg-love-red hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {outOfStockSendingId === order.id ? 'Sending notification...' : 'Notify out of stock'}
                    </button>
                  </div>
                </div>
                {outOfStockNotice && outOfStockNotice.orderId === order.id && (
                  <div
                    className={
                      'mt-3 text-xs px-3 py-2 rounded-lg ' +
                      (outOfStockNotice.type === 'success'
                        ? 'text-green-700 bg-green-100'
                        : 'text-red-700 bg-red-100')
                    }
                  >
                    {outOfStockNotice.message}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-800">Customer</div>
                    <div>{address.firstName} {address.lastName}</div>
                    <div className="text-gray-600">{order.userEmail}</div>
                    <div className="text-gray-600">Phone: {address.phone || 'Not provided'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-800">Shipping address</div>
                    <div className="text-gray-700">
                      {address.address && <div>{address.address}</div>}
                      {address.city && <div>{address.city}</div>}
                      {(address.zipCode || address.country) && (
                        <div>{address.zipCode} {address.country}</div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-800">Summary</div>
                    <div className="text-gray-700">
                      Items: {Array.isArray(order.items) ? order.items.length : 0}
                    </div>
                    <div className="text-gray-700">
                      Total: <span className="font-semibold text-love-dark">${Number(order.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="font-semibold text-gray-800 mb-2 text-sm">Line items</div>
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    <div className="space-y-2 text-sm">
                      {order.items.map((it, idx) => (
                        <div key={`${order.id}-item-${idx}`} className="flex justify-between gap-4">
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{it.name}</div>
                            <div className="text-xs text-gray-500">
                              Qty: {it.quantity || 1} • ${Number(it.price || 0).toFixed(2)}
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-love-dark">
                            ${Number((it.price || 0) * (it.quantity || 1)).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">No items recorded on this order.</div>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
      {tab === 'products' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-love-pink/20 p-6">
              <h2 className="text-lg font-semibold text-love-dark mb-4">Add new product</h2>
              {productError && (
                <div className="mb-3 text-sm text-red-700 bg-red-100 px-3 py-2 rounded-lg">
                  {productError}
                </div>
              )}
              {productSuccess && (
                <div className="mb-3 text-sm text-green-700 bg-green-100 px-3 py-2 rounded-lg">
                  {productSuccess}
                </div>
              )}
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                    value={productForm.name}
                    onChange={(e) => setProductForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                      value={productForm.category}
                      onChange={(e) => setProductForm(f => ({ ...f, category: e.target.value }))}
                    >
                      <option value="">Select category</option>
                      {productCategories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                      value={productForm.price}
                      onChange={(e) => setProductForm(f => ({ ...f, price: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                    value={productForm.image}
                    onChange={(e) => setProductForm(f => ({ ...f, image: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional image URLs (comma separated)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                    value={productForm.subImages}
                    onChange={(e) => setProductForm(f => ({ ...f, subImages: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                    value={productForm.description}
                    onChange={(e) => setProductForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                    value={productForm.tags}
                    onChange={(e) => setProductForm(f => ({ ...f, tags: e.target.value }))}
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={productSubmitting}
                    className="px-4 py-2 rounded-lg bg-love-red text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {productSubmitting ? 'Saving...' : 'Add product'}
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-love-pink/20 p-6">
              <div className="flex items-center justify-between mb-4 gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-love-dark">Existing products</h2>
                  {editProductError && (
                    <div className="mt-1 text-xs text-red-700 bg-red-100 px-2 py-1 rounded">
                      {editProductError}
                    </div>
                  )}
                  {editProductSuccess && (
                    <div className="mt-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                      {editProductSuccess}
                    </div>
                  )}
                </div>
                {productsLoading && (
                  <span className="text-xs text-gray-500">Loading...</span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, category or tag"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                    value={productListSearch}
                    onChange={(e) => setProductListSearch(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-48">
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                    value={productListCategoryFilter}
                    onChange={(e) => setProductListCategoryFilter(e.target.value)}
                  >
                    <option value="all">All categories</option>
                    {productCategories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {combinedProducts.length === 0 && !productsLoading && (
                <div className="text-sm text-gray-500">
                  No products match the current filters.
                </div>
              )}
              {combinedProducts.length > 0 && (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-sm">
                  {combinedProducts.map(prod => {
                    const isFirestore = prod.source === 'firestore';
                    const isEditing = isFirestore && editingProductId === prod.id;
                    return (
                      <div
                        key={isFirestore ? prod.id : `mock-${prod.id}`}
                        className="border border-gray-100 rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-medium text-gray-800 truncate">
                              {prod.name || 'Untitled'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {prod.category || 'No category'} • ${Number(prod.price || 0).toFixed(2)}
                            </div>
                            <div className="mt-0.5 text-[11px] text-gray-400">
                              {prod.source === 'mock' ? 'Built-in product' : 'Custom product'}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isFirestore && (
                              <button
                                type="button"
                                onClick={() => startEditProduct(prod)}
                                className="text-xs px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                                disabled={editProductSubmitting && editingProductId === prod.id}
                              >
                                Edit
                              </button>
                            )}
                            {isFirestore && (
                              <button
                                type="button"
                                disabled={deletingProductId === prod.id}
                                onClick={() => handleDeleteProduct(prod)}
                                className="text-xs px-3 py-1 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                {deletingProductId === prod.id ? 'Removing...' : 'Remove'}
                              </button>
                            )}
                          </div>
                        </div>
                        {isEditing && (
                          <form
                            onSubmit={handleUpdateProduct}
                            className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs"
                          >
                            <div className="space-y-2">
                              <div>
                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Name</label>
                                <input
                                  type="text"
                                  className="w-full px-2 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                                  value={editProductForm.name}
                                  onChange={(e) => setEditProductForm(f => ({ ...f, name: e.target.value }))}
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Category</label>
                                <select
                                  className="w-full px-2 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                                  value={editProductForm.category}
                                  onChange={(e) => setEditProductForm(f => ({ ...f, category: e.target.value }))}
                                >
                                  <option value="">Select category</option>
                                  {productCategories.map(cat => (
                                    <option key={cat} value={cat}>
                                      {cat}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Price (USD)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="w-full px-2 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                                  value={editProductForm.price}
                                  onChange={(e) => setEditProductForm(f => ({ ...f, price: e.target.value }))}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                  type="url"
                                  className="w-full px-2 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                                  value={editProductForm.image}
                                  onChange={(e) => setEditProductForm(f => ({ ...f, image: e.target.value }))}
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Additional image URLs</label>
                                <input
                                  type="text"
                                  className="w-full px-2 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                                  value={editProductForm.subImages}
                                  onChange={(e) => setEditProductForm(f => ({ ...f, subImages: e.target.value }))}
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                  rows={2}
                                  className="w-full px-2 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                                  value={editProductForm.description}
                                  onChange={(e) => setEditProductForm(f => ({ ...f, description: e.target.value }))}
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Tags</label>
                                <input
                                  type="text"
                                  className="w-full px-2 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                                  value={editProductForm.tags}
                                  onChange={(e) => setEditProductForm(f => ({ ...f, tags: e.target.value }))}
                                />
                              </div>
                              <div className="flex justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={cancelEditProduct}
                                  className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                                  disabled={editProductSubmitting}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={editProductSubmitting}
                                  className="px-3 py-1 rounded-lg bg-love-red text-white text-xs font-medium hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                  {editProductSubmitting ? 'Saving...' : 'Save'}
                                </button>
                              </div>
                            </div>
                          </form>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-love-pink/20 p-6">
            <div className="flex items-center justify-between mb-4 gap-3">
              <div>
                <h2 className="text-lg font-semibold text-love-dark">Create new category</h2>
                <p className="text-xs text-gray-500">
                  Add a category name and image URL for your products.
                </p>
              </div>
              {categoriesLoading && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading...
                </span>
              )}
            </div>
            {categoryError && (
              <div className="mb-3 text-sm text-red-700 bg-red-100 px-3 py-2 rounded-lg">
                {categoryError}
              </div>
            )}
            {categorySuccess && (
              <div className="mb-3 text-sm text-green-700 bg-green-100 px-3 py-2 rounded-lg">
                {categorySuccess}
              </div>
            )}
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                  value={categoryImage}
                  onChange={(e) => setCategoryImage(e.target.value)}
                />
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={categorySubmitting}
                  className="px-4 py-2 rounded-lg bg-love-red text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {categorySubmitting ? 'Saving...' : 'Create category'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      {tab === 'inbox' && (
        <div className="bg-white rounded-xl shadow-sm border border-love-pink/20 p-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div>
              <h2 className="text-lg font-semibold text-love-dark">Customer questions</h2>
              <p className="text-xs text-gray-500">
                View questions asked on product pages and send replies.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-600">
                <span className={inboxShowUnread ? 'font-semibold text-love-dark' : ''}>Unread</span>
                <button
                  type="button"
                  onClick={() => setInboxShowUnread(prev => !prev)}
                  className={
                    'relative w-10 h-5 rounded-full transition-colors duration-200 ' +
                    (inboxShowUnread ? 'bg-love-red' : 'bg-gray-300')
                  }
                >
                  <span
                    className={
                      'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ' +
                      (inboxShowUnread ? 'translate-x-5' : 'translate-x-1')
                    }
                  />
                </button>
                <span className={!inboxShowUnread ? 'font-semibold text-love-dark' : ''}>Read</span>
              </div>
              {messagesLoading && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading...
                </span>
              )}
            </div>
          </div>
          {messages.length === 0 && !messagesLoading && (
            <div className="text-sm text-gray-500">
              There are no customer questions yet.
            </div>
          )}
          {messages.length > 0 && (
            <div className="space-y-4 max-h-[32rem] overflow-y-auto pr-1 text-sm">
              {messages
                .filter(message => {
                  const isAnswered = message.status === 'answered';
                  return inboxShowUnread ? !isAnswered : isAnswered;
                })
                .map(message => {
                const createdAt = message.createdAt && message.createdAt.toDate
                  ? message.createdAt.toDate().toLocaleString()
                  : '';
                const answeredAt = message.answeredAt && message.answeredAt.toDate
                  ? message.answeredAt.toDate().toLocaleString()
                  : '';
                const hasAnswer = message.answer && String(message.answer).trim();
                const isAnswered = message.status === 'answered';
                const draftValue = replyDrafts[message.id] || '';
                return (
                  <div
                    key={message.id}
                    className="border border-gray-100 rounded-lg px-3 py-3 bg-white"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-gray-700 mb-1">
                          {message.productName || 'Product question'}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Product ID: {message.productId || 'unknown'}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          From: {message.userEmail || 'No email provided'}
                        </div>
                        {createdAt && (
                          <div className="text-[11px] text-gray-400">
                            Asked at {createdAt}
                          </div>
                        )}
                      </div>
                      <div className="text-xs">
                        <span
                          className={
                            'inline-flex items-center px-2 py-0.5 rounded-full font-medium ' +
                            (isAnswered
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800')
                          }
                        >
                          {isAnswered ? 'Answered' : 'Waiting reply'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-gray-800">
                      <div className="text-xs font-semibold text-gray-600 mb-0.5">
                        Question
                      </div>
                      <div className="text-sm">
                        {message.question}
                      </div>
                    </div>
                    {hasAnswer && (
                      <div className="mt-3">
                        <div className="text-xs font-semibold text-gray-600 mb-0.5">
                          Your latest reply
                        </div>
                        <div className="text-sm bg-love-light/40 border border-love-pink/30 rounded-lg p-2 text-gray-800">
                          {message.answer}
                        </div>
                        {answeredAt && (
                          <div className="text-[11px] text-gray-400 mt-1">
                            Replied at {answeredAt}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="mt-3">
                      <div className="text-xs font-semibold text-gray-600 mb-1">
                        Reply to customer
                      </div>
                      <textarea
                        rows={2}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                        value={draftValue}
                        onChange={(e) =>
                          setReplyDrafts(prev => ({
                            ...prev,
                            [message.id]: e.target.value
                          }))
                        }
                        placeholder="Write a helpful reply..."
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="button"
                          disabled={
                            replySubmittingId === message.id ||
                            !draftValue.trim()
                          }
                          onClick={() => handleReply(message)}
                          className="px-3 py-1.5 rounded-lg bg-love-red text-white text-xs font-medium hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {replySubmittingId === message.id ? 'Sending...' : 'Send reply'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
