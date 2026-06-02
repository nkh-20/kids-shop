import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../api/products';
import { getCategories } from '../api/categories';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [categoryId, setCategoryId] = useState(searchParams.get('category_id') || '');
    const [sortBy, setSortBy] = useState('created_at');
    const [page, setPage] = useState(1);

    useEffect(() => {
        getCategories().then(res => setCategories(res.data.data));
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = { page, sort_by: sortBy, sort_order: 'desc', per_page: 12 };
        if (search) params.search = search;
        if (categoryId) params.category_id = categoryId;

        getProducts(params)
            .then(res => {
                setProducts(res.data.data);
                setMeta(res.data.meta);
            })
            .finally(() => setLoading(false));
    }, [page, sortBy, search, categoryId]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        const params = {};
        if (search) params.search = search;
        if (categoryId) params.category_id = categoryId;
        setSearchParams(params);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>

            <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple focus:border-transparent"
                    />
                    <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple">
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple">
                        <option value="created_at">Newest</option>
                        <option value="price">Price: Low to High</option>
                        <option value="name">Name</option>
                    </select>
                    <button type="submit" className="bg-kids-purple text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                        Search
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-kids-purple border-t-transparent"></div>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xl">No products found.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {meta && meta.last_page > 1 && (
                        <div className="flex justify-center space-x-2">
                            {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)}
                                    className={`px-4 py-2 rounded-lg ${page === p ? 'bg-kids-purple text-white' : 'bg-white text-gray-600 hover:bg-gray-100'} transition`}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Products;
