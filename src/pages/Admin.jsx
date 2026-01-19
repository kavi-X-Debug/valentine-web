import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, orderBy, query, updateDoc, doc } from 'firebase/firestore';
import { Search, Loader2 } from 'lucide-react';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      snapshot => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setOrders(list);
        setLoading(false);
      },
      () => {
        setOrders([]);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

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
        return id.includes(term) || email.includes(term) || name.includes(term);
      });
    }
    return list;
  }, [orders, statusFilter, search]);

  async function handleStatusChange(orderId, nextStatus) {
    if (!orderId || !nextStatus) return;
    setUpdatingId(orderId);
    try {
      const ref = doc(db, 'orders', orderId);
      await updateDoc(ref, { status: nextStatus });
    } finally {
      setUpdatingId(null);
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-cursive text-love-dark">Admin Orders</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Monitor user orders, update statuses, and view order details.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email, name, or ID"
              className="pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-love-red focus:border-transparent outline-none w-full sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-love-red focus:border-transparent outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-love-pink/20 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between text-xs sm:text-sm text-gray-600">
          <div>
            Total orders: <span className="font-semibold">{orders.length}</span>
            {statusFilter !== 'all' && (
              <span className="ml-2">
                • Showing <span className="font-semibold">{filteredOrders.length}</span> {statusFilter}
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

        {filteredOrders.length === 0 && !loading && (
          <div className="px-6 py-10 text-center text-sm text-gray-500">
            No orders found for the current filters.
          </div>
        )}

        {filteredOrders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-love-light/70">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredOrders.map(order => {
                  const created = formatDate(order.createdAt);
                  const fullName = `${order.shippingDetails?.firstName || ''} ${order.shippingDetails?.lastName || ''}`.trim() || 'Guest';
                  const status = order.status || 'pending';
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
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
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
              <div className="text-xs text-gray-500">
                Status: <span className="font-semibold">{(order.status || 'pending').toUpperCase()}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1">
                <div className="font-semibold text-gray-800">Customer</div>
                <div>{address.firstName} {address.lastName}</div>
                <div className="text-gray-600">{order.userEmail}</div>
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
    </div>
  );
}
