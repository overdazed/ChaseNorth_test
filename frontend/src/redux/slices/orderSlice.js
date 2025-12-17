import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk to fetch user orders
// async(_) => since there is no first parameter for this request, so we can add an _ here
export const fetchUserOrders = createAsyncThunk('orders/fetchUserOrders', async (_, { rejectWithValue }) => {
    try {
        // get request to fetch user orders
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
        {
            // include user token in the headers to authenticate the request
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        }
        );
        // return the orders
        return response.data;
    } catch (error) {
        // Return the error
        return rejectWithValue(error.response.data);
    }
});

// Async Thunk to fetch orders details by id
export const fetchOrderDetails  = createAsyncThunk('orders/fetchOrderDetails', async (orderId, { rejectWithValue }) => {
    try {
        // get request to get the order details
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
            {
                // use the user token for authentication
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        );
        // return the orders
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

// Slice to manage all the state related orders
const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        totalOrders: 0,
        orderDetails: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch user orders
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            // Fetch order details
            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    }
});

// Export the slice reducer to include it in the store.js
export default orderSlice.reducer;