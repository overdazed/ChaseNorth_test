// createSlice to write reducers and actions
// createAsyncThunk for asynchronous API calls
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

// Retrieve the user info and token from local storage
const userFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')) : null;

// guest ID
// Check for an existing guest ID in localStorage or generate a new one
const initialGuestId =
    localStorage.getItem('guestId') || `guest_${new Date().getTime()}`;
    // safe this guest ID to local storage for future use
    localStorage.setItem('guestId', initialGuestId);

// Set up initial state for authentication slice
const initialState = {
    user: userFromStorage,
    guestId: initialGuestId,
    // by default we are not loading anything
    loading: false,
    error: null,
};

// Declare the async thunk that will handle the login process
// auth/loginUser is action type
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) => {
        try {
            // Call the login API endpoint with the provided user data
            // declare the backend url constant in the .env file of the frontend folder
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
                userData
            );
            // If the login works, set the user info in the local storage
            localStorage.setItem('userInfo', JSON.stringify(response.data.user));
            // save the user token for authentication purpose
            localStorage.setItem('userToken', response.data.token);

            // Return the user object from the response be used in our app
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


// Async Thunk for user registration
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            // Call the login API endpoint with the provided user data
            // declare the backend url constant in the .env file of the frontend folder
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
                userData
            );
            // If the login works, set the user info in the local storage
            localStorage.setItem('userInfo', JSON.stringify(response.data.user));
            // save the user token for authentication purpose
            localStorage.setItem('userToken', response.data.token);

            // Return the user object from the response be used in our app
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Create the authentication slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.guestId = `guest_${new Date().getTime()}`; // Reset guest ID on logout
            // Clean up local storage
            localStorage.removeItem('userInfo');
            localStorage.removeItem('userToken');
            // save new guest ID back into local storage
            localStorage.setItem('guestId', state.guestId); // Set new guest ID in localStorage
        },
        // Add an action that generates a new guest ID anytime
        generateNewGuestId: (state) => {
            // create a new guest ID and upgrade both state and local storage
            state.guestId = `guest_${new Date().getTime()}`;
            // save new guest ID back into local storage
            localStorage.setItem('guestId', state.guestId); // Set new guest ID in localStorage
        },
    },
    // handle the external users for our async thunks
    extraReducers: (builder) => {
        builder
            // When a login is pending, show the loading indicator
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            // If it fails, we'll stop the loading and set the error state
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            // If it fails, we'll stop the loading and set the error state
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
    }
})

// Export the actions, so we can use them in our components
export const { logout, generateNewGuestId } = authSlice.actions;

// Export the reducer, so it can be added to the store
export default authSlice.reducer;

// open App.jsx > add
// import { Provider } from "react-redux";
// import store from "./redux/store";