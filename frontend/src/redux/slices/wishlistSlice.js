import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch user's wishlist
const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return [];
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data.data.wishlist;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

// Async thunk to add item to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        // If user is not logged in, return the productId to handle in the reducer
        return { productId, guest: true };
      }
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.data.wishlist;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

// Async thunk to remove item from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        // If user is not logged in, return the productId to handle in the reducer
        return { productId, guest: true };
      }
      
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

// Sync wishlist for guest users
const syncGuestWishlist = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('guestWishlist');
    return saved ? JSON.parse(saved) : [];
  }
  return [];
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    guestItems: syncGuestWishlist(),
    loading: false,
    error: null
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.guestItems = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('guestWishlist');
      }
    },
    syncGuestWishlist: (state) => {
      state.guestItems = syncGuestWishlist();
    }
  },
  extraReducers: (builder) => {
    // Fetch wishlist
    builder.addCase(fetchWishlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload || [];
    });
    builder.addCase(fetchWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Add to wishlist
    builder.addCase(addToWishlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.guest) {
        // Handle guest wishlist
        const guestItems = [...state.guestItems, action.payload.productId];
        state.guestItems = guestItems;
        if (typeof window !== 'undefined') {
          localStorage.setItem('guestWishlist', JSON.stringify(guestItems));
        }
      } else {
        // Handle logged-in user wishlist
        state.items = action.payload;
      }
    });
    builder.addCase(addToWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Remove from wishlist
    builder.addCase(removeFromWishlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.guest) {
        // Handle guest wishlist
        const guestItems = state.guestItems.filter(id => id !== action.payload.productId);
        state.guestItems = guestItems;
        if (typeof window !== 'undefined') {
          localStorage.setItem('guestWishlist', JSON.stringify(guestItems));
        }
      } else {
        // Handle logged-in user wishlist
        state.items = state.items.filter(item => item._id !== action.payload);
      }
    });
    builder.addCase(removeFromWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

export const { clearWishlist, syncGuestWishlist: syncGuestWishlistAction } = wishlistSlice.actions;
export { fetchWishlist };
export default wishlistSlice.reducer;
