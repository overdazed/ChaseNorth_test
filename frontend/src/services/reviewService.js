import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Base URL for the API
const API_URL = import.meta.env.VITE_API_URL || 'https://api.chasenorth.com';

// Get auth config with token
const getConfig = () => {
  // First check axios defaults for token (set during login)
  const defaultAuthHeader = axios.defaults.headers.common['Authorization'];
  let token = defaultAuthHeader ? defaultAuthHeader.replace('Bearer ', '') : null;
  
  // If not in defaults, check localStorage
  if (!token) {
    // Check for token in both possible localStorage keys
    token = localStorage.getItem('userToken') || localStorage.getItem('token');
    console.log('Token from localStorage:', token ? 'Found' : 'Not found');
  } else {
    console.log('Using token from axios defaults');
  }
  
  const headers = {
    'Content-Type': 'application/json'
  };

  // Only add Authorization header if token exists
  if (token) {
    // Ensure there are no extra spaces or newlines in the token
    const cleanToken = token.trim();
    headers['Authorization'] = `Bearer ${cleanToken}`;
    console.log('Authorization header set with token');
  } else {
    console.warn('No authentication token found');
  }

  const config = {
    headers,
    withCredentials: true
  };

  console.log('Request config:', config);
  return config;
};

/**
 * Create a new review for a product
 * @param {Object} reviewData - The review data including productId, rating, title, comment, etc.
 * @returns {Promise<Object>} The created review
 */
