import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Declare a thunk to handle the creation of a checkout session
export const createCheckout = createAsyncThunk(
    "checkout/createCheckout",
    async (checkoutdata, { rejectWithValue }) => {
        try {
            // make a post request to the backend
            // checkoutdata is the data that will be sent to the backend (shipping, cart info)
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
                checkoutdata, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    }
                }
            );
            // Return the checkout session data
            return response.data;
        } catch (error) {
            // Return the error
            return rejectWithValue(error.response.data);
        }
    }
);

// Set up the slice to manage the checkout state
const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        checkout: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.checkout = action.payload;
            })
            .addCase(createCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

// Export the reducer so we can include it in the store
export default checkoutSlice.reducer;

// import checkoutReducer from "./slices/checkoutSlice"; in store.js