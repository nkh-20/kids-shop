import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(form);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12">
            <div className="bg-white rounded-xl shadow-sm p-8">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h1>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input id="login-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple focus:border-transparent" required />
                    </div>
                    <div>
                        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input id="login-password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple focus:border-transparent" required />
                    </div>
                    <button type="submit" className="w-full bg-kids-purple text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition">
                        Login
                    </button>
                </form>

                <p className="text-center mt-4 text-sm text-gray-500">
                    Don't have an account? <Link to="/register" className="text-kids-purple hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;