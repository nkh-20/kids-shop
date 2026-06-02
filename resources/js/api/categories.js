import api from './axios';

export const getCategories = (params) => api.get('/categories', { params });
export const getCategory = (id) => api.get(`/categories/${id}`);
export const createCategory = (data) => api.post('/admin/categories', data);
export const updateCategory = (id, data) => api.put(`/admin/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`);
