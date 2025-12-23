import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk to fetch all users
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
    // get request to fetch all users
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
        {
            // add authorization header
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        }
    );
    // return the users
    return response.data;
});

// Add the create user action
export const addUser = createAsyncThunk("admin/addUser", async (userData, { rejectWithValue }) => {
    try {
        // post request to add user
        // pass the user data
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
            userData,
            {
                // Add the authorization headers
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        );
        // return the user
        return response.data;
    } catch (error) {
        // Return the error
        return rejectWithValue(error.response.data);
    }
})

// Update the user info
export const updateUser = createAsyncThunk(
    "admin/updateUser", async ( { id, name, email, role } ) => {
    const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
        { name, email, role },
            {
                // Add the authorization headers
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        );
        // return the user
        return response.data.user;
    }
)

// Delete a user
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id) => {
    await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/${id}`,
{
            // Add the authorization headers
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        }
    );
    return id
})

// Admin Slice
const adminSlice = createSlice({
    name: "admin",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
    builder
        .addCase(fetchUsers.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
        })
        .addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            const updatedUser = action.payload;
            // console.log(action.payload); // payload is undefined
            // find user that needs to be updated
            const userIndex = state.users.findIndex((user) => user._id === updatedUser._id
            );
            // update the user
            if (userIndex !== -1) {
                state.users[userIndex] = updatedUser;
            }
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
            // Check for the user._id is not equal to the action.payload, this way we can delete the user
            state.users = state.users.filter((user) => user._id !== action.payload);
        })
        .addCase(addUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users.push(action.payload.user); // Add a new user to the state
        })
        .addCase(addUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
    }
})

export default adminSlice.reducer;