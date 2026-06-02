import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { placeOrder } from '../api/orders';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatPrice } from '../utils/format';

const Checkout = () => {
    const { cart, fetchCart } = useCart();
    const navigate = useNavigate();
    const [form, setForm] = useState({ shipping_address: '', notes: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCart();
    }, []);

    const items = cart?.items || [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.shipping_address.trim()) {
            setError('Shipping address is required.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await placeOrder({
                shipping_address: form.shipping_address,
                notes: form.notes,
                payment_method: 'cod',
            });
            navigate(`/orders`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order.');
        } finally {
            setLoading(false);
        }
    };

    if (!cart && items.length === 0) return <LoadingSpinner />;

    if (items.length === 0) {
        return (
            <div className="text-center py-16">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
                <p className="text-gray-500">Add items before checking out.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Details</h2>
                    {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="checkout-address" className="block text-sm font-medium text-gray-700 mb-1">Shipping Address *</label>
                            <textarea id="checkout-address" value={form.shipping_address} onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple focus:border-transparent" rows="3" required />
                        </div>
                        <div>
                            <label htmlFor="checkout-notes" className="block text-sm font-medium text-gray-700 mb-1">Order Notes (optional)</label>
                            <textarea id="checkout-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple focus:border-transparent" rows="2" />
                        </div>

                        <h3 className="font-medium text-gray-700 pt-2">Payment Method</h3>
                        <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-3">
                            <input id="checkout-cod" type="radio" checked readOnly className="text-kids-purple" />
                            <label htmlFor="checkout-cod">Cash on Delivery (COD)</label>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50">
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                    <div className="space-y-3">
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.product?.name} x{item.quantity}</span>
                                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t mt-4 pt-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">{formatPrice(cart?.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span className="text-kids-purple">{formatPrice(cart?.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;