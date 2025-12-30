import axios from 'axios';
import { API_URL } from '../config/config';

// Get user's wishlist
export const getWishlist = async (token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(`${API_URL}/api/wishlist`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

// Add product to wishlist
export const addToWishlist = async (productId, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(
      `${API_URL}/api/wishlist/${productId}`,
      {},
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (productId, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.delete(
      `${API_URL}/api/wishlist/${productId}`,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

// Check if product is in wishlist
export const checkWishlist = async (productId, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(
      `${API_URL}/api/wishlist/check/${productId}`,
      config
    );
    return response.data.isInWishlist;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};
