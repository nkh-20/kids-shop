import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../api/products';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { addItem, loading: cartLoading } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        getProduct(id)
            .then(res => setProduct(res.data.data))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) {
            setError('Please login to add items to cart.');
            return;
        }
        setMessage(null);
        setError(null);
        try {
            const res = await addItem(product.id, quantity);
            setMessage(res.message || 'Added to cart!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add to cart.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-kids-purple border-t-transparent"></div>
            </div>
        );
    }

    if (!product) {
        return <div className="text-center py-12 text-gray-500">Product not found.</div>;
    }

    const hasSale = product.sale_price && product.sale_price > 0 && product.sale_price < product.price;

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/products" className="text-kids-purple hover:underline mb-4 inline-block">&larr; Back to Products</Link>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2 h-80 bg-gradient-to-br from-kids-blue/20 to-kids-purple/20 flex items-center justify-center">
                        <span className="text-6xl">🎁</span>
                    </div>
                    <div className="md:w-1/2 p-8">
                        <span className="text-sm text-kids-purple font-medium">{product.category?.name}</span>
                        <h1 className="text-3xl font-bold text-gray-800 mt-2">{product.name}</h1>
                        <p className="text-gray-500 text-sm mt-1">SKU: {product.sku}</p>

                        <div className="mt-4">
                            {hasSale ? (
                                <div className="flex items-center space-x-3">
                                    <span className="text-3xl font-bold text-kids-purple">{product.sale_price?.toLocaleString()} Ks</span>
                                    <span className="text-lg text-gray-400 line-through">{product.price?.toLocaleString()} Ks</span>
                                </div>
                            ) : (
                                <span className="text-3xl font-bold text-gray-900">{product.price?.toLocaleString()} Ks</span>
                            )}
                        </div>

                        <p className="text-gray-600 mt-4">{product.description || 'No description available.'}</p>

                        <div className="mt-4">
                            <span className={`text-sm font-medium ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : 'Out of Stock'}
                            </span>
                        </div>

                        {product.stock_quantity > 0 && (
                            <div className="mt-6 space-y-4">
                                <div className="flex items-center space-x-4">
                                    <label className="font-medium text-gray-700">Quantity:</label>
                                    <div className="flex items-center border rounded-lg">
                                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="px-3 py-2 hover:bg-gray-100 transition">-</button>
                                        <span className="px-4 py-2 font-medium">{quantity}</span>
                                        <button onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}
                                            className="px-3 py-2 hover:bg-gray-100 transition">+</button>
                                    </div>
                                </div>

                                <button onClick={handleAddToCart} disabled={cartLoading}
                                    className="w-full bg-kids-purple text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50">
                                    {cartLoading ? 'Adding...' : 'Add to Cart'}
                                </button>

                                {message && <p className="text-green-600 text-sm">{message}</p>}
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
