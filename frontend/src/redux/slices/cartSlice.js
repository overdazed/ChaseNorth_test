import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Function to load the cart from local storage
const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem("cart");
    // if storedCart is present, parse the value of storedCart, else return the format of products and an empty array
    return storedCart ? JSON.parse(storedCart) : {products: []};
};

// Function to save the cart to local storage
const saveCartToStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

// Add a thunk to fetch the cart
export const fetchCart = createAsyncThunk("cart/fetchCart", async ({userId, guestId}, {rejectWithValue}) => {
    try {
        // get request to get the cart
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            {
                params: {
                    userId,
                    guestId
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        );
        
        // Return the cart data with the expected format
        return {
            products: response.data.products || [],
            totalPrice: response.data.totalPrice || 0,
            totalItems: response.data.totalItems || 0,
            guestId: response.data.guestId || guestId
        };
    } catch (error) {
        console.error('Error fetching cart:', error);
        const errorMessage = error.response?.data?.message || 'Failed to fetch cart';
        return rejectWithValue({
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data
        });
    }
});

// Add an item to the cart for a user
export const addToCart = createAsyncThunk("cart/addToCart", async ({productId, quantity, size, color, guestId, userId}, {rejectWithValue}) => {
    try {
        // post request to add the item to the cart
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            {
                productId,
                quantity,
                size,
                color,
                guestId,
                userId
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        // return the updated cart data
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
        return rejectWithValue({
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data
        });
    }
});

// Update the quantity of a product in the cart
export const updateCartItemQuantity = createAsyncThunk(
    "cart/updateCartItemQuantity", async ({productId, quantity, guestId, userId, size, color},
                                          {rejectWithValue}) => {
    try {
        // put request to update the quantity of the product in the cart
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            {
                productId,
                quantity,
                guestId,
                userId,
                size,
                color,
            }
        );
        // return the updated cart data
        return response.data;
    } catch (error) {
        // return the error
        return rejectWithValue(error.response.data);
    }
})

// Remove a product from the cart
export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart", 
    async ({productId, guestId, userId, size, color}, {rejectWithValue}) => {
        try {
            // delete method to remove the product from the cart
            const response = await axios({
                method: "DELETE",
                url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    productId,
                    guestId,
                    userId,
                    size,
                    color
                }
            });
            // return the updated cart data
            return response.data;
        } catch (error) {
            // return the error with a proper error message
            const errorMessage = error.response?.data?.message || 'Failed to remove item from cart';
            return rejectWithValue({
                message: errorMessage,
                status: error.response?.status,
                data: error.response?.data
            });
        }
    }
);

// Merge the guest cart with the user cart
export const mergeCart = createAsyncThunk("cart/mergeCart", async ({guestId, user}, {rejectWithValue}) => {
    try {
        // post request to merge carts
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
            {
                guestId,
                user
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        );
        // return the merge cart data
        return response.data;
    } catch (error) {
        // return the error with a proper error message
        const errorMessage = error.response?.data?.message || 'Failed to merge carts';
        return rejectWithValue({
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data
        });
    }
});

// Create the cart slice to manage the cart related stuff
const cartSlice = createSlice({
    name: "cart",
    initialState: {
        // this will load the cart from local storage initially
        cart: loadCartFromStorage(),
        loading: false,
        error: null
    },
    reducers: {
        // Clear the cart completely both in state and local storage
        clearCart: (state) => {
            state.cart = {products: []};
            localStorage.removeItem("cart");
        },
    },
    // handle all async thunk actions
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                // save the fetched cart to local storage
                saveCartToStorage(action.payload);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch cart";
            })
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                // save the fetched cart to local storage
                saveCartToStorage(action.payload);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to add to cart";
            })
            .addCase(updateCartItemQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                // save the fetched cart to local storage
                saveCartToStorage(action.payload);
            })
            .addCase(updateCartItemQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || "Failed to update item quantity";
            })
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                // save the fetched cart to local storage
                saveCartToStorage(action.payload);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to remove item";
            })
            .addCase(mergeCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mergeCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                // save the fetched cart to local storage
                saveCartToStorage(action.payload);
            })
            .addCase(mergeCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to merge cart.";
            })
    }
});

// Export the actions to clear the cart
export const {clearCart} = cartSlice.actions;
// Export the cart reducer to be added to the redux store
export default cartSlice.reducer;

// import cartReducer from "./slices/cartSlice"; in store.js