export const createReview = async (reviewData) => {
  console.log('=== createReview called ===');
  console.log('Full review data received:', JSON.stringify(reviewData, null, 2));
  console.log('Weight in reviewData:', reviewData.weight, 'Type:', typeof reviewData.weight);
  console.log('Height in reviewData:', reviewData.height, 'Type:', typeof reviewData.height);
  console.log('Size in reviewData:', reviewData.size, 'Type:', typeof reviewData.size);
  
  try {
    // Create a new config for file uploads
    const config = getConfig();
    // Remove the Content-Type header to let the browser set it with the correct boundary
    delete config.headers['Content-Type'];
    console.log('Auth config:', config);
    
    // Create FormData for file uploads
    const formData = new FormData();
    
    // Add all review data to FormData
    Object.entries({
      productId: reviewData.productId,
      rating: Math.max(1, Math.min(5, Number(reviewData.rating) || 1)),
      title: reviewData.title,
      comment: reviewData.comment || '',
      qualityRating: Math.max(1, Math.min(5, Number(reviewData.qualityRating) || 5)),
      designRating: Math.max(1, Math.min(5, Number(reviewData.designRating) || 5)),
      fitRating: Math.max(1, Math.min(5, Number(reviewData.fitRating) || 5)),
      width: reviewData.width || 3,
      length: reviewData.length || 3,
      weight: reviewData.weight || null,
      height: reviewData.height || null,
      size: reviewData.size || null,
      verifiedPurchase: reviewData.verifiedPurchase !== false
    }).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    
    // Add images to FormData
    if (reviewData.images && reviewData.images.length > 0) {
      reviewData.images.forEach((image, index) => {
        if (image.file) {
          formData.append(`images`, image.file, image.name || `image-${index}.jpg`);
        } else if (image.url) {
          // Check if it's a base64 string or a regular URL
          if (image.url.startsWith('data:')) {
            // If it's a base64 string, convert it to a blob
            const byteString = atob(image.url.split(',')[1]);
            const mimeString = image.url.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            formData.append(`images`, blob, image.name || `image-${index}.jpg`);
          } else {
            // If it's a Supabase URL, just send the URL as a string
            formData.append(`imageUrls`, image.url);
          }
        }
      });
    }

    // Check if the user has already reviewed this product
    const existingReviews = await getProductReviews(reviewData.productId);
    const existingReview = existingReviews.reviews?.find(
        r => r.user?._id === reviewData.userId
    );

    // Helper function to safely parse numeric values
    const parseNumeric = (value, defaultValue = null) => {
      if (value === '' || value === null || value === undefined) return null;
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    };

    const payload = {
      productId: reviewData.productId,
      rating: Math.max(1, Math.min(5, Number(reviewData.rating) || 1)),
      title: reviewData.title,
      comment: reviewData.comment || '',
      qualityRating: Math.max(1, Math.min(5, Number(reviewData.qualityRating) || 5)),
      designRating: Math.max(1, Math.min(5, Number(reviewData.designRating) || 5)),
      fitRating: Math.max(1, Math.min(5, Number(reviewData.fitRating) || 5)),
      width: reviewData.width || 3,  // Default to 3 (perfect)
      length: reviewData.length || 3, // Default to 3 (perfect)
      weight: parseNumeric(reviewData.weight),
      height: parseNumeric(reviewData.height),
      size: reviewData.size || null,
      images: reviewData.images || [],
      verifiedPurchase: reviewData.verifiedPurchase !== false // Default to true if not explicitly set to false
    };
    
    console.log('Sending payload to server:', JSON.stringify(payload, null, 2));
    
    console.log('=== Payload before sending ===');
    console.log('Weight in payload:', payload.fit?.weight, 'Type:', typeof payload.fit?.weight);
    console.log('Height in payload:', payload.fit?.height, 'Type:', typeof payload.fit?.height);
    console.log('Size in payload:', payload.fit?.size, 'Type:', typeof payload.fit?.size);
    console.log('Full payload:', JSON.stringify(payload, null, 2));

    let response;
    try {
      if (existingReview) {
        // Update existing review
        console.log('=== Updating existing review ===');
        console.log('Review ID:', existingReview._id);
        console.log('Sending update to:', `${API_URL}/api/product-reviews/${existingReview._id}`);
        response = await updateReview(existingReview._id, formData);
      } else {
        // Create new review
        console.log('=== Creating new review ===');
        console.log('Sending POST to:', `${API_URL}/api/product-reviews`);
        console.log('Request headers:', config.headers);
        
        // Log FormData contents for debugging
        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }
        
        response = await axios.post(
          `${API_URL}/api/product-reviews`,
          formData,
          {
            ...config,
            headers: {
              ...config.headers,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        console.log('=== API Response ===');
        console.log('Status:', response.status);
        console.log('Response data:', response.data);
      }
    } catch (error) {
      console.error('Request failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
        stack: error.stack
      });
      throw error;
    }

    console.log('Review saved successfully:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error in createReview:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

/**
 * Get all reviews for a product
 * @param {string} productId - The ID of the product
 * @returns {Promise<Array>} Array of reviews
 */
export const getProductReviews = async (productId, page = 1, limit = 10) => {
  if (!productId) {
    console.error('No productId provided to getProductReviews');
  }

  try {
    const config = getConfig();
    console.log(`[DEBUG] Fetching reviews for product ${productId}, page ${page}, limit ${limit}`);
    
    const response = await axios.get(
      `${API_URL}/api/product-reviews/product/${productId}?page=${page}&limit=${limit}`,
      config
    );

    // Debug: Log the response structure
    console.log('[DEBUG] API Response:', {
      status: response.status,
      dataKeys: Object.keys(response.data),
      hasDataArray: Array.isArray(response.data.data),
      dataArrayLength: Array.isArray(response.data.data) ? response.data.data.length : 'N/A',
      hasReviews: 'reviews' in response.data,
      reviewsLength: response.data.reviews?.length || 0
    });

    // Get reviews from either response.data.reviews or response.data.data
    let reviews = [];
    if (Array.isArray(response.data.reviews)) {
      reviews = response.data.reviews;
    } else if (Array.isArray(response.data.data)) {
      reviews = response.data.data;
    }

    // Debug: Log the first review's fields if available
    if (reviews.length > 0) {
      const firstReview = reviews[0];
      console.log('[DEBUG] First review fields:', {
        id: firstReview._id,
        hasWeight: 'weight' in firstReview,
        hasHeight: 'height' in firstReview,
        height: firstReview.height,
        hasSize: 'size' in firstReview,
        size: firstReview.size,
        allFields: Object.keys(firstReview)
      });
    }

    // Ensure all reviews have proper user data
    reviews = reviews.map(review => ({
      ...review,
      // Ensure user object exists and has required fields
      user: review.user || {},
      // Ensure createdAt is a valid date
      createdAt: review.createdAt || new Date().toISOString(),
      // Ensure numeric fields are numbers
      weight: review.weight != null ? Number(review.weight) : null,
      height: review.height != null ? Number(review.height) : null
    }));
    
    // Ensure all reviews have proper user data
    reviews = reviews.map(review => ({
      ...review,
      // Ensure user object exists and has required fields
      user: review.user || {},
      // Ensure createdAt is a valid date
      createdAt: review.createdAt ? new Date(review.createdAt).toISOString() : new Date().toISOString(),
      // Ensure numeric fields are numbers
      weight: review.weight != null ? Number(review.weight) : null,
      height: review.height != null ? Number(review.height) : null
    }));
    
    const pages = response.data.pages || 1;
    const total = response.data.total || reviews.length;

    console.log('Processed reviews:', reviews);
    
    // Process reviews to ensure all fields are properly included
    const processedReviews = reviews.map(review => {
      // Ensure weight and height are properly parsed as numbers
      const weight = review.weight != null ? Number(review.weight) : null;
      const height = review.height != null ? Number(review.height) : null;
      
      return {
        ...review,
        id: review._id || review.id,
        userId: review.user?._id || review.userId,
        productId: review.product?._id || review.productId || review.product,
        rating: Number(review.rating) || 0,
        qualityRating: Number(review.qualityRating) || 5,
        designRating: Number(review.designRating) || 5,
        fitRating: Number(review.fitRating) || 5,
        width: Number(review.width) || 3,
        length: Number(review.length) || 3,
        weight: weight,
        height: height,
        size: review.size || null,
        images: Array.isArray(review.images) ? review.images : [],
        user: review.user || {},
        createdAt: review.createdAt || new Date().toISOString(),
        updatedAt: review.updatedAt || new Date().toISOString(),
        helpfulVotes: Number(review.helpfulVotes) || 0,
        helpfulVotesBy: Array.isArray(review.helpfulVotesBy) ? review.helpfulVotesBy : []
      };
    });

    console.log('Processed reviews with weights:', processedReviews.map(r => ({
      id: r.id,
      weight: r.weight,
      hasWeight: 'weight' in r
    })));

    return {
      reviews: processedReviews,
      pages,
      total
    };
  } catch (error) {
    console.error('Error fetching product reviews:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: {
        url: error.config?.url,
        method: error.config?.method
      }
    });
    
    // Return empty reviews on error
    return { reviews: [], pages: 1, total: 0 };
  }
};

/**
 * Update a review
 * @param {string} reviewId - The ID of the review to update
 * @param {Object|FormData} reviewData - The updated review data (can be FormData for file uploads)
 * @returns {Promise<Object>} The updated review
 */
export const updateReview = async (reviewId, reviewData) => {
  try {


    const config = getConfig();
    const cleanReviewId = String(reviewId).trim();
    
    // If reviewData is a FormData object, handle file uploads
    if (reviewData instanceof FormData) {
      // Don't set Content-Type, let the browser set it with the correct boundary
      delete config.headers['Content-Type'];
      
      // Add images to keep to the FormData
      if (reviewData.imagesToKeep && Array.isArray(reviewData.imagesToKeep)) {
        console.log('Adding images to keep:', reviewData.imagesToKeep);
        reviewData.imagesToKeep.forEach((path, index) => {
          if (path) { // Only add non-empty paths
            reviewData.append('imagesToKeep', path);
          }
        });
      } else {
        console.log('No images to keep or invalid imagesToKeep format:', reviewData.imagesToKeep);
      }
      
      // Add new images to FormData
      if (reviewData.images && reviewData.images.length > 0) {
        console.log('Adding new images to upload:', reviewData.images.length);
        reviewData.images.forEach((image, index) => {
          if (image.file) {
            reviewData.append('images', image.file, image.name || `image-${index}.jpg`);
          }
        });
      } else {
        console.log('No new images to upload');
      }
      
      console.log('Sending update request with FormData');
      const response = await axios.put(
        `${API_URL}/api/product-reviews/${cleanReviewId}`, 
        reviewData,
        {
          ...config,
          headers: {
            ...config.headers,
            'Content-Type': 'multipart/form-data'
          },
          // Add timeout and other options if needed
          timeout: 60000 // 60 seconds timeout
        }
      );
      console.log('Update response:', response.data);
      
      return response.data;
    } else {
      // For regular JSON data (no file uploads)
      const payload = {
        rating: Math.max(1, Math.min(5, Number(reviewData.rating) || 1)),
        title: reviewData.title,
        comment: reviewData.comment || '',
        qualityRating: Math.max(1, Math.min(5, Number(reviewData.qualityRating) || 5)),
        designRating: Math.max(1, Math.min(5, Number(reviewData.designRating) || 5)),
        fitRating: Math.max(1, Math.min(5, Number(reviewData.fitRating) || 5)),
        width: reviewData.width || 3,
        length: reviewData.length || 3,
        weight: reviewData.weight ? parseFloat(reviewData.weight) : null,
        height: reviewData.height ? parseFloat(reviewData.height) : null,
        size: reviewData.size || null,
        imagesToKeep: reviewData.imagesToKeep || []
      };
      
      const response = await axios.put(
        `${API_URL}/api/product-reviews/${cleanReviewId}`,
        payload,
        config
      );


      
      return response.data;
    }
  } catch (error) {
    console.error('Error updating review:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    
    // Provide a more specific error message based on the status code
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to update a review');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to update this review');
    } else if (error.response?.status === 404) {
      throw new Error('Review not found');
    } else {
      throw error;
    }
  }

};

/**
 * Delete a review
 * @param {string} reviewId - The ID of the review to delete
 * @returns {Promise<Object>} Success message
 */

/**
 * Mark a review as helpful
 * @param {string} reviewId - The ID of the review to mark as helpful
 * @returns {Promise<Object>} The updated review with new helpful count
 */
export const markHelpful = async (reviewId) => {
  try {
    const config = {
      ...getConfig(),
      method: 'PUT',
      withCredentials: true
    };
    
    // Ensure the reviewId is a string and trim any whitespace
    const cleanReviewId = String(reviewId).trim();
    
    const response = await axios.put(
      `${API_URL}/api/product-reviews/${cleanReviewId}/helpful`,
      {},
      config
    );
    
    console.log('Marked review as helpful:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Error marking review as helpful:', {
      message: error.message,
      response: error.response?.data || 'No response data',
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: {
          ...error.config?.headers,
          Authorization: error.config?.headers?.Authorization 
            ? 'Bearer [REDACTED]' 
            : 'None'
        }
      }
    });
    
    // Provide a more specific error message based on the status code
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to mark a review as helpful');
    } else if (error.response?.status === 404) {
      throw new Error('Review not found');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to mark review as helpful');
    }
  }
};

