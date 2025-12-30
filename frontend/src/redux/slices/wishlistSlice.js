import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch user's wishlist
const API_URL = 'http://localhost:5000';

export const fetchUserWishlist = createAsyncThunk(
  'wishlist/fetchUserWishlist',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/wishlist/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }
      const data = await response.json();
      return data.wishlist || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleWishlistItem = createAsyncThunk(
  'wishlist/toggleItem',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/wishlist/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId, productId })
      });

      if (!response.ok) {
        throw new Error('Failed to update wishlist');
      }

      const data = await response.json();
      return data.wishlist || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUserWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  }
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsInWishlist = (productId) => (state) => 
  state.wishlist.items.some(item => item._id === productId);
