import React, { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Filter } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/products';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';

export default function Products() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('none');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const { currentUser } = useAuth();
  const [selectedTags, setSelectedTags] = useState([]);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [pricePreset, setPricePreset] = useState('none');
  const [searchParams] = useSearchParams();

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
  const pageSize = 16;
  const totalPages = Math.max(1, Math.ceil(displayedProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = displayedProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalItems = displayedProducts.length;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = totalItems === 0 ? 0 : startItem + pageItems.length - 1;
  let pages = [];
  if (totalPages <= 5) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else if (currentPage <= 3) {
    pages = [1, 2, 3, 4, 'dots', totalPages];
  } else if (currentPage >= totalPages - 2) {
    pages = [1, 'dots', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  } else {
    pages = [1, 'dots', currentPage - 1, currentPage, currentPage + 1, 'dots', totalPages];
  }
  const allTags = useMemo(() => {
    const s = new Set();
    MOCK_PRODUCTS.forEach(p => (p.tags || []).forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, []);

  useEffect(() => {
    const raw = searchParams.get('category') || searchParams.get('cat');
    if (!raw) return;
    const value = decodeURIComponent(raw).toLowerCase();
    let found = categories.find(c => c.toLowerCase() === value);
    if (!found) {
      found = categories.find(c => c.toLowerCase().includes(value));
    }
    if (found && found !== filter) {
      setFilter(found);
      setPage(1);
    }
  }, [searchParams, categories, filter]);

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

  function toggleFilters() {
    setFilterOpen(v => !v);
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
        <section className="order-1 md:order-2 md:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={toggleFilters}
              className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg bg-white border border-love-pink/30 text-gray-600 hover:text-love-red hover:border-love-red transition-colors"
              aria-label="Toggle filters"
              title="Filters"
            >
              <Filter className="h-5 w-5" />
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>
          <div className={`bg-white p-4 rounded-xl shadow-sm border border-love-pink/20 mb-6 ${filterOpen ? 'block' : 'hidden'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <span className="text-sm font-semibold text-love-dark">Filter & Sort</span>
                <button
                  type="button"
                  onClick={() => {
                    setFilter('All');
                    setSearch('');
                    setSort('none');
                    setMinPrice('');
                    setMaxPrice('');
                    setPricePreset('none');
                    setOnlyFavorites(false);
                    setPage(1);
                  }}
                  className="self-start text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
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
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Max price"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        onClick={() => {
                          setPricePreset(opt.id);
                          setPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg border text-sm ${
                          pricePreset === opt.id ? 'bg-love-red text-white border-love-red' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
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
                    onClick={() => {
                      setOnlyFavorites(v => !v);
                      setPage(1);
                    }}
                    disabled={!currentUser}
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${
                      onlyFavorites ? 'bg-love-red text-white border-love-red' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    } ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {onlyFavorites ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              {totalItems === 0 ? 'No gifts found. Try adjusting your filters.' : `Showing ${startItem}-${endItem} of ${totalItems} gifts`}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-md border text-sm ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                {pages.map((pItem, index) =>
                  pItem === 'dots' ? (
                    <span key={`dots-${index}`} className="px-2 text-gray-400 text-sm">
                      ...
                    </span>
                  ) : (
                    <button
                      key={pItem}
                      onClick={() => setPage(pItem)}
                      className={`px-3 py-2 rounded-md border text-sm ${
                        pItem === currentPage
                          ? 'bg-love-red text-white border-love-red'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pItem}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-md border text-sm ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

    </div>
  );
}
