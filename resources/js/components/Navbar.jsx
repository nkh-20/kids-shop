
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
    const { user, isAdmin, logout } = useAuth();
    const { itemCount } = useCart();

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-kids-purple to-kids-pink bg-clip-text text-transparent">
                            KidsOnline
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/products" className="text-gray-600 hover:text-kids-purple transition">Products</Link>
                        {user ? (
                            <>
                                <Link to="/orders" className="text-gray-600 hover:text-kids-purple transition">My Orders</Link>
                                <Link to="/cart" className="relative text-gray-600 hover:text-kids-purple transition" aria-label="Shopping cart">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                                    </svg>
                                    {itemCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-kids-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {itemCount}
                                        </span>
                                    )}
                                </Link>
                                {isAdmin && (
                                    <Link to="/admin/dashboard" className="text-kids-purple font-semibold hover:text-purple-700 transition">
                                        Admin
                                    </Link>
                                )}
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-500">{user.name}</span>
                                    <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-kids-purple transition">Login</Link>
                                <Link to="/register" className="bg-kids-purple text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
