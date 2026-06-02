import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', description: '', status: true });

    const fetchCategories = () => {
        setLoading(true);
        getCategories()
            .then(res => setCategories(res.data.data))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchCategories(); }, []);

    const openCreate = () => {
        setEditing(null);
        setError('');
        setForm({ name: '', description: '', status: true });
        setShowForm(true);
    };

    const openEdit = (cat) => {
        setEditing(cat);
        setError('');
        setForm({ name: cat.name, description: cat.description || '', status: cat.status });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editing) {
                await updateCategory(editing.id, form);
            } else {
                await createCategory(form);
            }
            setShowForm(false);
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save category.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await deleteCategory(id);
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete.');
        }
    };

    if (loading && categories.length === 0) return <LoadingSpinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
                <button onClick={openCreate} className="bg-kids-purple text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                    + Add Category
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Category' : 'Add Category'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="cat-name" className="block text-sm font-medium mb-1">Name</label>
                                <input id="cat-name" type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label htmlFor="cat-description" className="block text-sm font-medium mb-1">Description</label>
                                <textarea id="cat-description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg" rows="3" />
                            </div>
                            <div>
                                <label htmlFor="cat-status" className="block text-sm font-medium mb-1">Status</label>
                                <select id="cat-status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value === 'true' })}
                                    className="w-full px-3 py-2 border rounded-lg">
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
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
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Slug</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Products</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat.id} className="border-t hover:bg-gray-50 transition">
                                <td className="p-4 font-medium">{cat.name}</td>
                                <td className="p-4 text-gray-500">{cat.slug}</td>
                                <td className="p-4">{cat.products_count}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${cat.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {cat.status ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-4 flex space-x-2">
                                    <button onClick={() => openEdit(cat)} className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
                                    <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCategories;