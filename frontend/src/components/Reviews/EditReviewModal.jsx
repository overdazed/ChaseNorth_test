import React, {useState, useEffect, useRef} from 'react';
import * as reviewService from '../../services/reviewService';
import { toast } from 'react-toastify';
import { getWidthNumericValue } from '../../utils/reviewUtils';
import { supabase } from '../../services/superbaseClient';

const EditReviewModal = ({ isOpen, onClose, review, productName, onReviewUpdated, onReviewAction }) => {
  // Map between numeric values and their string representations
  const widthOptions = [
    { value: 1, label: 'too tight', id: 'too-tight' },
    { value: 2, label: 'slightly tight', id: 'slightly-tight' },
    { value: 3, label: 'perfect', id: 'perfect' },
    { value: 4, label: 'slightly wide', id: 'slightly-wide' },
    { value: 5, label: 'too wide', id: 'too-wide' }
  ];

  const lengthOptions = [
    { value: 1, label: 'too short', id: 'too-short' },
    { value: 2, label: 'slightly short', id: 'slightly-short' },
    { value: 3, label: 'perfect', id: 'perfect' },
    { value: 4, label: 'slightly long', id: 'slightly-long' },
    { value: 5, label: 'too long', id: 'too-long' }
  ];

  const [formData, setFormData] = useState({
    title: '',
    comment: '',
    rating: 0,
    qualityRating: 5,
    designRating: 5,
    fitRating: 5,
    width: 3, // Default to 'perfect' (3)
    length: 3,  // Default to 'perfect' (3)
    weight: null,
    height: null,
    size: null,
    images: [],
    existingImages: [],
    imagesToDelete: []
  });

  // Hover states for star ratings
  const [hoverStates, setHoverStates] = useState({
    rating: 0,
    qualityRating: 0,
    designRating: 0,
    fitRating: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Debug: Log formData whenever it changes
  useEffect(() => {
    console.log('=== FORM DATA UPDATED ===');
    console.log('Existing images count:', formData.existingImages?.length || 0);
    console.log('New images count:', formData.images?.length || 0);
    console.log('Images to delete count:', formData.imagesToDelete?.length || 0);

    if (formData.existingImages?.length > 0) {
      console.log('First existing image:', {
        id: formData.existingImages[0].id,
        url: formData.existingImages[0].url,
        preview: formData.existingImages[0].preview,
        status: formData.existingImages[0].status
      });
    }
  }, [formData]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Initialize form data when review prop changes
  useEffect(() => {
    if (!review) return;

    console.log('=== EDIT REVIEW MODAL DEBUGGING ===');
    console.log('1. Review prop received:', {
      hasReview: true,
      reviewId: review._id || review.id,
      hasImages: review.images?.length > 0,
      imagesCount: review.images?.length || 0,
      imagesStructure: review.images?.[0] ? Object.keys(review.images[0]) : 'No images',
      sampleImage: review.images?.[0] || 'No image data'
    });

    console.log('=== INITIALIZING FORM DATA ===');
    console.log('Review data received:', {
      id: review._id || review.id,
      hasImages: review.images?.length > 0,
      imagesCount: review.images?.length || 0,
      imagesStructure: review.images?.[0] ? Object.keys(review.images[0]) : 'No images'
    });

    // Process existing images
    const existingImages = (review.images || [])
      .filter(img => img && (img.url || img.path)) // Only include images with url or path
      .map(img => {
        const imageUrl = img.url || img.path;
        const fullUrl = imageUrl.startsWith('http')
          ? imageUrl
          : `https://${imageUrl}`;

        console.log('Processing image:', {
          id: img._id || img.id,
          originalUrl: imageUrl,
          fullUrl,
          image: img
        });

        return {
          ...img,
          id: img._id || img.id || `img-${Math.random().toString(36).substr(2, 9)}`,
          url: fullUrl,
          preview: fullUrl,
          status: 'existing',
          name: img.name || 'image.jpg',
          _id: img._id
        };
      });

    console.log('Processed existing images:', existingImages);

    // Handle width and length values
    console.log('Processing review dimensions:', {
      width: review.width,
      length: review.length,
      widthType: typeof review.width,
      lengthType: typeof review.length
    });

    let width = 3; // Default to 'perfect' (3)
    let length = 3; // Default to 'perfect' (3)

    // Handle width - could be a number, string value, or string ID
    if (typeof review.width === 'string') {
      console.log('Processing width as string:', review.width);
      let widthOption = widthOptions.find(opt => opt.id === review.width);
      console.log('Found by ID:', widthOption);

      if (!widthOption) {
        widthOption = widthOptions.find(opt =>
          opt.label.toLowerCase() === review.width.toLowerCase() ||
          opt.id === review.width.replace(/ /g, '-') // Convert spaces to hyphens
        );
        console.log('Found by label or converted ID:', widthOption);
      }

      width = widthOption ? widthOption.value : 3;
      console.log('Final width value:', width);
    } else if (typeof review.width === 'number') {
      console.log('Processing width as number:', review.width);
      width = review.width;
    }

    // Handle length - same logic as width
    if (typeof review.length === 'string') {
      console.log('Processing length as string:', review.length);
      let lengthOption = lengthOptions.find(opt => opt.id === review.length);
      console.log('Found by ID:', lengthOption);

      if (!lengthOption) {
        lengthOption = lengthOptions.find(opt =>
          opt.label.toLowerCase() === review.length.toLowerCase() ||
          opt.id === review.length.replace(/ /g, '-') // Convert spaces to hyphens
        );
        console.log('Found by label or converted ID:', lengthOption);
      }

      length = lengthOption ? lengthOption.value : 3;
      console.log('Final length value:', length);
    } else if (typeof review.length === 'number') {
      console.log('Processing length as number:', review.length);
      length = review.length;
    }

    // Create the complete form data object
    const newFormData = {
      title: review.title || '',
      comment: review.comment || '',
      rating: review.rating || 0,
      qualityRating: review.qualityRating || 5,
      designRating: review.designRating || 5,
      fitRating: review.fitRating || 5,
      width: width,
      length: length,
      weight: review.weight || null,
      height: review.height || null,
      size: review.size || null,
      images: [],
      existingImages: existingImages,
      imagesToDelete: [],
      // Add string representations for backward compatibility
      widthString: widthOptions.find(opt => opt.value === width)?.id || 'perfect',
      lengthString: lengthOptions.find(opt => opt.value === length)?.id || 'perfect'
    };

    console.log('Setting complete form data:', {
      existingImagesCount: newFormData.existingImages.length,
      newFormData: { ...newFormData, existingImages: '[...]' } // Don't log full images array
    });

    setFormData(newFormData);
  }, [review, isOpen]);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      // Clean up new images with blob URLs
      formData.images.forEach(image => {
        if (image.preview && image.preview.startsWith('blob:')) {
          URL.revokeObjectURL(image.preview);
        }
      });

      // Clean up any preview URLs from existing images
      if (formData.existingImages) {
        formData.existingImages.forEach(image => {
          if (image.preview && image.preview.startsWith('blob:')) {
            URL.revokeObjectURL(image.preview);
          }
        });
      }
    };
  }, [formData.images, formData.existingImages]);

  const setHoverRating = (value, field = 'rating') => {
    setHoverStates(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Handle numeric inputs
    if (type === 'number') {
      const numValue = value === '' ? null : parseFloat(value);
      setFormData(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? value : numValue
      }));
    }
    // Handle rating inputs
    else if (name.includes('Rating')) {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value, 10)
      }));
    }
    // Handle all other inputs
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    
    // Calculate how many more images we can add (max 4 total)
    const currentImageCount = formData.images.length + formData.existingImages.length;
    const availableSlots = 4 - currentImageCount;

    if (availableSlots <= 0) {
      toast.warning('You can only upload up to 4 images per review');
      return;
    }

    // Only process up to the available slots
    const filesToProcess = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      toast.warning(`You can only add ${availableSlots} more image(s)`);
    }

    try {
      setIsUploading(true);
      
      // First create previews for immediate UI feedback
      const newImages = filesToProcess.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        type: file.type,
        size: file.size,
        status: 'uploading',
        id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }));

      // Update state with new images (with loading state)
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));

      // Upload files in parallel
      const uploadPromises = newImages.map(async (img) => {
        try {
          const fileExt = img.file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
          const productId = review?.product || review?.product?._id || 'unknown';
          const filePath = `${productId}/${fileName}`;
          
          console.log('Uploading image to Supabase:', { filePath, size: img.file.size, type: img.file.type });
          
          const { error: uploadError } = await supabase.storage
            .from('reviews')
            .upload(filePath, img.file, {
              cacheControl: '3600',
              upsert: false,
              contentType: img.file.type
            });

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('reviews')
            .getPublicUrl(filePath);

          return {
            ...img,
            url: publicUrl,
            path: filePath,
            status: 'uploaded'
          };
        } catch (error) {
          console.error('Error uploading image:', error);
          return {
            ...img,
            status: 'error',
            error: error.message
          };
        }
      });

      // Update state with uploaded images
      const uploadedImages = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [
          ...prev.images.filter(img => !img.id.startsWith('new-')),
          ...uploadedImages
        ]
      }));

    } catch (error) {
      console.error('Error processing images:', error);
      toast.error('Error uploading images. Please try again.');
    } finally {
      // Reset file input to allow selecting the same file again
      e.target.value = null;
    }
  };

  // Handle file selection with Supabase upload
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);

    // Calculate how many more images we can add (max 4 total)
    const currentImageCount = formData.images.length + formData.existingImages.length;
    const availableSlots = 4 - currentImageCount;

    if (availableSlots <= 0) {
      toast.warning('You can only upload up to 4 images per review');
      return;
    }

    // Only process up to the available slots
    const filesToProcess = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      toast.warning(`You can only add ${availableSlots} more image(s)`);
    }

    try {
      setIsUploading(true);
      
      // Upload files in parallel
      const uploadPromises = filesToProcess.map(async (file) => {
        const result = await uploadImageToSupabase(file);
        return {
          ...result,
          preview: URL.createObjectURL(file),
          status: 'uploaded',
          id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));

    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload one or more images');
    } finally {
      setIsUploading(false);
      // Reset file input to allow selecting the same file again if needed
      e.target.value = null;
    }
  };

  const deleteImageFromSupabase = async (imagePath) => {
    if (!imagePath) return;
    
    try {
      // Extract the file path from the URL if it's a full URL
      let filePath = imagePath;
      if (filePath.includes('/storage/v1/object/public/reviews/')) {
        filePath = filePath.split('/storage/v1/object/public/reviews/')[1];
      }
      
      console.log('Deleting image from Supabase:', filePath);
      
      const { error } = await supabase.storage
        .from('reviews')
        .remove([filePath]);
        
      if (error) throw error;
      
      console.log('Successfully deleted image from Supabase:', filePath);
      return true;
    } catch (error) {
      console.error('Error deleting image from Supabase:', error);
      toast.error('Failed to delete image from storage');
      return false;
    }
  };

  const handleRemoveImage = async (imageId, isExisting) => {
    console.log('Removing image:', { imageId, isExisting });

    try {
      if (isExisting) {
        // Find the image to delete
        const imageToDelete = formData.existingImages.find(img => 
          img.id === imageId || img._id === imageId
        );
        
        if (!imageToDelete) return;
        
        const imagePath = imageToDelete.path || imageToDelete.url;
        
        // Delete from Supabase
        const deletedFromStorage = await deleteImageFromSupabase(imagePath);
        
        if (!deletedFromStorage) {
          // If deletion from storage fails, we'll still remove it from the UI
          // but we'll keep it in imagesToDelete to try again later
          toast.warning('Image removed from review but could not delete from storage');
        }
        
        // Update the state to remove the image
        setFormData(prev => {
          const updatedExistingImages = prev.existingImages.filter(img => 
            img.id !== imageId && img._id !== imageId
          );
          
          return {
            ...prev,
            existingImages: updatedExistingImages,
            imagesToDelete: [...(prev.imagesToDelete || []), imagePath].filter(Boolean)
          };
        });
        
        toast.success('Image removed from review');
      } else {
        // For newly added images that haven't been uploaded to Supabase yet
        setFormData(prev => {
          const imageToRemove = prev.images.find(img => img.id === imageId);
          
          // If the image was already uploaded to Supabase, delete it
          if (imageToRemove?.path && imageToRemove?.status === 'uploaded') {
            deleteImageFromSupabase(imageToRemove.path);
          }
          
          // Clean up object URL if it exists
          if (imageToRemove?.preview?.startsWith('blob:')) {
            URL.revokeObjectURL(imageToRemove.preview);
          }
          
          return {
            ...prev,
            images: prev.images.filter(img => img.id !== imageId)
          };
        });
      }
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const reviewId = review?._id || review?.id;
      if (!reviewId) {
        throw new Error('No review ID available for update');
      }

      // Create FormData for file uploads
      const formDataObj = new FormData();

      // Prepare all image paths that should be kept
      const imagesToKeep = [
        ...formData.existingImages.map(img => img.path || img.url),
        ...formData.images
          .filter(img => img.status === 'uploaded' && (img.path || img.url))
          .map(img => img.path || img.url)
      ].filter(Boolean);

      console.log('Images to keep:', imagesToKeep);

      // Add all form data to FormData
      const updateData = {
        title: formData.title || '',
        comment: formData.comment || '',
        rating: formData.rating || 0,
        qualityRating: formData.qualityRating || 5,
        designRating: formData.designRating || 5,
        fitRating: formData.fitRating || 5,
        width: formData.width || 3,
        length: formData.length || 3,
        weight: formData.weight !== undefined ? formData.weight : null,
        height: formData.height !== undefined ? formData.height : null,
        size: formData.size !== undefined ? formData.size : (review?.size || null),
        // Add all images that should be kept
        imagesToKeep: imagesToKeep.length > 0 ? imagesToKeep : undefined
      };

      // Append all fields to FormData
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            // Handle arrays (like imagesToKeep)
            value.forEach(item => {
              formDataObj.append(key, item);
            });
          } else {
            formDataObj.append(key, value);
          }
        }
      });

      // Add already uploaded image URLs to the form data
      const uploadedImages = formData.images
        .filter(img => img.status === 'uploaded' && img.url)
        .map(img => ({
          url: img.url,
          path: img.path,
          name: img.name,
          size: img.size,
          type: img.type
        }));

      // Add the uploaded images to the form data
      if (uploadedImages.length > 0) {
        formDataObj.append('images', JSON.stringify(uploadedImages));
      }

      // Add images to delete
      if (formData.imagesToDelete && formData.imagesToDelete.length > 0) {
        formData.imagesToDelete.forEach(path => {
          formDataObj.append('imagesToDelete', path);
        });
      }

      console.log('Sending update request with form data');
      const response = await reviewService.updateReview(reviewId, formDataObj);
      console.log('Update response:', response);

      if (onReviewUpdated) {
        // Create an updated review object with the response data
        const updatedReview = {
          ...review,
          ...updateData,
          _id: review._id || review.id,
          id: review.id || review._id,
          images: [
            // Keep existing images that weren't deleted
            ...formData.existingImages.map(img => ({
              url: img.url || img.path,
              path: img.path || img.url,
              name: img.name || 'image.jpg'
            })),
            // Add new images from the response
            ...(response.images || []).map(img => ({
              url: img.url,
              path: img.path,
              name: img.name || 'image.jpg'
            }))
          ]
        };

        onReviewUpdated(updatedReview);
      }

      toast.success('Review updated successfully');
      if (onClose) onClose();
    } catch (err) {
      console.error('Error in handleSubmit:', {
        error: err,
        response: err.response,
        message: err.message,
        stack: err.stack
      });

      const errorMessage = err.response?.data?.message ||
          err.message ||
          'Failed to update review. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none overflow-y-auto">
      <div className="fixed inset-0 bg-black/65"></div>
      <div ref={modalRef} className="relative z-10 w-full max-w-2xl rounded-lg bg-neutral-50 shadow-lg dark:bg-neutral-800 max-h-[90vh] flex flex-col">
        <div className="flex-shrink-0 flex items-center justify-between rounded-t border-b border-neutral-200 p-4 dark:border-neutral-700 md:p-5">
          <div>
            <h3 className="mb-1 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              Edit your review for:
            </h3>
            <p className="font-medium text-primary-700 dark:text-neutral-50">{productName || 'this product'}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="group ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600 dark:hover:text-neutral-200"
            aria-label="Close modal"
          >
            <span className="text-xl">×</span>
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-4 md:p-5 overflow-y-auto custom-scrollbar">
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-neutral-800 dark:text-red-400" role="alert">
              {error}
            </div>
          )}

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverStates(prev => ({ ...prev, rating: star }))}
                    onMouseLeave={() => setHoverStates(prev => ({ ...prev, rating: 0 }))}
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className="text-2xl"
                  >
                    {star <= (hoverStates.rating || formData.rating) ? (
                      <span className="text-yellow-400">★</span>
                    ) : (
                      <span className="text-neutral-300 dark:text-neutral-500">★</span>
                    )}
                  </button>
                ))}
                <span className="ms-2 text-lg font-bold text-neutral-900 dark:text-neutral-50">
                  {formData.rating} / 5
                </span>
              </div>
            </div>

            <div className="col-span-2">
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-neutral-900 dark:text-neutral-50">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="block w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2.5 text-sm text-neutral-900 focus:border-primary-600 focus:ring-primary-600 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50 dark:placeholder-neutral-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                placeholder="e.g. I would buy that again!"
                required
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="comment" className="mb-2 block text-sm font-medium text-neutral-900 dark:text-neutral-50">
                Review
              </label>
              <textarea
                id="comment"
                name="comment"
                rows="4"
                value={formData.comment}
                onChange={handleChange}
                className="block w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2.5 text-sm text-neutral-900 focus:border-primary-600 focus:ring-primary-600 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50 dark:placeholder-neutral-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                placeholder="Share details about your experience with this product"
                required
              ></textarea>
            </div>

            {/* Weight Input */}
            <div className="col-span-1">
              <label htmlFor="weight" className="mb-2 block text-sm font-medium text-neutral-900 dark:text-neutral-50">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                id="weight"
                min="0"
                step="0.1"
                value={formData.weight || ''}
                onChange={handleChange}
                className="block w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2.5 text-sm text-neutral-900 focus:border-primary-600 focus:ring-primary-600 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50 dark:placeholder-neutral-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                placeholder="e.g. 75.5"
              />
            </div>

            {/* Height Input */}
            <div className="col-span-1">
              <label htmlFor="height" className="mb-2 block text-sm font-medium text-neutral-900 dark:text-neutral-50">
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                id="height"
                min="0"
                step="0.1"
                value={formData.height || ''}
                onChange={handleChange}
                className="block w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2.5 text-sm text-neutral-900 focus:border-primary-600 focus:ring-primary-600 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50 dark:placeholder-neutral-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                placeholder="e.g. 175.5"
              />
            </div>
          </div>

          {/* Detailed Ratings */}
          <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { name: 'qualityRating', label: 'Quality' },
              { name: 'designRating', label: 'Design' },
              { name: 'fitRating', label: 'Fit' },
            ].map(({ name, label }) => (
              <div key={name} className="space-y-2">
                <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-50 text-center">
                  {label}
                </label>
                <div className="flex justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={`${name}-${star}`}
                      type="button"
                      onMouseEnter={() => setHoverRating(star, name)}
                      onMouseLeave={() => setHoverRating(0, name)}
                      onClick={() => setFormData(prev => ({ ...prev, [name]: star }))}
                      className="text-2xl"
                    >
                      {star <= (hoverStates[name] || formData[name]) ? (
                        <span className="text-yellow-400">★</span>
                      ) : (
                        <span className="text-neutral-300 dark:text-neutral-500">★</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/*/!* Width Selector *!/*/}
          {/*<div className="mt-6 flex items-center">*/}
          {/*  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 w-20 -mt-5">*/}
          {/*    Width*/}
          {/*  </label>*/}
          {/*  <div className="flex-1 relative">*/}
          {/*    <div className="h-px bg-neutral-200 absolute top-1.5 left-0 right-0"></div>*/}
          {/*    <div className="w-full grid grid-cols-5 relative z-10">*/}
          {/*      {widthOptions.map((option, index) => (*/}
          {/*        <div*/}
          {/*          key={`width-${option.value}`}*/}
          {/*          className="flex flex-col items-center"*/}
          {/*          style={{*/}
          {/*            position: 'relative',*/}
          {/*            left: index === 0 ? '0' : 'auto',*/}
          {/*            right: index === 4 ? '0' : 'auto'*/}
          {/*          }}*/}
          {/*        >*/}
          {/*          <div*/}
          {/*            className={`w-3 h-3 rounded-full border-2 mb-1 cursor-pointer transition-colors ${formData.width === option.value ? 'bg-accent border-accent' : 'bg-neutral-50 border-neutral-300'}`}*/}
          {/*            onClick={() => {*/}
          {/*              console.log('Setting width to:', option);*/}
          {/*              setFormData(prev => ({*/}
          {/*                ...prev,*/}
          {/*                width: option.value,*/}
          {/*                // Also update the string representation for backward compatibility*/}
          {/*                widthString: option.id*/}
          {/*              }));*/}
          {/*            }}*/}
          {/*          />*/}
          {/*          <span className={`text-xs text-neutral-500 neutral-50space-nowrap text-center ${index === 0 ? 'pr-1' : index === 4 ? 'pl-1' : ''}`}>*/}
          {/*            {option.label}*/}
          {/*          </span>*/}
          {/*        </div>*/}
          {/*      ))}*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/*/!* Length Selector *!/*/}
          {/*<div className="mt-6 flex items-center">*/}
          {/*  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 w-20 -mt-5">*/}
          {/*    Length*/}
          {/*  </label>*/}
          {/*  <div className="flex-1 relative">*/}
          {/*    <div className="h-px bg-neutral-200 absolute top-1.5 left-0 right-0"></div>*/}
          {/*    <div className="w-full grid grid-cols-5 relative z-10">*/}
          {/*      {lengthOptions.map((option, index) => (*/}
          {/*        <div*/}
          {/*          key={`length-${option.value}`}*/}
          {/*          className="flex flex-col items-center"*/}
          {/*          style={{*/}
          {/*            position: 'relative',*/}
          {/*            left: index === 0 ? '0' : 'auto',*/}
          {/*            right: index === 4 ? '0' : 'auto'*/}
          {/*          }}*/}
          {/*        >*/}
          {/*          <div*/}
          {/*            className={`w-3 h-3 rounded-full border-2 mb-1 cursor-pointer transition-colors ${formData.length === option.value ? 'bg-accent border-accent' : 'bg-neutral-50 border-neutral-300'}`}*/}
          {/*            onClick={() => {*/}
          {/*              console.log('Setting length to:', option);*/}
          {/*              setFormData(prev => ({*/}
          {/*                ...prev,*/}
          {/*                length: option.value,*/}
          {/*                // Also update the string representation for backward compatibility*/}
          {/*                lengthString: option.id*/}
          {/*              }));*/}
          {/*            }}*/}
          {/*          />*/}
          {/*          <span className={`text-xs text-neutral-500 neutral-50space-nowrap text-center ${index === 0 ? 'pr-1' : index === 4 ? 'pl-1' : ''}`}>*/}
          {/*            {option.label}*/}
          {/*          </span>*/}
          {/*        </div>*/}
          {/*      ))}*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}

          <div className="col-span-2">
            <p className="mb-2 block text-sm font-medium text-neutral-900 dark:text-neutral-50">
              Product Photos
              <span className="ml-1 text-xs font-normal text-neutral-500 dark:text-neutral-400">
                (Click on an image to remove it)
              </span>
            </p>

            {/* Image preview grid */}
            <div className="flex flex-wrap gap-2 my-3">
              {/* Existing images */}
              {formData.existingImages?.map((image, index) => {
                const imageUrl = image.preview || image.url || image.path;
                if (!imageUrl) return null;

                const fullUrl = imageUrl.startsWith('http') ? imageUrl : `https:${imageUrl}`;

                return (
                  <div key={`existing-${image.id || index}`} className="relative group">
                    <div className="w-24 h-24 rounded-md overflow-hidden bg-transparent border border-neutral-200 dark:border-neutral-600">
                      <img
                        src={fullUrl}
                        alt={`Review image ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        onClick={() => window.open(fullUrl, '_blank')}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(image.id, true);
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-neutral-50 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}

              {/* Newly added images */}
              {formData.images?.map((image, index) => {
                const imageUrl = image.preview || image.url || image.path;
                if (!imageUrl) return null;

                return (
                  <div key={`new-${image.id || index}`} className="relative group">
                    <div className="w-24 h-24 rounded-md overflow-hidden bg-transparent border border-neutral-200 dark:border-neutral-600">
                      <img
                        src={imageUrl}
                        alt={`New image ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        onClick={() => window.open(imageUrl, '_blank')}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(image.id, false);
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-neutral-50 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}

              {/* Add Image Button */}
              {(formData.existingImages?.length || 0) + (formData.images?.length || 0) < 4 && (
                <div
                  // className="w-24 h-24 border-2 border-dashed border-neutral-300 rounded-md flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:border-neutral-400 cursor-pointer transition-colors"
                    className={`flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-700 dark:hover:border-neutral-500 dark:hover:bg-neutral-600 ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center">
                    {/*<svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">*/}
                    {/*  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>*/}
                    {/*</svg>*/}
                    {/*<span className="text-xs">Add Image</span>*/}
                    <svg
                        className="mx-auto h-8 w-8 text-neutral-500"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                      <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={4}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

              {/* File input for image uploads (hidden) */}
              <input
                type="file"
                id="review-images"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
                multiple
                disabled={(formData?.images?.length || 0) + (formData?.existingImages?.length || 0) >= 4}
              />
            </div>

            {(formData?.images?.length || 0) + (formData?.existingImages?.length || 0) >= 4 && (
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                Maximum of 4 images reached. Remove some images to add more.
              </p>
            )}

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-neutral-700 dark:text-neutral-50 dark:hover:bg-neutral-600 dark:focus:ring-neutral-700"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-black px-5 py-2 text-center text-sm font-medium text-neutral-50 hover:bg-neutral-700 focus:outline-none focus:ring-4 focus:ring-neutral-300 disabled:opacity-50 dark:bg-neutral-200 dark:text-black dark:hover:bg-neutral-400 dark:focus:ring-neutral-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : 'Update Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReviewModal;