/**
 * Delete a review
 * @param {string} reviewId - The ID of the review to delete
 * @returns {Promise<Object>} Success message
 */
export const deleteReview = async (reviewId) => {
  console.log('deleteReview called with ID:', reviewId);
  try {
    const config = getConfig();
    
    // Ensure the reviewId is a string and trim any whitespace
    const cleanReviewId = String(reviewId).trim();
    console.log('Cleaned review ID:', cleanReviewId);
    
    // Log the full URL and config for debugging
    const url = `${API_URL}/api/product-reviews/${cleanReviewId}`;
    console.log('Making DELETE request to:', url);
    console.log('Request config:', {
      ...config,
      headers: {
        ...config.headers,
        // Don't log the full Authorization header for security
        Authorization: config.headers.Authorization ? 'Bearer [REDACTED]' : 'None'
      }
    });
    
    // Make the DELETE request
    const response = await axios.delete(url, config);
    
    console.log('Delete review response:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Error deleting review:', {
      message: error.message,
      response: error.response?.data || 'No response data',
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: {
          ...error.config?.headers,
          // Don't log the full Authorization header for security
          Authorization: error.config?.headers?.Authorization 
            ? 'Bearer [REDACTED]' 
            : 'None'
        }
      }
    });
    
    // Provide a more specific error message based on the status code
    let errorMessage = 'Failed to delete review';
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'You are not authorized to delete this review';
      } else if (error.response.status === 404) {
        errorMessage = 'Review not found';
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.status === 500) {
        errorMessage = 'Server error occurred while deleting the review. Please try again later.';
      }
    }
    
    // Log the full error for debugging
    console.error('Full error object:', error);
    
    // Throw a more detailed error
    const detailedError = new Error(errorMessage);
    detailedError.status = error.response?.status;
    detailedError.response = error.response?.data;
    throw detailedError;
  }
};

