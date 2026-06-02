import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';

const App = () => {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <AuthProvider>
                    <CartProvider>
                        <Routes>
                            <Route element={<Layout />}>
                                <Route path="/" element={<Home />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/products/:id" element={<ProductDetail />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/cart" element={
                                    <ProtectedRoute><Cart /></ProtectedRoute>
                                } />
                                <Route path="/checkout" element={
                                    <ProtectedRoute><Checkout /></ProtectedRoute>
                                } />
                                <Route path="/orders" element={
                                    <ProtectedRoute><Orders /></ProtectedRoute>
                                } />
                                <Route path="/orders/:id" element={
                                    <ProtectedRoute><OrderDetail /></ProtectedRoute>
                                } />
                                <Route path="/admin" element={
                                    <AdminRoute><AdminLayout /></AdminRoute>
                                }>
                                    <Route path="dashboard" element={<Dashboard />} />
                                    <Route path="products" element={<AdminProducts />} />
                                    <Route path="categories" element={<AdminCategories />} />
                                    <Route path="orders" element={<AdminOrders />} />
                                </Route>
                            </Route>
                        </Routes>
                    </CartProvider>
                </AuthProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
};

export default App;
