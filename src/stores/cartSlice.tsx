import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from './productSlice';
import { getCartProducts, removeCartProduct, createCartProduct, updateCartProduct } from '../services/apiCart';
import { RootState } from '../stores/store'; // Make sure to import RootState
import { useDispatch } from 'react-redux';


export const fetchCartProducts = createAsyncThunk(
  'Cart/fetchProducts',
  async (_, thunkAPI) => {
    try {
      const response = await getCartProducts();
      const products = response.data.map((product: any) => ({
        ...product,
        price: parseInt(product.price, 10), // Ensure price is an integer
      }));
      return products;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const removeCartProductAsync = createAsyncThunk(
  'Cart/removeProduct',
  async (id: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const product = state.cart.cartItems.find((item) => item.id === id);

      if (product) {
        if (product.quantity > 1) {
          // If quantity is greater than 1, decrease quantity by 1
          const updatedProduct = { ...product, quantity: product.quantity - 1 };
          
          // Call updateCartProduct to update the quantity in the backend
          await updateCartProduct(updatedProduct.id, updatedProduct);

          return updatedProduct; // Return the updated product
        } else {
          // If quantity is 1, remove the product
          await removeCartProduct(id); // Remove the product from the cart in the backend
          return id; // Return the product ID to remove it from the Redux state
        }
      }

      return thunkAPI.rejectWithValue('Product not found in the cart');
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message); // Handle error
    }
  }
);

export const addProductToCart = createAsyncThunk(
  'cart/addProductToCart',
  async (product: Product, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const existingProduct = state.cart.cartItems.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        // If product exists, only update quantity
        const updatedProduct = {
          ...existingProduct,
          quantity: existingProduct.quantity + 1, // Increase quantity
        };

        // Call updateCartProduct function to update the product on the backend or in the cart
        await updateCartProduct(updatedProduct.id, updatedProduct); // Assuming updateCartProduct takes ID and product data
        return updatedProduct;
      } else {
        // If product does not exist, create a new product with quantity 1
        const newProduct = { ...product, quantity: 1 };
        await createCartProduct(newProduct); // Add the new product to the cart
        return newProduct;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message); // Handle error gracefully
    }
  }
);


export interface CartState {
  cartItems: Product[]; // List of products in the cart
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cartItems: [], // Initially empty cart
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = []; // Clear all items in the cart
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartProducts.pending, (state) => {
        state.loading = true; // Set loading to true when fetching cart products
      })
      .addCase(fetchCartProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload; // Set cart items to the fetched products
      })
      .addCase(fetchCartProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Store error message if fetch fails
      })
      .addCase(removeCartProductAsync.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter(
          (item) => item.id !== action.payload // Filter out the deleted product by ID
        );
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        const updatedProduct = action.payload;

        // Check if the updated product exists in the cart
        const productIndex = state.cartItems.findIndex(
          (item) => item.id === updatedProduct.id
        );

        if (productIndex !== -1) {
          // If the product exists, update the quantity
          state.cartItems[productIndex] = updatedProduct;
        } else {
          // If the product does not exist, add the new product
          state.cartItems.push(updatedProduct);
        }
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
