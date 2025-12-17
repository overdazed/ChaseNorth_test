import { useState, useEffect } from 'react';
import { getProductReviews, markHelpful, deleteReview } from '../../services/reviewService';
import { toast } from 'react-toastify';
import { FaThumbsUp, FaEdit, FaTrash } from 'react-icons/fa';
import EditReviewModal from './EditReviewModal.jsx';
import DeleteConfirmationModal from '../Common/DeleteConfirmationModal';

// Helper function to check if it's daytime (between 6 AM and 6 PM)
const isDaytime = () => {
  const hours = new Date().getHours();
  return hours >= 6 && hours < 18;
};

// Helper functions to convert numeric width/length to display text
const getWidthDisplay = (width) => {
  if (typeof width === 'string') return width;
  const numWidth = Number(width);
  switch(numWidth) {
    case 1: return 'Too Tight';
    case 2: return 'Slightly Tight';
    case 3: return 'Perfect';
    case 4: return 'Slightly Loose';
    case 5: return 'Too Loose';
    default: return 'Perfect';
  }
};

const getLengthDisplay = (length) => {
  if (typeof length === 'string') return length;
  switch(Number(length)) {
    case 1: return 'Too Short';
    case 2: return 'Slightly Short';
    case 3: return 'Perfect';
    case 4: return 'Slightly Long';
    case 5: return 'Too Long';
    default: return 'Perfect';
  }
};

const getWidthNumericValue = (width) => {
  if (typeof width === 'number') return width;
  if (typeof width === 'string') {
    const lowerWidth = width.toLowerCase();
    if (lowerWidth.includes('too tight') || lowerWidth === 'too-tight') return 1;
    if (lowerWidth.includes('slightly tight') || lowerWidth === 'slightly-tight') return 2;
    if (lowerWidth === 'perfect') return 3;
    if (lowerWidth.includes('slightly loose') || lowerWidth === 'slightly-loose') return 4;
    if (lowerWidth.includes('too loose') || lowerWidth === 'too-loose') return 5;
  }
  return 3; // Default to 'Perfect'
};

