import api from './axios';

export const getCart = () => api.get('/cart');
export const addToCart = (data) => api.post('/cart/add', data);
export const updateCartItem = (id, data) => api.put(`/cart/${id}`, data);
export const removeCartItem = (id) => api.delete(`/cart/remove/${id}`);
export const clearCart = () => api.delete('/cart/clear');
