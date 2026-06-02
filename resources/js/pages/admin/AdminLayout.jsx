import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/products', label: 'Products', icon: '📦' },
    { to: '/admin/categories', label: 'Categories', icon: '📁' },
    { to: '/admin/orders', label: 'Orders', icon: '📋' },
];

const AdminLayout = () => {
    return (
        <div className="flex min-h-[calc(100vh-4rem)]">
            <aside className="w-64 bg-gray-800 text-white p-6 hidden md:block">
                <h2 className="text-lg font-bold mb-6">Admin Panel</h2>
                <nav className="space-y-2">
                    {navItems.map(item => (
                        <NavLink key={item.to} to={item.to} end
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-kids-purple text-white' : 'text-gray-300 hover:bg-gray-700'}`
                            }>
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <div className="flex-1 p-6 bg-gray-50">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
