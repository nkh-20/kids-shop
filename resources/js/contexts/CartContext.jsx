import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { getCart as apiGetCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeCartItem as apiRemoveCartItem, clearCart as apiClearCart } from '../api/cart';

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        try {
            const res = await apiGetCart();
            setCart(res.data.data);
        } catch {
            setCart(null);
        }
    }, []);

    const addItem = useCallback(async (productId, quantity = 1) => {
        setLoading(true);
        try {
            const res = await apiAddToCart({ product_id: productId, quantity });
            setCart(res.data.data);
            return res.data;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateItem = useCallback(async (itemId, quantity) => {
        setLoading(true);
        try {
            const res = await apiUpdateCartItem(itemId, { quantity });
            setCart(res.data.data);
            return res.data;
        } finally {
            setLoading(false);
        }
    }, []);

    const removeItem = useCallback(async (itemId) => {
        setLoading(true);
        try {
            const res = await apiRemoveCartItem(itemId);
            setCart(res.data.data);
            return res.data;
        } finally {
            setLoading(false);
        }
    }, []);

    const clear = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiClearCart();
            setCart(res.data.data);
            return res.data;
        } finally {
            setLoading(false);
        }
    }, []);

    const value = useMemo(() => ({
        cart,
        loading,
        itemCount: cart?.items?.length || 0,
        fetchCart, addItem, updateItem, removeItem, clear,
    }), [cart, loading, fetchCart, addItem, updateItem, removeItem, clear]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
