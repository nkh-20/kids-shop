import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">KidsOnline</h3>
                        <p className="text-gray-400 text-sm">Your one-stop shop for kids products. Toys, clothing, books, and more!</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/products" className="hover:text-white transition">Products</Link></li>
                            <li><Link to="/cart" className="hover:text-white transition">Cart</Link></li>
                            <li><Link to="/orders" className="hover:text-white transition">Orders</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>Email: info@kidsonline.com</li>
                            <li>Phone: +95 1 234 567</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} KidsOnline. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
