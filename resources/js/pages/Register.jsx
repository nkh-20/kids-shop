import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '', email: '', password: '', password_confirmation: '', phone: '', address: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(form);
            setSuccess('Registration successful! You can now login.');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12">
            <div className="bg-white rounded-xl shadow-sm p-8">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Register</h1>

                {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input id="reg-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple focus:border-transparent" required />
                    </div>
                    <div>
                        <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input id="reg-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple focus:border-transparent" required />
                    </div>
                    <div>
                        <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input id="reg-password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple focus:border-transparent" required />
                    </div>
                    <div>
                        <label htmlFor="reg-password-confirm" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input id="reg-password-confirm" type="password" value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple focus:border-transparent" required />
                    </div>
                    <div>
                        <label htmlFor="reg-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                        <input id="reg-phone" type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple focus:border-transparent" />
                    </div>
                    <div>
                        <label htmlFor="reg-address" className="block text-sm font-medium text-gray-700 mb-1">Address (optional)</label>
                        <textarea id="reg-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple focus:border-transparent" rows="2" />
                    </div>
                    <button type="submit" className="w-full bg-kids-purple text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition">
                        Register
                    </button>
                </form>

                <p className="text-center mt-4 text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-kids-purple hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;