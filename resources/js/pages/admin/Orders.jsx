import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { statusColors, ORDER_STATUSES } from '../../utils/constants';
import { formatPrice, ucfirst } from '../../utils/format';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [error, setError] = useState('');

    const fetchOrders = () => {
        setLoading(true);
        setError('');
        const params = { page, per_page: 15 };
        if (statusFilter) params.status = statusFilter;

        api.get('/admin/orders', { params })
            .then(res => {
                setOrders(res.data.data);
                setMeta(res.data.meta);
            })
            .catch(() => setError('Failed to load orders.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchOrders(); }, [page, statusFilter]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
            fetchOrders();
        } catch (err) {
            setError('Failed to update status.');
        }
    };

    if (loading && orders.length === 0) return <LoadingSpinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-4 py-2 border rounded-lg" aria-label="Filter by status">
                    <option value="">All Status</option>
                    {ORDER_STATUSES.map(s => (
                        <option key={s} value={s}>{ucfirst(s)}</option>
                    ))}
                </select>
            </div>

            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>
            )}

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Order #</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Customer</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Items</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Total</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-t hover:bg-gray-50 transition">
                                <td className="p-4 font-medium">{order.order_number}</td>
                                <td className="p-4 text-gray-600">{order.user?.name}</td>
                                <td className="p-4">{order.items?.length || 0}</td>
                                <td className="p-4 font-medium">{formatPrice(order.total)}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                        {ucfirst(order.status)}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="px-2 py-1 border rounded text-sm" aria-label="Change status">
                                        {ORDER_STATUSES.map(s => (
                                            <option key={s} value={s}>{ucfirst(s)}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr><td colSpan={7} className="p-8 text-center text-gray-400">No orders found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {meta && meta.last_page > 1 && (
                <div className="flex justify-center space-x-2 mt-4">
                    {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)}
                            className={`px-3 py-1 rounded-lg ${page === p ? 'bg-kids-purple text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                            aria-label={`Go to page ${p}`}>
                            {p}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminOrders;