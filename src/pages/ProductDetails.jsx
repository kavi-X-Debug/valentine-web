import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Star, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOCK_PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [questionText, setQuestionText] = useState('');
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  const [questionError, setQuestionError] = useState('');
  const [questionSuccess, setQuestionSuccess] = useState('');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      let found = null;
      if (id) {
        const numericId = Number(id);
        if (!Number.isNaN(numericId)) {
          found = MOCK_PRODUCTS.find(p => p.id === numericId);
        }
      }
      if (found) {
        if (isMounted) {
          const subImages = Array.isArray(found.subImages) ? found.subImages : [];
          setProduct({ ...found, subImages });
          setProductLoading(false);
        }
        return;
      }
      if (!id) {
        if (isMounted) {
          setProduct(null);
          setProductLoading(false);
        }
        return;
      }
      setProductLoading(true);
      try {
        const ref = doc(db, 'products', id);
        const snap = await getDoc(ref);
        if (!isMounted) return;
        if (snap.exists()) {
          const data = snap.data() || {};
          setProduct({
            id: snap.id,
            name: data.name || '',
            category: data.category || '',
            price: Number(data.price || 0),
            image: data.image || '',
            description: data.description || '',
            tags: Array.isArray(data.tags) ? data.tags : [],
            subImages: Array.isArray(data.subImages) ? data.subImages : []
          });
        } else {
          setProduct(null);
        }
      } catch (e) {
        console.error('Failed to load product', e);
        if (isMounted) {
          setProduct(null);
        }
      } finally {
        if (isMounted) {
          setProductLoading(false);
        }
      }
    }
    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product]);

  const handleAddToCart = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setShowConfirm(true);
  };
  useEffect(() => {
    if (!product || !currentUser) return;
    const q = query(
      collection(db, 'productMessages'),
      where('userId', '==', currentUser.uid)
    );
    const unsub = onSnapshot(
      q,
      snapshot => {
        const list = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(m => m.productId === product.id)
          .sort((a, b) => {
            const ta = a.createdAt && a.createdAt.toDate ? a.createdAt.toDate().getTime() : 0;
            const tb = b.createdAt && b.createdAt.toDate ? b.createdAt.toDate().getTime() : 0;
            return tb - ta;
          });
        setQuestions(list);
      },
      (error) => {
        console.error('Product questions subscription error:', error);
        setQuestions([]);
      }
    );
    return () => unsub();
  }, [product, currentUser]);
  
  useEffect(() => {
    if (!product) return;
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', product.id)
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
        setReviews(list);
      },
      (error) => {
        console.error('Reviews subscription error:', error);
        setReviews([]);
      }
    );
    return () => unsub();
  }, [product]);
  const imageList = product
    ? [product.image, ...(Array.isArray(product.subImages) ? product.subImages : [])].filter(Boolean)
    : [];

  async function handleSubmitQuestion(e) {
    e.preventDefault();
    const text = questionText.trim();
    if (!text) {
      setQuestionError('Please enter a question.');
      setQuestionSuccess('');
      return;
    }
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setQuestionSubmitting(true);
    setQuestionError('');
    setQuestionSuccess('');
    try {
      await addDoc(collection(db, 'productMessages'), {
        productId: product.id,
        productName: product.name || '',
        userId: currentUser.uid,
        userEmail: currentUser.email || '',
        question: text,
        answer: '',
        status: 'open',
        createdAt: serverTimestamp(),
        answeredAt: null
      });
      setQuestionText('');
      setQuestionSuccess('Your question has been sent.');
    } catch (err) {
      console.error('Failed to submit question', err);
      setQuestionError('Failed to send your question. Please try again.');
    } finally {
      setQuestionSubmitting(false);
    }
  }

  if (productLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800">Loading product...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <Link to="/products" className="mt-4 text-love-red hover:underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-love-red mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Gifts
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl overflow-hidden shadow-lg border border-love-pink/20"
        >
          {imageList.length > 0 && (
            <div className="relative">
              <img
                src={imageList[activeImageIndex]}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover object-top"
              />
              {imageList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0 ? imageList.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 text-gray-700 hover:bg-white shadow"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === imageList.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 text-gray-700 hover:bg-white shadow"
                  >
                    ›
                  </button>
                  <div className="flex justify-center gap-2 mt-3 pb-3">
                    {imageList.map((src, index) => (
                      <button
                        key={`${product.id}-thumb-${index}`}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={`h-3 w-3 rounded-full border ${
                          index === activeImageIndex
                            ? 'bg-love-red border-love-red'
                            : 'bg-white border-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <div className="text-sm text-love-red font-medium uppercase tracking-wider mb-2">{product.category}</div>
            <h1 className="text-4xl font-cursive text-love-dark mb-2">{product.name}</h1>
            {reviews.length > 0 && (
              <div className="flex items-center space-x-2 text-yellow-500 text-sm mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-gray-400">
                  ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}
            <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
          </div>

          <div className="mt-2 p-4 rounded-xl bg-love-light/40 border border-love-pink/30">
            <div className="text-sm font-semibold text-gray-800 mb-1">About this item</div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description || "Celebrate your love with this handcrafted treasure. Perfect for anniversaries, Valentine's Day, or just because."}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-medium text-gray-700">Ask about this product</h2>
                {!currentUser && (
                  <span className="text-xs text-gray-500">Sign in to ask a question</span>
                )}
              </div>
              <form onSubmit={handleSubmitQuestion} className="space-y-3">
                <textarea
                  rows={3}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-love-pink focus:ring-love-pink text-sm p-3 border"
                  placeholder="Ask a question about this item..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  disabled={questionSubmitting || !currentUser}
                />
                {questionError && (
                  <div className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded">
                    {questionError}
                  </div>
                )}
                {questionSuccess && (
                  <div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                    {questionSuccess}
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={
                      questionSubmitting ||
                      !currentUser ||
                      !questionText.trim()
                    }
                    className="px-4 py-2 rounded-lg bg-love-red text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {questionSubmitting ? 'Sending...' : 'Send question'}
                  </button>
                </div>
              </form>
            </div>

            <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-50"
              >
                -
              </button>
              <span className="px-3 py-2 font-medium w-12 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-50"
              >
                +
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full">
              <button 
                onClick={handleAddToCart}
                disabled={added}
                className={`w-full sm:flex-1 px-6 py-3 rounded-lg font-medium transition-colors shadow-md flex items-center justify-center space-x-2 ${added ? 'bg-green-600 text-white' : 'bg-love-red text-white hover:bg-red-700'}`}
              >
                {added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                <span>{added ? 'Added to Cart' : 'Add to Cart'}</span>
              </button>
              <button className="w-full sm:w-auto p-3 border border-gray-300 rounded-lg hover:border-love-red hover:text-love-red transition-colors flex items-center justify-center">
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-4">
             <div className="flex items-center"><Check className="h-4 w-4 mr-1 text-green-500" /> In Stock</div>
             <div className="flex items-center"><Check className="h-4 w-4 mr-1 text-green-500" /> Free Shipping</div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-5">
            <h2 className="text-lg font-semibold text-love-dark mb-3">Customer reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-500">
                There are no reviews for this item yet. Customers can share a review after their order is completed.
              </p>
            ) : (
              <div className="space-y-3">
                {reviews.map(review => {
                  const createdAt = review.createdAt && review.createdAt.toDate
                    ? review.createdAt.toDate().toLocaleDateString()
                    : '';
                  return (
                    <div
                      key={review.id}
                      className="bg-white border border-love-pink/20 rounded-xl p-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-semibold text-gray-800">
                          {review.userName || 'Someone'}
                        </div>
                        {createdAt && (
                          <div className="text-xs text-gray-400">
                            {createdAt}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">
                        {review.message}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {currentUser && (
            <div className="mt-6 border-t border-gray-200 pt-5">
              <h2 className="text-lg font-semibold text-love-dark mb-3">Your questions</h2>
              {questions.length === 0 ? (
                <p className="text-sm text-gray-500">
                  You have not asked any questions about this item yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {questions.map(q => {
                    const createdAt = q.createdAt && q.createdAt.toDate
                      ? q.createdAt.toDate().toLocaleString()
                      : '';
                    const answeredAt = q.answeredAt && q.answeredAt.toDate
                      ? q.answeredAt.toDate().toLocaleString()
                      : '';
                    const hasAnswer = q.answer && q.answer.trim();
                    return (
                      <div
                        key={q.id}
                        className="bg-white border border-love-pink/20 rounded-xl p-3 shadow-sm text-sm"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold text-gray-800">
                            Your question
                          </div>
                          <div className="text-xs text-gray-400">
                            {createdAt}
                          </div>
                        </div>
                        <p className="text-gray-800 mb-2">
                          {q.question}
                        </p>
                        <div className="text-xs mb-1">
                          <span
                            className={
                              'inline-flex items-center px-2 py-0.5 rounded-full font-medium ' +
                              (hasAnswer
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800')
                            }
                          >
                            {hasAnswer ? 'Answered' : 'Waiting for reply'}
                          </span>
                        </div>
                        {hasAnswer && (
                          <div className="mt-2">
                            <div className="text-xs font-semibold text-gray-500 mb-1">
                              Reply from store
                            </div>
                            <div className="text-gray-800 bg-love-light/40 border border-love-pink/30 rounded-lg p-2">
                              {q.answer}
                            </div>
                            {answeredAt && (
                              <div className="text-[11px] text-gray-400 mt-1">
                                Replied at {answeredAt}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl border border-love-pink/30 p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold text-love-dark mb-2">Add to cart?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Add "{product.name}"{quantity > 1 ? ` (x${quantity})` : ''} to your cart?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  addToCart(product, quantity, customText);
                  setAdded(true);
                  setShowConfirm(false);
                  setTimeout(() => setAdded(false), 2000);
                }}
                className="px-4 py-2 rounded-lg bg-love-red text-white hover:bg-red-700 text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
