import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../api/orders';
import LoadingSpinner from '../components/LoadingSpinner';
import { statusColors } from '../utils/constants';
import { formatPrice, ucfirst } from '../utils/format';

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getOrder(id)
            .then(res => setOrder(res.data.data))
            .catch(() => setError('Failed to load order.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <LoadingSpinner />;

    if (error) {
        return <div className="text-center py-12 text-red-500">{error}</div>;
    }

    if (!order) {
        return <div className="text-center py-12 text-gray-500">Order not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/orders" className="text-kids-purple hover:underline mb-4 inline-block">&larr; Back to Orders</Link>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{order.order_number}</h1>
                        <p className="text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                        {ucfirst(order.status)}
                    </span>
                </div>

                <div className="mt-6 border-t pt-6">
                    <h2 className="font-semibold text-gray-800 mb-2">Shipping Address</h2>
                    <p className="text-gray-600">{order.shipping_address}</p>
                    {order.notes && (
                        <>
                            <h2 className="font-semibold text-gray-800 mt-4 mb-2">Notes</h2>
                            <p className="text-gray-600">{order.notes}</p>
                        </>
                    )}
                </div>

                <div className="mt-6 border-t pt-6">
                    <h2 className="font-semibold text-gray-800 mb-4">Order Items</h2>
                    <div className="space-y-3">
                        {order.items?.map(item => (
                            <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                                <div>
                                    <Link to={`/products/${item.product_id}`} className="font-medium text-gray-800 hover:text-kids-purple">
                                        {item.product?.name}
                                    </Link>
                                    <p className="text-sm text-gray-500">{formatPrice(item.price)} x {item.quantity}</p>
                                </div>
                                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 border-t pt-4 space-y-2">
                    <div className="flex justify-between text-lg">
                        <span className="font-semibold text-gray-800">Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span className="text-kids-purple">{formatPrice(order.total)}</span>
                    </div>
                </div>

                <div className="mt-6 border-t pt-4">
                    <h2 className="font-semibold text-gray-800 mb-2">Payment</h2>
                    <p className="text-gray-600">
                        Method: {order.payment?.payment_method?.toUpperCase() || 'COD'} &middot;
                        Status: {order.payment?.status || 'Pending'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;