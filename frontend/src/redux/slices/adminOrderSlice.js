import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Async Thunk to fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk(
    'adminOrders/fetchAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            // get request to fetch all orders
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`, {
                    // add authorization header
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
    }
)

// Update the order delivery status
export const updateOrderStatus = createAsyncThunk(
    'adminOrders/updateOrderStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            // get request to fetch all orders
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
                { status },
                {
                    // add authorization header
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
    }
)


// Delete an order
export const deleteOrder = createAsyncThunk(
    'adminOrders/deleteOrder',
    async (id, { rejectWithValue }) => {
        try {
            // get request to fetch all orders
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
                {
                    // add authorization header
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            );
            // return the orders
            return id;
        } catch (error) {
            // Return the error
            return rejectWithValue(error.response.data);
        }
    }
)

// create the admin order slice
const adminOrderSlice = createSlice({
    name: 'adminOrders',
    initialState: {
        orders: [],
        totalOrders: 0,
        totalSales: 0,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all orders
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.totalOrders = action.payload.length;

                // Calculate total sales
                const totalSales = action.payload.reduce((acc, order) => {
                    return acc + order.totalPrice;
                    // accumulator initial value will be 0
                }, 0)
                state.totalSales = totalSales;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            // Update order status
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const updatedOrder = action.payload;
                // console.log(action.payload);
                // find the order that needs to be updated
                const orderIndex = state.orders.findIndex(
                    (order) => order._id === updatedOrder._id
                );
                // update the order
                if (orderIndex !== -1) {
                    state.orders[orderIndex] = updatedOrder;
                }
            })
            // Delete an order
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.orders = state.orders.filter(
                    (order) => order._id !== action.payload
                );
            });
    }
})

export default adminOrderSlice.reducer

// import adminOrderReducer from "./slices/adminOrderSlice"; in store.js