const ReviewList = ({ productId, productName, refreshKey, currentUser, onReviewAction }) => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [helpfulVotes, setHelpfulVotes] = useState({});
  const [userHelpfulVotes, setUserHelpfulVotes] = useState(new Set());
  const [editingReview, setEditingReview] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // Debug: Log review data when reviews change
  useEffect(() => {
    if (reviews.length > 0) {
      console.log('Review data:', reviews);
      reviews.forEach((review, index) => {
        console.log(`Review ${index + 1} [${review._id}]:`, {
          hasWeight: 'weight' in review,
          weight: review.weight,
          hasHeight: 'height' in review,
          height: review.height,
          hasSize: 'size' in review,
          size: review.size,
          allKeys: Object.keys(review)
        });
      });
    } else {
      console.log('No reviews to display');
    }
  }, [reviews]);

  useEffect(() => {
    const loadReviews = async () => {
      await fetchReviews();
    };
    loadReviews();
  }, [page, productId, refreshKey]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getProductReviews(productId, page);
      console.log('Fetched reviews:', data);
      setReviews(data.reviews || []);
      setTotalPages(data.pages || 1);

      const votes = {};
      const userVotes = new Set();

      (data.reviews || []).forEach(review => {
        votes[review._id] = review.helpfulVotes || 0;
        if (currentUser && review.helpfulVotesBy &&
            review.helpfulVotesBy.some(id => id === currentUser._id || (id._id ? id._id.toString() : id.toString()) === currentUser._id)) {
          userVotes.add(review._id);
        }
      });

      setHelpfulVotes(votes);
      setUserHelpfulVotes(userVotes);

      return data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error(error.message || 'Error loading reviews');
      return { reviews: [], pages: 1 };
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    try {
      const isCurrentlyHelpful = userHelpfulVotes.has(reviewId);
      const newHelpfulState = !isCurrentlyHelpful;

      setHelpfulVotes(prev => ({
        ...prev,
        [reviewId]: Math.max(0, (prev[reviewId] || 0) + (newHelpfulState ? 1 : -1))
      }));

      setUserHelpfulVotes(prev => {
        const newSet = new Set(prev);
        if (newHelpfulState) {
          newSet.add(reviewId);
        } else {
          newSet.delete(reviewId);
        }
        return newSet;
      });

      const response = await markHelpful(reviewId);

      if (response && response.data) {
        const serverVotes = response.data.helpfulVotes;
        const currentVotes = helpfulVotes[reviewId] || 0;

        if (serverVotes !== currentVotes) {
          setHelpfulVotes(prev => ({
            ...prev,
            [reviewId]: serverVotes
          }));
        }

        if (response.data.hasVoted !== undefined) {
          setUserHelpfulVotes(prev => {
            const newSet = new Set(prev);
            if (response.data.hasVoted) {
              newSet.add(reviewId);
            } else {
              newSet.delete(reviewId);
            }
            return newSet;
          });
        }
      }

      toast.success(newHelpfulState ? 'Thank you for your feedback!' : 'Removed your helpful vote');
      if (onReviewAction) onReviewAction();

    } catch (error) {
      setHelpfulVotes(prev => ({
        ...prev,
        [reviewId]: (prev[reviewId] || 0) + (userHelpfulVotes.has(reviewId) ? 1 : -1)
      }));

      setUserHelpfulVotes(prev => {
        const newSet = new Set(prev);
        if (userHelpfulVotes.has(reviewId)) {
          newSet.delete(reviewId);
        } else {
          newSet.add(reviewId);
        }
        return newSet;
      });

      const errorMessage = error.response?.data?.message || error.message || 'Error updating helpful vote';
      toast.error(errorMessage);
    }
  };

  const handleEditReview = (review) => {
    if (!review) {
      console.error('No review provided to edit');
      return;
    }

    const reviewToEdit = {
      ...review,
      _id: review._id || review.id,
      id: review.id || review._id,
      rating: review.rating || 0,
      qualityRating: review.qualityRating || 5,
      designRating: review.designRating || 5,
      fitRating: review.fitRating || 5,
      width: review.width || 3,
      length: review.length || 3,
      title: review.title || '',
      comment: review.comment || ''
    };

    console.log('Editing review:', reviewToEdit);
    setEditingReview(reviewToEdit);
    setIsEditModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) {
      console.error('No review ID to delete');
      toast.error('Error: No review selected for deletion');
      return;
    }

    try {
      console.log('Deleting review with ID:', reviewToDelete);
      await deleteReview(reviewToDelete);

      setReviews(prevReviews =>
        prevReviews.filter(r => r._id !== reviewToDelete && r.id !== reviewToDelete)
      );

      toast.success('Review deleted successfully');

      if (typeof onReviewAction === 'function') {
        await onReviewAction();
      }

    } catch (error) {
      console.error('Error deleting review:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete review';
      toast.error(errorMessage);
    } finally {
      setDeleteConfirmationOpen(false);
      setReviewToDelete(null);
    }
  };

  const handleDeleteReview = (review) => {
    console.log('Preparing to delete review:', review);

    const reviewId = review?._id || review?.id || review;

    if (!reviewId) {
      console.error('No valid review ID found for deletion');
      toast.error('Error: Could not identify the review to delete');
      return;
    }

    console.log('Setting review to delete:', reviewId);
    setReviewToDelete(reviewId);
    setDeleteConfirmationOpen(true);
  };

  const cancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setReviewToDelete(null);
  };

  const handleReviewUpdated = (updatedReview) => {
    try {
      setReviews(prevReviews =>
        prevReviews.map(review => {
          if (review._id === updatedReview._id) {
            return {
              ...review,
              title: updatedReview.title,
              comment: updatedReview.comment,
              rating: updatedReview.rating,
              qualityRating: updatedReview.qualityRating,
              designRating: updatedReview.designRating,
              fitRating: updatedReview.fitRating,
              width: updatedReview.width ? getWidthDisplay(updatedReview.width) : review.width,
              length: updatedReview.length ? getLengthDisplay(updatedReview.length) : review.length,
              weight: updatedReview.weight,
              height: updatedReview.height,
              size: updatedReview.size,
              updatedAt: updatedReview.updatedAt || new Date().toISOString()
            };
          }
          return review;
        })
      );
      toast.success('Review updated successfully');
      fetchReviews().catch(console.error);
      if (onReviewAction) onReviewAction();
    } catch (error) {
      console.error('Error in handleReviewUpdated:', error);
      toast.error('Failed to update review. Please try again.');
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No reviews yet. Be the first to review this product!
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <h4 className={`font-semibold text-lg mr-3 ${isDaytime() ? 'text-neutral-950' : 'text-neutral-50'}`}>
                    {review.title}
                  </h4>
                  {review.status === 'pending' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending Approval
                    </span>
                  )}
                </div>
                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={`${review._id}-star-${i}`}
                      className={`text-lg ${i < Math.round(review.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      aria-label={`${i + 1} out of 5 stars`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center">
                    <span className="font-medium">Quality:</span>
                    <span className="ml-1">{review.qualityRating || 5}/5</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Design:</span>
                    <span className="ml-1">{review.designRating || 5}/5</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Fit:</span>
                    <span className="ml-1">{review.fitRating || 5}/5</span>
                  </div>
                </div>

                {['weight', 'height', 'size'].some(field => field in review) && (
                  <div key={`${review._id}-user-details`} className="mb-3">
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {'weight' in review && (
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Weight:</span>
                          <span className={!review.weight ? 'text-gray-400 italic' : ''}>
                            {review.weight ? `${review.weight}kg` : 'Not specified'}
                          </span>
                        </div>
                      )}
                      {'height' in review && (
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Height:</span>
                          <span className={!review.height ? 'text-gray-400 italic' : ''}>
                            {review.height ? `${review.height}cm` : 'Not specified'}
                          </span>
                        </div>
                      )}
                      {'size' in review && (
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Size:</span>
                          <span className={!review.size ? 'text-gray-400 italic' : ''}>
                            {review.size || 'Not specified'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {review.comment && (
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                )}

                {review.images && review.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {review.images.map((img, idx) => (
                      <div key={idx} className="w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                        <img
                          src={img.url}
                          alt={img.altText || 'Review image'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-sm text-gray-500 mt-3 flex flex-wrap items-center gap-3">
                  <span>
                    By {review.user?.name || review.userName || 'Anonymous'}&nbsp;•&nbsp;{review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Recently'}
                  </span>
                  {review.verifiedPurchase && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                      Verified Purchase
                    </span>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHelpful(review._id || review.id);
                    }}
                    className={`flex items-center gap-1 text-sm ${userHelpfulVotes.has(review._id || review.id) ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'} transition-colors`}
                    title={userHelpfulVotes.has(review._id || review.id) ? 'Remove helpful vote' : 'Mark as helpful'}
                  >
                    <FaThumbsUp className="w-3.5 h-3.5" />
                    <span>{helpfulVotes[review._id || review.id] || 0}</span>
                  </button>
                </div>
              </div>

              {currentUser && currentUser._id === review.user?._id && (
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditReview(review);
                    }}
                    className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                    title="Edit review"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteReview(review);
                    }}
                    className="text-gray-500 hover:text-red-600 transition-colors p-1"
                    title="Delete review"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <DeleteConfirmationModal
        isOpen={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Review?"
        message="Are you sure you want to delete this review? This action cannot be undone."
      />

      <EditReviewModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingReview(null);
        }}
        review={editingReview}
        onReviewUpdated={handleReviewUpdated}
        productId={productId}
      />
    </>
  );
};

export default ReviewList;
