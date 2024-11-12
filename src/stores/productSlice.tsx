import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts, createProduct, removeProduct, updateProduct } from '../services/api';
import axios from 'axios';


export interface Product {
  id: any;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number; // Add quantity field
}


  // Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',  // Unique name for the action
  async (_, thunkAPI) => {
    try {
      const response = await getProducts();  // Call API
      return response.data;  // Return data from the API
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);  // Handle error
    }
  }
);

// Async thunk for creating a new product
export const createNewProduct = createAsyncThunk(
  'products/createProduct',
  async (product: Product, thunkAPI) => {
    try {
      const response = await createProduct(product);  // Call API
      return response.data;  // Return created product
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);  // Handle error
    }
  }
);

// Async thunk for deleting a product by ID
export const deleteProductById = createAsyncThunk(
  'products/deleteProduct',
  async (id: number, thunkAPI) => {
    try {
     const response:any=await axios.delete<Product>(`${ 'http://localhost:5000/products'}/${id}`) // Call API
      return response;  // Return ID of deleted product to update state
    } catch (error: any) {
      console.log("error in asyncthunk")
      return thunkAPI.rejectWithValue(error.message);  // Handle error
    }
  }
);

export const updateProductById = createAsyncThunk<Product, { id: string | number; product: Product }>(
  'products/updateProduct',
  async ({ id, product }, thunkAPI) => {
    try {
      const response = await updateProduct(id, product);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


  
const initialState: { 
  products: Product[];
  loading: boolean;
  error: string | null;
} = {
  products: [],  // Start with an empty products array
  loading: false,  // No loading at the start
  error: null,  // No error at the start
};

const productSlice = createSlice({
  name: 'products',  // Unique name for the slice
  initialState,  // Set the initial state
  reducers: {
    // Reducer to add a product
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);  // Add product to array
    },
    // Reducer to delete a product
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter(product => product.id !== action.payload);  // Remove product by ID
    },
  },
  extraReducers: (builder) => {
    // Handle fetchProducts async thunk
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;  // Set loading to true while fetching
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;  // Set loading to false when fetch is done
        state.products = action.payload;  // Update products with fetched data
        state.error = null;  // Reset error if fetch is successful
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;  // Set loading to false if fetch fails
        state.error = action.payload as string;  // Store the error message
      });
      
    // Handle createNewProduct async thunk
    builder
      .addCase(createNewProduct.pending, (state) => {
        state.loading = true;  // Set loading to true while creating a product
      })
      .addCase(createNewProduct.fulfilled, (state, action) => {
        state.loading = false;  // Set loading to false when product creation is successful
        state.products.push(action.payload);  // Add the new product to the array
        state.error = null;  // Reset error if successful
      })
      .addCase(createNewProduct.rejected, (state, action) => {
        state.loading = false;  // Set loading to false if creation fails
        state.error = action.payload as string;  // Store the error message
      });

    // Handle deleteProductById async thunk
    builder
      .addCase(deleteProductById.pending, (state) => {
        state.loading = true;  // Set loading to true while deleting
      })
      .addCase(deleteProductById.fulfilled, (state, action) => {
        state.loading = false;  // Set loading to false when delete is done
        state.products = state.products.filter(product => product.id !== action.payload);  // Remove product by ID
        state.error = null;  // Reset error if successful
      })
      .addCase(deleteProductById.rejected, (state, action) => {
        state.loading = false;  // Set loading to false if deletion fails
        state.error = action.payload as string;  // Store the error message
      });

    // Handle updateProductById async thunk
    builder
      .addCase(updateProductById.pending, (state) => {
        state.loading = true;  // Set loading to true while updating
      })
      
   .addCase(updateProductById.fulfilled, (state, action) => {
    state.loading = false;  // Set loading to false when update is done
    const updatedProduct = action.payload;
    const index = state.products.findIndex(product => product.id === updatedProduct.id);
    if (index !== -1) {
      state.products[index] = updatedProduct;  // Replace with the updated product
    }
    state.error = null;  // Reset error if successful
    })
      .addCase(updateProductById.rejected, (state, action) => {
        state.loading = false;  // Set loading to false if update fails
        state.error = action.payload as string;  // Store the error message
      });
  },
});

// Export actions so they can be used with dispatch
export const { addProduct, deleteProduct } = productSlice.actions;

// Export the reducer to be used in the store
export default productSlice.reducer;

  