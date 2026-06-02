import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getProducts } from '../api/products';
import { getCategories } from '../api/categories';

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getProducts({ per_page: 8, sort_by: 'created_at', sort_order: 'desc' }),
            getCategories(),
        ])
            .then(([productsRes, categoriesRes]) => {
                setFeatured(productsRes.data.data);
                setCategories(categoriesRes.data.data);
            })
            .catch(() => {
                // API error silently handled - empty state shown
            })
            .finally(() => setLoading(false));
    }, []);

    const gradients = ['from-kids-pink to-kids-purple', 'from-kids-blue to-kids-green', 'from-kids-yellow to-kids-orange', 'from-kids-purple to-kids-blue'];

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-12">
            <section className="text-center py-16">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    Welcome to <span className="bg-gradient-to-r from-kids-purple to-kids-pink bg-clip-text text-transparent">KidsOnline</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8">Discover amazing toys, books, clothes and more for your little ones!</p>
                <Link to="/products" className="inline-block bg-kids-purple text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition shadow-lg">
                    Shop Now
                </Link>
            </section>

            {categories.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((cat, i) => (
                            <Link key={cat.id} to={`/products?category_id=${cat.id}`}
                                className={`bg-gradient-to-br ${gradients[i % gradients.length]} p-6 rounded-xl text-white text-center hover:shadow-lg transition transform hover:-translate-y-1`}>
                                <h3 className="font-semibold">{cat.name}</h3>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Latest Products</h2>
                    <Link to="/products" className="text-kids-purple hover:underline">View All</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featured.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;