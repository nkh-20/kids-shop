import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatPrice } from '../../utils/format';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/admin/dashboard')
            .then(res => setStats(res.data.data))
            .catch(() => setError('Failed to load dashboard data.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="text-center py-16">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    const cards = [
        { label: 'Total Users', value: stats?.total_users || 0, color: 'bg-blue-500', link: '#' },
        { label: 'Total Products', value: stats?.total_products || 0, color: 'bg-kids-purple', link: '/admin/products' },
        { label: 'Total Orders', value: stats?.total_orders || 0, color: 'bg-green-500', link: '/admin/orders' },
        { label: 'Revenue', value: formatPrice(stats?.revenue || 0), color: 'bg-yellow-500', link: '#' },
        { label: 'Pending Orders', value: stats?.pending_orders || 0, color: 'bg-orange-500', link: '/admin/orders' },
        { label: 'Low Stock Items', value: stats?.low_stock_products || 0, color: 'bg-red-500', link: '/admin/products' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map(card => (
                    <div key={card.label} className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                                <span className="text-white text-xl font-bold">{card.value.toString().charAt(0)}</span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">{card.label}</p>
                                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-4 text-sm font-medium text-gray-500">Order</th>
                                <th className="text-left p-4 text-sm font-medium text-gray-500">Customer</th>
                                <th className="text-left p-4 text-sm font-medium text-gray-500">Total</th>
                                <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                                <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.recent_orders?.map(order => (
                                <tr key={order.id} className="border-t hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium text-gray-800">{order.order_number}</td>
                                    <td className="p-4 text-gray-600">{order.user?.name}</td>
                                    <td className="p-4 text-gray-800">{formatPrice(order.total)}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {(!stats?.recent_orders || stats.recent_orders.length === 0) && (
                                <tr><td colSpan={5} className="p-4 text-center text-gray-400">No orders yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;