/**
 * Upload a review image to Supabase Storage
 * @param {string} filePath - The path where the file should be stored in the bucket
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} The upload result with data and error properties
 */
export const uploadReviewImage = async (filePath, file) => {
  try {
    console.log('Uploading file to Supabase:', { filePath, fileName: file.name, fileSize: file.size });
    
    const { data, error } = await supabase.storage
      .from('reviews')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    console.log('File uploaded successfully:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Error in uploadReviewImage:', error);
    return { data: null, error };
  }
};

/**
 * Get public URL for a file in Supabase Storage
 * @param {string} bucket - The storage bucket name
 * @param {string} filePath - The path to the file in the bucket
 * @returns {Object} Object containing the public URL
 */
export const getPublicUrl = (bucket, filePath) => {
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return { data, error: null };
  } catch (error) {
    console.error('Error getting public URL:', error);
    return { data: null, error };
  }
};

/**
 * Delete a file from Supabase Storage
 * @param {string} filePath - The path to the file in the bucket
 * @returns {Promise<Object>} The delete result with data and error properties
 */
export const deleteReviewImage = async (filePath) => {
  try {
    console.log('Deleting file from Supabase:', filePath);
    
    const { data, error } = await supabase.storage
      .from('reviews')
      .remove([filePath]);

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }

    console.log('File deleted successfully:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Error in deleteReviewImage:', error);
    return { data: null, error };
  }
};
