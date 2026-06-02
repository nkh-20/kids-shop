import api from './axios';

export const updateProfile = (data) => api.put('/profile', data);
export const changePassword = (data) => api.put('/profile/password', data);
