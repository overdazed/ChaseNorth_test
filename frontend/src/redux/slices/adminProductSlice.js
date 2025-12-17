import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// there are many requests of this reducer so add a constant
const API_URL = `${import.meta.env.VITE_BACKEND_URL}`
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`

// Async Thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk(
    "adminProducts/fetchProducts",
    async () => {
        // get request to fetch admin products
        const response = await axios.get(`${API_URL}/api/admin/products`, {
            // add authorization header
            headers: {
                Authorization: USER_TOKEN,
            }
        });
        // return the products
        return response.data;
    }
)

// Async Function to create a new product
export const createProduct = createAsyncThunk(
    "adminProducts/createProduct",
    async (productData) => {
        // post request to create a new product
        const response = await axios.post(
            `${API_URL}/api/admin/products`,
            productData,
            {
                // add authorization header
                headers: {
                    Authorization: USER_TOKEN,
                }
            }
        );
        // return the product
        return response.data;
    }
)

// Async Function to update a existing product
export const updateProduct = createAsyncThunk(
    "adminProducts/updateProduct",
    async ({ id, productData }) => {
        // put request to update a product
        const response = await axios.put(
            `${API_URL}/api/admin/products/${id}`,
            productData,
            {
                // add authorization header
                headers: {
                    Authorization: USER_TOKEN,
                }
            }
        );
        // return the product
        return response.data;
    }
)

// Async Thunk to delete a product
export const deleteProduct = createAsyncThunk(
    "adminProducts/deleteProduct",
    async (id) => {
        // delete request to delete a product
        await axios.delete(`${API_URL}/api/products/${id}`, {
                // add authorization header
                headers: { Authorization: USER_TOKEN }
        });
        // return the id
        return id;
    }
)

// create a slice
const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Create Product
            .addCase(createProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
            })
            // Update Product
            .addCase(updateProduct.fulfilled, (state, action) => {
                // Find the product that needs to be updated
                const index = state.products.findIndex(
                    (product) => product._id === action.payload._id
                );
                // Update the product
                if (index !== -1) {
                    // get the product index and assign the updated product
                    state.products[index] = action.payload;
                }
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(
                    (product) => product._id !== action.payload
                );
            });
    },
})

// export the reducer
export default adminProductSlice.reducer

// import adminProductReducer from "./slices/adminProductSlice"; in store.js