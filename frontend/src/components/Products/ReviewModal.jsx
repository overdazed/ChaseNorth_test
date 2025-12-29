import React, { useState, useRef, useEffect } from 'react';
import { createReview } from '../../services/reviewService';
import { toast } from 'react-toastify';
import xMarkIcon from '../../assets/x-mark.svg';
import CustomSelect from '../Common/CustomSelect';
import { supabase } from '../../services/superbaseClient';
import { Link } from 'react-router-dom';

const ReviewModal = ({ isOpen, onClose, productName, productId, onReviewSubmit, user, sizes = [] }) => {
    // State hooks at the top level
    const [isUploading, setIsUploading] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [hoverQuality, setHoverQuality] = useState(0);
    const [hoverDesign, setHoverDesign] = useState(0);
    const [hoverFit, setHoverFit] = useState(0);
    const [hoverWidth, setHoverWidth] = useState(0);
    const [hoverLength, setHoverLength] = useState(0);
    const [agreed, setAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        photos: [],
        rating: 0,
        qualityRating: 0,
        designRating: 0,
        fitRating: 0,
        widthRating: 0,
        lengthRating: 0,
        weight: '',
        height: '',
        size: '',
        images: []
    });

    // Set default rating when component mounts
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            rating: 0,
            qualityRating: 0,
            designRating: 0,
            fitRating: 0,
            // widthRating: 0,
            // lengthRating: 0
        }));
    }, []);

    // Check Supabase connection and authentication
    const checkSupabase = async () => {
        if (!supabase) {
            console.error('Supabase client not initialized');
            throw new Error('Storage service is not available');
        }

        // Try to get existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
            console.error('Error getting session:', sessionError);
            throw new Error('Failed to check authentication status');
        }

        // If no session, we'll proceed with the current flow but without anonymous auth
        if (!session) {
            console.log('No active session, proceeding with unauthenticated upload');
            // Return a mock session object with a unique ID for this browser session
            return {
                user: {
                    id: `anon-${Math.random().toString(36).substring(2, 15)}`,
                    isAnonymous: true
                }
            };
        }

        console.log('Using existing session for user:', session.user.id);
        return session;
    };


    const uploadImageToSupabase = async (file, path) => {
        try {
            const { error } = await supabase.storage
                .from('reviews')
                .upload(path, file, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: file.type
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('reviews')
                .getPublicUrl(path);

            return {
                url: publicUrl,
                path: path,
                name: file.name,
                type: file.type,
                size: file.size
            };
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted');

        if (!formData.title || !formData.description || !formData.rating) {
            console.error('Missing required fields');
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);

            // Upload images to Supabase
            const uploadPromises = formData.images
                .filter(img => img.status === 'pending')
                .map(async (img) => {
                    updateImageStatus(img.id, 'uploading');
                    try {
                        const result = await uploadImageToSupabase(img.file, img.path);
                        updateImageStatus(img.id, 'uploaded', 100, result.url, result.path);
                        return result;
                    } catch (error) {
                        updateImageStatus(img.id, 'error', 0, null, null, error.message);
                        throw error;
                    }
                });

            // Wait for all uploads to complete
            const uploadedImages = await Promise.all(uploadPromises);
            
            // Get all images (both newly uploaded and any previously uploaded)
            const allImages = [
                ...formData.images
                    .filter(img => img.status === 'uploaded' && img.url)
                    .map(img => ({
                        url: img.url,
                        path: img.path,
                        name: img.name
                    })),
                ...uploadedImages
            ];

            // Prepare the review data with all fields
            const reviewData = {
                productId: productId,
                title: formData.title,
                comment: formData.description,
                rating: formData.rating,
                qualityRating: formData.qualityRating,
                designRating: formData.designRating,
                fitRating: formData.fitRating,
                // width: formData.widthRating || 3,
                // length: formData.lengthRating || 3,
                weight: formData.weight,
                height: formData.height,
                size: formData.size || null,
                verifiedPurchase: true,
                images: allImages
            };

            console.log('Submitting review with data:', reviewData);
            const response = await createReview(reviewData);
            console.log('Review submission successful:', response);
            toast.success('Review submitted successfully!');

            if (onReviewSubmit) {
                onReviewSubmit(response.data);
            }

            // Reset form
            setFormData({
                title: '',
                description: '',
                photos: [],
                rating: 5,
                qualityRating: 5,
                designRating: 5,
                fitRating: 5,
                // widthRating: 3,
                // lengthRating: 3,
                weight: '',
                height: '',
                size: '',
                images: []
            });

            // Clean up object URLs
            formData.images.forEach(img => {
                if (img.preview) {
                    URL.revokeObjectURL(img.preview);
                }
            });

            onClose();
        } catch (error) {
            console.error('Error submitting review:', error);
            let errorMessage = 'Failed to submit review. Please try again.';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateImageStatus = (id, status, progress = 0, url = null, path = null) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.map(img =>
                img.id === id
                    ? { ...img, status, progress, ...(url && { url }), ...(path && { path }) }
                    : img
            )
        }));
    };

    const removeImage = async (index) => {
        if (isUploading) return;

        const imageToRemove = formData.images[index];
        if (!imageToRemove) return;

        // If the image was uploaded to Supabase, delete it
        if (imageToRemove.path) {
            try {
                const { error } = await supabase.storage
                    .from('reviews')
                    .remove([imageToRemove.path]);

                if (error) throw error;
            } catch (error) {
                console.error('Error deleting image:', error);
                toast.error('Failed to delete image');
                return;
            }
        }

        // Remove from local state
        const newImages = [...formData.images];
        newImages.splice(index, 1);

        // Also update photos array if it exists
        const newPhotos = formData.photos ? [...formData.photos] : [];
        if (formData.photos && formData.photos[index]) {
            newPhotos.splice(index, 1);
        }

        // Update the state
        setFormData(prev => ({
            ...prev,
            images: newImages,
            ...(formData.photos && { photos: newPhotos })
        }));

        // Clean up object URL
        if (imageToRemove.preview) {
            URL.revokeObjectURL(imageToRemove.preview);
        }
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            if (formData.images.length + files.length > 4) {
                toast.error('Maximum 4 images allowed');
                return;
            }

            // Check file sizes (5MB limit per file)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            const oversizedFiles = Array.from(files).filter(file => file.size > maxSize);
            if (oversizedFiles.length > 0) {
                toast.error('Each image must be less than 5MB');
                return;
            }

            // Create previews for selected files
            const newImages = Array.from(files).map(file => {
                const previewUrl = URL.createObjectURL(file);
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
                const filePath = `${productId}/${fileName}`;
                
                return {
                    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    name: file.name,
                    preview: previewUrl,
                    status: 'pending',
                    file: file,
                    path: filePath
                };
            });

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
            }));

        } catch (error) {
            console.error('Error processing files:', error);
            toast.error('Error processing files');
        } finally {
            e.target.value = ''; // Reset file input
        }
    };
    
    // const removeImage = (index) => {
    //     const newImages = [...formData.images];
    //     URL.revokeObjectURL(newImages[index].preview);
    //     newImages.splice(index, 1);
    //
    //     const newPhotos = [...formData.photos];
    //     newPhotos.splice(index, 1);
    //
    //     setFormData(prev => ({
    //         ...prev,
    //         photos: newPhotos,
    //         images: newImages
    //     }));
    // };

    if (!isOpen) return null;

    // Handle clicks outside the modal to close it
    const handleModalClick = (e) => {
        // If the click is directly on the backdrop (not on the modal content)
        if (e.target === e.currentTarget) {
            onClose();
            return;
        }

        // Only prevent default for non-input elements
        if (!e.target.matches('input, textarea, [contenteditable]')) {
            e.preventDefault();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/65 p-4 select-none overflow-y-auto"
            onMouseDown={handleModalClick}
            style={{ cursor: 'default' }}
        >
            <div className="relative w-full max-w-2xl rounded-lg bg-neutral-50 shadow-lg dark:bg-neutral-800 my-8 max-h-[calc(100vh-4rem)] flex flex-col">
                <div className="flex-shrink-0 flex items-center justify-between rounded-t border-b border-neutral-200 p-4 dark:border-neutral-700 md:p-5">
                    <div>
                        <h3 className="mb-1 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                            Add a review for:
                        </h3>
                        <p className="font-medium text-primary-700 dark:text-neutral-50">{productName}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="group ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600 dark:hover:text-neutral-200"
                        aria-label="Close modal"
                    >
                        <img
                            src={xMarkIcon}
                            alt=""
                            className="h-4 w-4"
                            style={{ filter: 'invert(50%)' }}
                        />
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 p-4 md:p-5 overflow-y-auto custom-scrollbar">
                    <style jsx={"true"}>{`
                        .custom-scrollbar {
                            scrollbar-width: thin;
                            scrollbar-color: #9ca3af transparent;
                        }
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 6px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: transparent;
                            margin: 12px 0;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background-color: #9ca3af;
                            border-radius: 3px;
                        }
                    `}</style>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                        className="text-2xl"
                                    >
                                        {star <= (hover || formData.rating) ? (
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
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="block w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2.5 text-sm text-neutral-900 focus:border-primary-600 focus:ring-primary-600 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50 dark:placeholder-neutral-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                placeholder="e.g. I would buy that again!"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label htmlFor="description" className="mb-2 block text-sm font-medium text-neutral-900 dark:text-neutral-50">
                                Review
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="block w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2.5 text-sm text-neutral-900 focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50 dark:placeholder-neutral-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                placeholder="Your review"
                                required
                            />
                            {/* Report */}
                            <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
                                Problems with the product or delivery?{' '}
                                <Link to="/report" className="text-primary-600 font-semibold text-neutral-200 hover:underline dark:text-primary-500">
                                    Send a report
                                </Link>
                            </p>
                            <div className="mt-4 grid grid-cols-3 gap-4">
                                {/* Quality Rating */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1 text-center">
                                        Quality
                                    </label>
                                    <div className="flex justify-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={`quality-${star}`}
                                                type="button"
                                                onMouseEnter={() => setHoverQuality(star)}
                                                onMouseLeave={() => setHoverQuality(0)}
                                                onClick={() => setFormData(prev => ({ ...prev, qualityRating: star }))}
                                                className="text-2xl"
                                            >
                                                {star <= (hoverQuality || formData.qualityRating) ? (
                                                    <span className="text-yellow-400">★</span>
                                                ) : (
                                                    <span className="text-neutral-300 dark:text-neutral-500">★</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Design Rating */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1 text-center">
                                        Design
                                    </label>
                                    <div className="flex justify-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={`design-${star}`}
                                                type="button"
                                                onMouseEnter={() => setHoverDesign(star)}
                                                onMouseLeave={() => setHoverDesign(0)}
                                                onClick={() => setFormData(prev => ({ ...prev, designRating: star }))}
                                                className="text-2xl"
                                            >
                                                {star <= (hoverDesign || formData.designRating) ? (
                                                    <span className="text-yellow-400">★</span>
                                                ) : (
                                                    <span className="text-neutral-300 dark:text-neutral-500">★</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Fit Rating */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1 text-center">
                                        Fit
                                    </label>
                                    <div className="flex justify-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={`fit-${star}`}
                                                type="button"
                                                onMouseEnter={() => setHoverFit(star)}
                                                onMouseLeave={() => setHoverFit(0)}
                                                onClick={() => setFormData(prev => ({ ...prev, fitRating: star }))}
                                                className="text-2xl"
                                            >
                                                {star <= (hoverFit || formData.fitRating) ? (
                                                    <span className="text-yellow-400">★</span>
                                                ) : (
                                                    <span className="text-neutral-300 dark:text-neutral-500">★</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/*/!* Width Selector *!/*/}
                            {/*<div className="mt-6 flex items-center">*/}
                            {/*    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 w-20 -mt-5">*/}
                            {/*        Width*/}
                            {/*    </label>*/}
                            {/*    <div className="flex-1 relative">*/}
                            {/*        <div className="h-px bg-neutral-200 absolute top-1.5 left-0 right-0"></div>*/}
                            {/*        <div className="w-full grid grid-cols-5 relative z-10">*/}
                            {/*            {['too tight', 'slightly tight', 'perfect', 'slightly wide', 'too wide'].map((option, index) => (*/}
                            {/*                <div*/}
                            {/*                    key={`width-${index}`}*/}
                            {/*                    className="flex flex-col items-center"*/}
                            {/*                    style={{*/}
                            {/*                        position: 'relative',*/}
                            {/*                        left: index === 0 ? '0' : 'auto',*/}
                            {/*                        right: index === 4 ? '0' : 'auto'*/}
                            {/*                    }}*/}
                            {/*                >*/}
                            {/*                    <div*/}
                            {/*                        className={`w-3 h-3 rounded-full border-2 mb-1 cursor-pointer transition-colors ${formData.width === option.toLowerCase().replace(' ', '-') ? 'bg-accent border-accent' : 'bg-neutral-50 border-neutral-300'}`}*/}
                            {/*                        onClick={() => {*/}
                            {/*                            const widthValue = index + 1; // 1-5 based on position*/}
                            {/*                            setFormData(prev => ({*/}
                            {/*                                ...prev,*/}
                            {/*                                width: option.toLowerCase().replace(' ', '-'),*/}
                            {/*                                widthRating: widthValue*/}
                            {/*                            }));*/}
                            {/*                        }}*/}
                            {/*                    />*/}
                            {/*                    <span className={`text-xs text-neutral-500 neutral-50space-nowrap ${index === 0 ? 'pr-1' : index === 4 ? 'pl-1' : ''}`}>*/}
                            {/*                        {option}*/}
                            {/*                    </span>*/}
                            {/*                </div>*/}
                            {/*            ))}*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/* Length Selector */}
                            {/*<div className="mt-6 flex items-center">*/}
                            {/*    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 w-20 -mt-5">*/}
                            {/*        Length*/}
                            {/*    </label>*/}
                            {/*    <div className="flex-1 relative">*/}
                            {/*        <div className="h-px bg-neutral-200 absolute top-1.5 left-0 right-0"></div>*/}
                            {/*        <div className="w-full grid grid-cols-5 relative z-10">*/}
                            {/*            {['too short', 'slightly short', 'perfect', 'slightly long', 'too long'].map((option, index) => (*/}
                            {/*                <div*/}
                            {/*                    key={`length-${index}`}*/}
                            {/*                    className="flex flex-col items-center"*/}
                            {/*                    style={{*/}
                            {/*                        position: 'relative',*/}
                            {/*                        left: index === 0 ? '0' : 'auto',*/}
                            {/*                        right: index === 4 ? '0' : 'auto'*/}
                            {/*                    }}*/}
                            {/*                >*/}
                            {/*                    <div*/}
                            {/*                        className={`w-3 h-3 rounded-full border-2 mb-1 cursor-pointer transition-colors ${formData.length === option.toLowerCase().replace(' ', '-') ? 'bg-accent border-accent' : 'bg-neutral-50 border-neutral-300'}`}*/}
                            {/*                        onClick={() => {*/}
                            {/*                            const lengthValue = index + 1; // 1-5 based on position*/}
                            {/*                            setFormData(prev => ({*/}
                            {/*                                ...prev,*/}
                            {/*                                length: option.toLowerCase().replace(' ', '-'),*/}
                            {/*                                lengthRating: lengthValue*/}
                            {/*                            }));*/}
                            {/*                        }}*/}
                            {/*                    />*/}
                            {/*                    <span className={`text-xs text-neutral-500 neutral-50space-nowrap ${index === 0 ? 'pr-1' : index === 4 ? 'pl-1' : ''}`}>*/}
                            {/*                        {option}*/}
                            {/*                    </span>*/}
                            {/*                </div>*/}
                            {/*            ))}*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/* Weight, Height and Size Fields */}
                            <div className="mt-6 grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="weight" className="block mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-50">
                                        Your Weight (kg) <span className="text-neutral-500 dark:text-neutral-400">(Optional)</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="weight"
                                        name="weight"
                                        min="0"
                                        step="0.1"
                                        value={formData.weight}
                                        onChange={(e) => {
                                            const value = e.target.value === '' ? '' : parseFloat(e.target.value);
                                            setFormData(prev => ({
                                                ...prev,
                                                weight: isNaN(value) ? '' : value
                                            }));
                                        }}
                                        className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-neutral-50 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="e.g. 65.5"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="height" className="block mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-50">
                                        Your Height (cm) <span className="text-neutral-500 dark:text-neutral-400">(Optional)</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="height"
                                        name="height"
                                        min="0"
                                        step="1"
                                        value={formData.height}
                                        onChange={(e) => {
                                            const value = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                                            setFormData(prev => ({
                                                ...prev,
                                                height: isNaN(value) ? '' : value
                                            }));
                                        }}
                                        className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-neutral-50 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="e.g. 175"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-50">
                                        Size Purchased <span className="text-neutral-500 dark:text-neutral-400">(Optional)</span>
                                    </label>
                                    <CustomSelect
                                        value={formData.size}
                                        onChange={(value) => setFormData(prev => ({...prev, size: value}))}
                                        placeholder="Select size"
                                        placeholderMobile="Size"
                                        options={sizes.map(size => ({
                                            value: size,
                                            label: size
                                        }))}
                                        className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-neutral-50 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <p className="mb-2 block text-sm font-medium text-neutral-900 dark:text-neutral-50">
                                Add real photos of the product to help other customers{' '}
                                <span className="text-neutral-500 dark:text-neutral-400">(Optional)</span>
                            </p>
                            <div className="w-full">
                                {formData.images.length === 0 ? (
                                    <label
                                        htmlFor="dropzone-file"
                                        className="dark:hover:bg-bray-800 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-700 dark:hover:border-neutral-500 dark:hover:bg-neutral-600"
                                    >

                                        <div className="space-y-1 text-center">
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
                                            <div className="flex text-sm text-neutral-600 dark:text-neutral-400">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                                                >
                                                    <span className="text-accent" >Upload files</span>
                                                    <input
                                                        id="file-upload"
                                                        name="file-upload"
                                                        type="file"
                                                        className="sr-only"
                                                        multiple
                                                        onChange={handleFileChange}
                                                        accept="image/*,.pdf"
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                SVG, PNG, JPG or GIF (MAX. 5MB)
                                            </p>
                                            {isUploading && (
                                                <div className="mt-2 text-sm text-blue-600">Uploading images...</div>
                                            )}
                                        </div>
                                    </label>
                                ) : (
                                    <div className="flex flex-wrap gap-4">
                                        {formData.images.map((image, index) => (
                                            <div key={image.id || index} className="group relative h-24 w-24 overflow-visible rounded-lg border border-neutral-200 dark:border-neutral-600">
                                                <img
                                                    src={image.preview || image.url}
                                                    alt={`Preview ${index}`}
                                                    className={`h-24 w-24 object-cover rounded ${
                                                        image.status === 'error' ? 'opacity-50' : ''
                                                    }`}
                                                />
                                                {/*<button*/}
                                                {/*    type="button"*/}
                                                {/*    onClick={async (e) => {*/}
                                                {/*        e.stopPropagation();*/}
                                                {/*        await removeImage(index);*/}
                                                {/*    }}*/}
                                                {/*    className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-neutral-50 hover:bg-black/70"*/}
                                                {/*    disabled={isUploading}*/}
                                                {/*>*/}
                                                {/*    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">*/}
                                                {/*        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />*/}
                                                {/*    </svg>*/}
                                                {/*</button>*/}

                                                {image.status === 'uploading' && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                        <div className="text-neutral-50 text-xs">Uploading...</div>
                                                    </div>
                                                )}
                                                {image.status === 'error' && (
                                                    <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                                                        <div className="text-neutral-50 text-xs">Upload failed</div>
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage(index);
                                                    }}
                                                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-neutral-50 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 z-10"
                                                    title="Remove image"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>

                                                {image.status === 'uploading' && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-200">
                                                        <div
                                                            className="h-full bg-blue-500"
                                                            style={{ width: `${image.progress || 0}%` }}
                                                        ></div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {formData.images.length < 4 && (
                                            <label
                                                htmlFor="dropzone-file"
                                                className={`flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-700 dark:hover:border-neutral-500 dark:hover:bg-neutral-600 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <svg
                                                    className="h-8 w-8 text-neutral-500 dark:text-neutral-400"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 20 16"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="4"
                                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                    />
                                                </svg>
                                            </label>
                                        )}
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    multiple
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    disabled={isUploading}
                                />
                            </div>
                        </div>

                        <div className="col-span-2">
                            <div className="flex items-center">
                                <input
                                    id="review-checkbox"
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="h-4 w-4 rounded border-neutral-300 bg-neutral-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:ring-offset-neutral-800 dark:focus:ring-primary-600"
                                    required
                                />
                                <label htmlFor="review-checkbox" className="ms-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                    By publishing this review you agree with the{' '}
                                    <Link to="/terms-and-conditions" className="text-primary-600 font-semibold text-neutral-200 hover:underline dark:text-primary-500">
                                        terms and conditions
                                    </Link>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3 border-t border-neutral-200 pt-4 dark:border-neutral-700">
                        <button
                            type="submit"
                            disabled={!agreed || isSubmitting}
                            className="rounded-full bg-black px-5 py-2.5 text-center text-sm font-medium text-neutral-50 hover:bg-neutral-700 focus:outline-none focus:ring-4 focus:ring-neutral-300 disabled:opacity-50 dark:bg-neutral-200 dark:text-black dark:hover:bg-neutral-400 dark:focus:ring-neutral-300"
                        >
                            {isSubmitting ? 'Submitting...' : 'Add review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
