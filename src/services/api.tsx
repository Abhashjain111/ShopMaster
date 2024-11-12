import axios from 'axios';
import { Product } from '../stores/productSlice';

export const API_URL = 'http://localhost:5000/products';

export const getProducts = () => axios.get<Product[]>(`${API_URL}`);
export const getProduct = (id: number) => axios.get<Product>(`${API_URL}/${id}`);
export const createProduct = (product: Product) => axios.post<Product>(`${API_URL}`, product);
export const updateProduct = (id: any, product: Product) => axios.put<Product>(`${API_URL}/${id}`, product);
export const removeProduct = (id: number) => axios.delete<Product>(`${API_URL}/${id}`);
