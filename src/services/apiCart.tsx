import axios from "axios";
import { Product } from "../stores/productSlice";

export const Cart_URL = 'http://localhost:5001/cart';

// API calls for Cart operations

// Fetch all products in the cart
export const getCartProducts = () => axios.get<Product[]>(`${Cart_URL}`);

// Fetch a single product in the cart by ID
export const getCartProduct = (id: number) => axios.get<Product>(`${Cart_URL}/${id}`);

// Create a new product in the cart
export const createCartProduct = (product: Product) => axios.post<Product>(`${Cart_URL}`, product);

// Update an existing product in the cart by ID
export const updateCartProduct = (id: string, product: Product) => axios.put<Product>(`${Cart_URL}/${id}`, product);

// Remove a product from the cart by ID
export const removeCartProduct = (id: string) => axios.delete(`${Cart_URL}/${id}`);
