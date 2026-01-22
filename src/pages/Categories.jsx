import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PRODUCTS, CATEGORY_IMAGES } from '../data/products';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

export default function Categories() {
  const [firestoreCategories, setFirestoreCategories] = useState([]);

  useEffect(() => {
    const ref = collection(db, 'categories');
    const unsub = onSnapshot(
      ref,
      snapshot => {
        const list = snapshot.docs
          .map(d => {
            const data = d.data() || {};
            const name = data.name ? String(data.name).trim() : '';
            const image = data.image ? String(data.image).trim() : '';
            return { id: d.id, name, image };
          })
          .filter(c => c.name);
        setFirestoreCategories(list);
      },
      () => {
        setFirestoreCategories([]);
      }
    );
    return () => unsub();
  }, []);

  const categories = useMemo(() => {
    const map = new Map();
    MOCK_PRODUCTS.forEach(p => {
      const name = p.category;
      if (!name) return;
      if (!map.has(name)) {
        map.set(name, {
          name,
          image: CATEGORY_IMAGES[name] || ''
        });
      }
    });
    firestoreCategories.forEach(cat => {
      const name = cat.name;
      if (!name) return;
      const existing = map.get(name);
      const image = cat.image || (existing ? existing.image : CATEGORY_IMAGES[name] || '');
      map.set(name, {
        name,
        image
      });
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [firestoreCategories]);

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
            key={cat.name}
            to={`/products?category=${encodeURIComponent(cat.name)}`}
            className="group bg-white border border-love-pink/20 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all flex flex-col text-center"
          >
            <div className="w-full h-24 sm:h-28 rounded-lg overflow-hidden mb-3 bg-love-light">
              {cat.image && (
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <div className="text-sm sm:text-base font-medium text-love-dark group-hover:text-love-red">
              {cat.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
