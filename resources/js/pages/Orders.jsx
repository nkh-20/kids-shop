import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../api/orders';
import LoadingSpinner from '../components/LoadingSpinner';
import { statusColors } from '../utils/constants';
import { formatPrice, ucfirst } from '../utils/format';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getOrders()
            .then(res => setOrders(res.data.data))
            .catch(() => setError('Failed to load orders.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="text-center py-16">
                <p className="text-red-500 text-lg mb-4">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-xl mb-4">No orders yet.</p>
                    <Link to="/products" className="bg-kids-purple text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <Link key={order.id} to={`/orders/${order.id}`}
                            className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{order.order_number}</h3>
                                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-600 mt-1">{order.items?.length || 0} item(s)</p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                        {ucfirst(order.status)}
                                    </span>
                                    <p className="font-bold text-gray-800 mt-1">{formatPrice(order.total)}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;