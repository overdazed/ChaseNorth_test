import axios from 'axios';
import { API_URL } from '../config/config';

/**
 * Migrates wishlist items from localStorage to the server when a user logs in
 * @param {string} token - The user's authentication token
 * @returns {Promise<void>}
 */
export const migrateLocalWishlistToServer = async (token) => {
  try {
    // Get wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (!savedWishlist) return;

    const wishlistItems = JSON.parse(savedWishlist);
    if (!Array.isArray(wishlistItems) || wishlistItems.length === 0) return;

    console.log('Migrating wishlist items to server...');
    
    // Add each item to the server wishlist
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    // Process items in batches to avoid overwhelming the server
    const batchSize = 5;
    for (let i = 0; i < wishlistItems.length; i += batchSize) {
      const batch = wishlistItems.slice(i, i + batchSize);
      const promises = batch.map(productId => 
        axios.post(
          `${API_URL}/api/wishlist/${productId}`,
          {},
          config
        ).catch(error => {
          console.error(`Failed to migrate product ${productId}:`, error);
          return null;
        })
      );
      
      await Promise.all(promises);
    }

    // Clear the local wishlist after successful migration
    localStorage.removeItem('wishlist');
    console.log('Wishlist migration completed successfully');
  } catch (error) {
    console.error('Error migrating wishlist:', error);
  }
};

/**
 * Processes pending wishlist items that were added while the user was logged out
 * @param {string} token - The user's authentication token
 * @returns {Promise<void>}
 */
export const processPendingWishlist = async (token) => {
  try {
    const pendingWishlist = JSON.parse(localStorage.getItem('pendingWishlist') || '[]');
    if (!Array.isArray(pendingWishlist) || pendingWishlist.length === 0) return;

    console.log('Processing pending wishlist items...');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    // Process items in batches
    const batchSize = 5;
    for (let i = 0; i < pendingWishlist.length; i += batchSize) {
      const batch = pendingWishlist.slice(i, i + batchSize);
      const promises = batch.map(productId => 
        axios.post(
          `${API_URL}/api/wishlist/${productId}`,
          {},
          config
        ).catch(error => {
          console.error(`Failed to add pending product ${productId}:`, error);
          return null;
        })
      );
      
      await Promise.all(promises);
    }

    // Clear pending wishlist after processing
    localStorage.removeItem('pendingWishlist');
    console.log('Pending wishlist items processed successfully');
  } catch (error) {
    console.error('Error processing pending wishlist:', error);
  }
};
