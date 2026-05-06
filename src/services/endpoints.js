import { http } from './http';

export const authApi = {
  login: (payload) => http.post('/login/login', payload),
};

export const productApi = {
  list: () => http.get('/products'),
  create: (formData) => http.post('/products', formData),
  detail: (id) => http.get(`/products/${id}`),
  update: (id, formData) => http.put(`/products/${id}`, formData),
  remove: (productId) => http.delete(`/products/${productId}`),
};

export const categoryApi = {
  list: () => http.get('/categories'),
  create: (payload) => http.post('/categories', payload),
  update: (id, payload) => http.put(`/categories/${id}`, payload),
  remove: (id) => http.delete(`/categories/${id}`),
};

export const orderApi = {
  list: () => http.get('/orders'),
  create: (payload) => http.post('/orders', payload),
};

export const employeeApi = {
  list: () => http.get('/employees'),
  create: (formData) => http.post('/employees', formData),
  update: (id, formData) => http.put(`/employees/${id}`, formData),
  remove: (id) => http.delete(`/employees/${id}`),
};

export const supplierApi = {
  list: () => http.get('/suppliers'),
  create: (payload) => http.post('/suppliers', payload),
  update: (id, payload) => http.put(`/suppliers/${id}`, payload),
  remove: (id) => http.delete(`/suppliers/${id}`),
};
