import { api } from './api';

export const getAllProducts = async () => {
  return await api.get('/products');
};

export const getTrendingProducts = async () => {
  return await api.get('/products/trending');
};

export const getBestSellers = async () => {
  return await api.get('/products/bestsellers');
};

export const getProductById = async (id) => {
  return await api.get(`/products/${id}`);
};