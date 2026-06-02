import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
    const { cart, fetchCart, updateItem, removeItem, clear, loading } = useCart();
    const [message, setMessage] = useState(null);
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        if (cart?.items) {
            const q = {};
            cart.items.forEach(item => { q[item.id] = item.quantity; });
            setQuantities(q);
        }
    }, [cart]);

    const handleQuantityChange = async (itemId, newQty) => {
        if (newQty < 1) return;
        setQuantities(prev => ({ ...prev, [itemId]: newQty }));
        try {
            await updateItem(itemId, newQty);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to update.');
        }
    };

    const handleRemove = async (itemId) => {
        try {
            await removeItem(itemId);
            setMessage('Item removed.');
        } catch (err) {
            setMessage('Failed to remove item.');
        }
    };

    const handleClear = async () => {
        if (window.confirm('Clear your entire cart?')) {
            await clear();
            setMessage('Cart cleared.');
        }
    };

    const items = cart?.items || [];

    if (items.length === 0) {
        return (
            <div className="text-center py-16">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
                <p className="text-gray-500 mb-6">Add some products to get started!</p>
                <Link to="/products" className="bg-kids-purple text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
                <button onClick={handleClear} className="text-red-500 hover:text-red-600 text-sm">
                    Clear Cart
                </button>
            </div>

            {message && (
                <div className="bg-blue-50 text-blue-600 p-3 rounded-lg mb-4 text-sm">{message}</div>
            )}

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {items.map(item => (
                    <div key={item.id} className="flex items-center p-4 border-b last:border-0 hover:bg-gray-50 transition">
                        <div className="flex-1">
                            <Link to={`/products/${item.product_id}`} className="font-semibold text-gray-800 hover:text-kids-purple">
                                {item.product?.name}
                            </Link>
                            <p className="text-sm text-gray-500">{item.price?.toLocaleString()} Ks each</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center border rounded-lg">
                                <button onClick={() => handleQuantityChange(item.id, (quantities[item.id] || item.quantity) - 1)}
                                    className="px-3 py-1 hover:bg-gray-100 transition">-</button>
                                <span className="px-3 py-1">{quantities[item.id] || item.quantity}</span>
                                <button onClick={() => handleQuantityChange(item.id, (quantities[item.id] || item.quantity) + 1)}
                                    className="px-3 py-1 hover:bg-gray-100 transition">+</button>
                            </div>
                            <span className="font-semibold text-gray-800 w-24 text-right">
                                {((quantities[item.id] || item.quantity) * item.price)?.toLocaleString()} Ks
                            </span>
                            <button onClick={() => handleRemove(item.id)} className="text-red-400 hover:text-red-600 transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-gray-800">Subtotal</span>
                    <span className="font-bold text-gray-900">{cart?.subtotal?.toLocaleString()} Ks</span>
                </div>
                <div className="flex justify-between items-center text-xl mt-2 pt-2 border-t">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-kids-purple">{cart?.total?.toLocaleString()} Ks</span>
                </div>
                <Link to="/checkout" className="block text-center bg-kids-purple text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition mt-4">
                    Proceed to Checkout
                </Link>
            </div>
        </div>
    );
};

export default Cart;
