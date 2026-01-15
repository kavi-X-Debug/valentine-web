import React, { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Filter } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/products';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export default function Products() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('none');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [tempSearch, setTempSearch] = useState('');
  const [tempSort, setTempSort] = useState('none');
  const [tempMinPrice, setTempMinPrice] = useState('');
  const [tempMaxPrice, setTempMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const { currentUser } = useAuth();
  const [selectedTags, setSelectedTags] = useState([]);
  const [tempSelectedTags, setTempSelectedTags] = useState([]);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [tempOnlyFavorites, setTempOnlyFavorites] = useState(false);
  const [pricePreset, setPricePreset] = useState('none');
  const [tempPricePreset, setTempPricePreset] = useState('none');

  const categories = useMemo(() => {
    const set = new Set(MOCK_PRODUCTS.map(p => p.category));
    return ['All', ...Array.from(set)];
  }, []);

  const displayedProducts = useMemo(() => {
    let arr = filter === 'All' ? MOCK_PRODUCTS : MOCK_PRODUCTS.filter(p => p.category === filter);
    const q = search.trim().toLowerCase();
    if (q) {
      arr = arr.filter(p => p.name.toLowerCase().includes(q));
    }
    let min = minPrice !== '' ? parseFloat(minPrice) : null;
    let max = maxPrice !== '' ? parseFloat(maxPrice) : null;
    if (pricePreset !== 'none') {
      if (pricePreset === 'under30') { min = null; max = 30; }
      else if (pricePreset === '30to50') { min = 30; max = 50; }
      else if (pricePreset === '50plus') { min = 50; max = null; }
    }
    if (min !== null) {
      arr = arr.filter(p => p.price >= min);
    }
    if (max !== null) {
      arr = arr.filter(p => p.price <= max);
    }
    if (selectedTags.length > 0) {
      arr = arr.filter(p => p.tags && p.tags.some(t => selectedTags.includes(t)));
    }
    if (onlyFavorites && currentUser) {
      arr = arr.filter(p => favorites.includes(p.id));
    }
    if (sort === 'price_asc') {
      arr = [...arr].sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      arr = [...arr].sort((a, b) => b.price - a.price);
    } else if (sort === 'name_asc') {
      arr = [...arr].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name_desc') {
      arr = [...arr].sort((a, b) => b.name.localeCompare(a.name));
    }
    return arr;
  }, [filter, search, minPrice, maxPrice, sort, selectedTags, onlyFavorites, pricePreset, favorites, currentUser]);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(displayedProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = displayedProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const allTags = useMemo(() => {
    const s = new Set();
    MOCK_PRODUCTS.forEach(p => (p.tags || []).forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, []);

  useEffect(() => {
    let active = true;
    async function loadFavs() {
      if (!currentUser) {
        if (active) setFavorites([]);
        return;
      }
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(userRef);
        if (!active) return;
        const data = snap.exists() ? snap.data() : {};
        setFavorites(Array.isArray(data.favorites) ? data.favorites : []);
      } catch {
        if (active) setFavorites([]);
      }
    }
    loadFavs();
    return () => { active = false; };
  }, [currentUser]);

  async function toggleFavorite(id) {
    if (!currentUser) {
      alert('Please log in to save favorites');
      return;
    }
    const isFav = favorites.includes(id);
    const userRef = doc(db, 'users', currentUser.uid);
    try {
      await updateDoc(userRef, {
        favorites: isFav ? arrayRemove(id) : arrayUnion(id)
      });
      setFavorites(prev => isFav ? prev.filter(x => x !== id) : [...prev, id]);
    } catch (e) {
      console.error('Failed to update favorites', e);
    }
  }

  function openFilters() {
    setTempSearch(search);
    setTempSort(sort);
    setTempMinPrice(minPrice);
    setTempMaxPrice(maxPrice);
    setTempSelectedTags(selectedTags);
    setTempOnlyFavorites(onlyFavorites);
    setTempPricePreset(pricePreset);
    setFilterOpen(true);
  }

  function applyFilters() {
    setSearch(tempSearch);
    setSort(tempSort);
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setSelectedTags(tempSelectedTags);
    setOnlyFavorites(tempOnlyFavorites);
    setPricePreset(tempPricePreset);
    setFilterOpen(false);
    setPage(1);
  }

  function cancelFilters() {
    setFilterOpen(false);
    setTempSearch(search);
    setTempSort(sort);
    setTempMinPrice(minPrice);
    setTempMaxPrice(maxPrice);
    setTempSelectedTags(selectedTags);
    setTempOnlyFavorites(onlyFavorites);
    setTempPricePreset(pricePreset);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-cursive text-love-dark">Shop Gifts</h1>
          <p className="text-gray-600 mt-2">Find the perfect token of your affection</p>
        </div>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="order-2 md:order-1 md:col-span-1">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-love-pink/20">
            <h2 className="text-lg font-semibold text-love-dark mb-4">Categories</h2>
            <div className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setFilter(cat); setPage(1); }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === cat 
                      ? 'bg-love-red text-white shadow-md' 
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-love-light'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>
        <section className="order-1 md:order-2 md:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={openFilters}
              className="p-2 rounded-lg bg-white border border-love-pink/30 text-gray-600 hover:text-love-red hover:border-love-red transition-colors"
              aria-label="Open Filters"
              title="Filters"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
          {filterOpen && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-love-pink/20 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                  value={tempSearch}
                  onChange={(e) => setTempSearch(e.target.value)}
                />
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                  value={tempSort}
                  onChange={(e) => setTempSort(e.target.value)}
                >
                  <option value="none">Sort by</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Min price"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                  value={tempMinPrice}
                  onChange={(e) => setTempMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Max price"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                  value={tempMaxPrice}
                  onChange={(e) => setTempMaxPrice(e.target.value)}
                />
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(t => {
                      const active = tempSelectedTags.includes(t);
                      return (
                        <button
                          key={t}
                          onClick={() => {
                            setTempSelectedTags(prev => active ? prev.filter(x => x !== t) : [...prev, t]);
                          }}
                          className={`px-3 py-1 rounded-full text-sm border ${
                            active ? 'bg-love-red text-white border-love-red' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Quick Price</div>
                  <div className="space-y-2">
                    {[
                      { id: 'none', label: 'None' },
                      { id: 'under30', label: 'Under $30' },
                      { id: '30to50', label: '$30 – $50' },
                      { id: '50plus', label: '$50+' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setTempPricePreset(opt.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg border text-sm ${
                          tempPricePreset === opt.id ? 'bg-love-red text-white border-love-red' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Only Favorites</div>
                  <button
                    onClick={() => setTempOnlyFavorites(v => !v)}
                    disabled={!currentUser}
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${
                      tempOnlyFavorites ? 'bg-love-red text-white border-love-red' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    } ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {tempOnlyFavorites ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end space-x-3">
                <button
                  onClick={cancelFilters}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 rounded-lg bg-love-red text-white hover:bg-red-700 transition-colors"
                >
                  Show Results
                </button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageItems.map(product => {
              const fav = favorites.includes(product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={fav}
                  onToggleFavorite={() => toggleFavorite(product.id)}
                />
              );
            })}
          </div>
          <div className="mt-8 flex items-center justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`px-3 py-2 rounded-md border text-sm ${
                  n === currentPage 
                    ? 'bg-love-red text-white border-love-red' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}
