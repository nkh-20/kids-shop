import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';
import { getCategories } from '../../api/categories';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatPrice } from '../../utils/format';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '', sku: '', category_id: '', description: '', price: '', sale_price: '',
        stock_quantity: '0', status: true,
    });

    useEffect(() => {
        getCategories().then(res => setCategories(res.data.data));
    }, []);

    const fetchProducts = () => {
        setLoading(true);
        getProducts({ page, per_page: 15 })
            .then(res => {
                setProducts(res.data.data);
                setMeta(res.data.meta);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchProducts(); }, [page]);

    const openCreate = () => {
        setEditing(null);
        setError('');
        setForm({ name: '', sku: '', category_id: '', description: '', price: '', sale_price: '', stock_quantity: '0', status: true });
        setShowForm(true);
    };

    const openEdit = (product) => {
        setEditing(product);
        setError('');
        setForm({
            name: product.name, sku: product.sku, category_id: product.category_id,
            description: product.description || '', price: product.price, sale_price: product.sale_price || '',
            stock_quantity: product.stock_quantity, status: product.status,
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = { ...form };
            if (!data.sale_price) delete data.sale_price;

            if (editing) {
                await updateProduct(editing.id, data);
            } else {
                await createProduct(data);
            }
            setShowForm(false);
            fetchProducts();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save product.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await deleteProduct(id);
            fetchProducts();
        } catch (err) {
            setError('Failed to delete product.');
        }
    };

    if (loading && products.length === 0) return <LoadingSpinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                <button onClick={openCreate} className="bg-kids-purple text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                    + Add Product
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Product' : 'Add Product'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="prod-name" className="block text-sm font-medium mb-1">Name</label>
                                <input id="prod-name" type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label htmlFor="prod-sku" className="block text-sm font-medium mb-1">SKU</label>
                                <input id="prod-sku" type="text" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label htmlFor="prod-category" className="block text-sm font-medium mb-1">Category</label>
                                <select id="prod-category" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg" required>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="prod-description" className="block text-sm font-medium mb-1">Description</label>
                                <textarea id="prod-description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg" rows="3" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="prod-price" className="block text-sm font-medium mb-1">Price</label>
                                    <input id="prod-price" type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg" required />
                                </div>
                                <div>
                                    <label htmlFor="prod-sale-price" className="block text-sm font-medium mb-1">Sale Price</label>
                                    <input id="prod-sale-price" type="number" step="0.01" value={form.sale_price} onChange={e => setForm({ ...form, sale_price: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="prod-stock" className="block text-sm font-medium mb-1">Stock Quantity</label>
                                    <input id="prod-stock" type="number" value={form.stock_quantity} onChange={e => setForm({ ...form, stock_quantity: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg" required />
                                </div>
                                <div>
                                    <label htmlFor="prod-status" className="block text-sm font-medium mb-1">Status</label>
                                    <select id="prod-status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value === 'true' })}
                                        className="w-full px-3 py-2 border rounded-lg">
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex space-x-3 pt-2">
                                <button type="submit" className="flex-1 bg-kids-purple text-white py-2 rounded-lg hover:bg-purple-700 transition">
                                    {editing ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Name</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">SKU</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Category</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Price</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Stock</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                                <td className="p-4 font-medium">{p.name}</td>
                                <td className="p-4 text-gray-500">{p.sku}</td>
                                <td className="p-4 text-gray-600">{p.category?.name}</td>
                                <td className="p-4">{formatPrice(p.current_price)}</td>
                                <td className="p-4">
                                    <span className={p.stock_quantity > 0 ? 'text-green-600' : 'text-red-500'}>
                                        {p.stock_quantity}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${p.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {p.status ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-4 flex space-x-2">
                                    <button onClick={() => openEdit(p)} className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
                                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr><td colSpan={7} className="p-8 text-center text-gray-400">No products found.</td></tr>
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

export default AdminProducts;