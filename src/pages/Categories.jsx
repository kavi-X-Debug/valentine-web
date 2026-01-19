import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PRODUCTS, CATEGORY_IMAGES } from '../data/products';

export default function Categories() {
  const categories = useMemo(() => {
    const set = new Set(MOCK_PRODUCTS.map(p => p.category));
    return Array.from(set).sort();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-cursive text-love-dark">Browse by Category</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Pick a category to see gifts tailored to that theme.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat}
            to={`/products?category=${encodeURIComponent(cat)}`}
            className="group bg-white border border-love-pink/20 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all flex flex-col text-center"
          >
            <div className="w-full h-24 sm:h-28 rounded-lg overflow-hidden mb-3 bg-love-light">
              {CATEGORY_IMAGES[cat] && (
                <img
                  src={CATEGORY_IMAGES[cat]}
                  alt={cat}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <div className="text-sm sm:text-base font-medium text-love-dark group-hover:text-love-red">
              {cat}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
