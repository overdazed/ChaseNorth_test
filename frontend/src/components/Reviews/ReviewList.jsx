import { useState, useEffect } from 'react';
import { getProductReviews, markHelpful, deleteReview } from '../../services/reviewService';
import { toast } from 'react-toastify';
import { FaThumbsUp, FaEdit, FaTrash } from 'react-icons/fa';
import EditReviewModal from './EditReviewModal.jsx';
import DeleteConfirmationModal from '../Common/DeleteConfirmationModal';
import { getWidthNumericValue, getWidthDisplayText } from '../../utils/reviewUtils';

// Helper function to check if it's daytime (between 6 AM and 6 PM)
const isDaytime = () => {
  const hours = new Date().getHours();
  return hours >= 6 && hours < 18;
};

// Alias for backward compatibility
const getWidthDisplay = getWidthDisplayText;

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
  const [isMarkingHelpful, setIsMarkingHelpful] = useState(false);

  const handleHelpful = async (rawReviewId) => {
    if (!rawReviewId || isMarkingHelpful) return;
    if (!currentUser?._id) {
      toast.error('You must be logged in to vote');
      return;
    }

    const reviewId = String(rawReviewId); // normalize
    setIsMarkingHelpful(true);

    // Determine current local vote state atomically
    let alreadyVoted;
    setUserHelpfulVotes(prev => {
      alreadyVoted = prev.has(reviewId);
      return prev;
    });

    // OPTIMISTIC UI UPDATE
    setHelpfulVotes(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + (alreadyVoted ? -1 : 1),
    }));

    setUserHelpfulVotes(prev => {
      const next = new Set(prev);
      if (alreadyVoted) next.delete(reviewId);
      else next.add(reviewId);
      return next;
    });

    console.log('[helpful] optimistic ->', { reviewId, alreadyVoted });

    try {
      const response = await markHelpful(reviewId);
      console.log('[helpful] server response ->', response?.data);

      const serverHelpful = response?.data?.helpfulVotes;
      const serverHasVoted = response?.data?.hasVoted;

      // If server returns a numeric helpfulVotes, accept it only if plausible.
      if (typeof serverHelpful === 'number') {
        // If serverHelpful differs wildly (not +/-1), we still accept it — it's authoritative.
        setHelpfulVotes(prev => ({
          ...prev,
          [reviewId]: serverHelpful,
        }));
      }

      if (typeof serverHasVoted === 'boolean') {
        setUserHelpfulVotes(prev => {
          const next = new Set(prev);
          if (serverHasVoted) next.add(reviewId);
          else next.delete(reviewId);
          return next;
        });
      }

      // Update review object in list to keep things consistent
      setReviews(prev =>
          prev.map(r => {
            const id = String(r._id || r.id);
            if (id !== reviewId) return r;
            return {
              ...r,
              helpfulVotes: typeof serverHelpful === 'number' ? serverHelpful : (r.helpfulVotes || 0) + (alreadyVoted ? -1 : 1),
              // update helpfulVotesBy conservatively:
              helpfulVotesBy: serverHasVoted
                  ? Array.from(new Set([...(r.helpfulVotesBy || []), currentUser._id]))
                  : (r.helpfulVotesBy || []).filter(id => String(id) !== String(currentUser._id)),
            };
          })
      );
    } catch (err) {
      console.error('[helpful] error', err);
      toast.error(err?.response?.data?.message || err.message || 'Failed to toggle helpful');

      // ROLLBACK optimistic change
      setHelpfulVotes(prev => ({
        ...prev,
        [reviewId]: Math.max(0, (prev[reviewId] || 0) + (alreadyVoted ? 1 : -1)),
      }));

      setUserHelpfulVotes(prev => {
        const next = new Set(prev);
        if (alreadyVoted) next.add(reviewId);
        else next.delete(reviewId);
        return next;
      });
    } finally {
      setIsMarkingHelpful(false);
    }
  };


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
      
      const reviews = data.reviews || [];
      setReviews(reviews);
      setTotalPages(data.pages || 1);

      const votes = {};
      const userVotes = new Set();

      reviews.forEach(review => {
        const reviewId = review._id || review.id;
        if (reviewId) {
          // Set helpful votes count from the review data
          votes[reviewId] = review.helpfulVotes || 0;
          
          // Check if current user has voted for this review
          if (currentUser?._id && review.helpfulVotesBy) {
            const userId = currentUser._id.toString();
            const hasVoted = review.helpfulVotesBy.some(id => {
              const idStr = id.toString();
              const idToCompare = typeof id === 'object' && id._id ? id._id.toString() : idStr;
              return idToCompare === userId;
            });
            
            if (hasVoted) {
              userVotes.add(reviewId);
            }
          }
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

  const handleEditReview = (review) => {
    if (!review) {
      console.error('No review provided to edit');
      return;
    }

    // Ensure we have all necessary review data
    const reviewToEdit = {
      ...review,
      _id: review._id || review.id,
      id: review.id || review._id,
      // Ensure all rating fields have proper values
      rating: review.rating || 0,
      qualityRating: review.qualityRating || 5,
      designRating: review.designRating || 5,
      fitRating: review.fitRating || 5,
      // width: review.width || 3,
      // length: review.length || 3,
      // Add any other fields that might be needed
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

      // Update the UI by removing the deleted review
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

    // Handle both review object and direct ID
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
                // width: updatedReview.width ? getWidthDisplay(updatedReview.width) : review.width,
                // length: updatedReview.length ? getLengthDisplay(updatedReview.length) : review.length,
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
        <div className="text-center py-8 text-neutral-500">
          No reviews yet. Be the first to review this product!
        </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="border-b border-neutral-200 pb-6 last:border-0">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <h4 className="font-semibold text-lg mr-3 text-neutral-950 dark:text-neutral-50">
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
                      className={`text-lg ${i < Math.round(review.rating) ? 'text-yellow-400' : 'text-neutral-300'}`}
                      aria-label={`${i + 1} out of 5 stars`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                  <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400 mb-2">
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

                  {/* User Details Section */}
                  <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-500 mb-2">
                    <div className="flex items-center">
                      <span className="font-medium">Weight:</span>
                      <span className={`ml-1 ${review.weight === null || review.weight === undefined ? 'text-neutral-400 italic' : ''}`}>
                        {review.weight !== null && review.weight !== undefined ? `${review.weight} kg` : 'Not specified'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Height:</span>
                      <span className={`ml-1 ${review.height === null || review.height === undefined ? 'text-neutral-400 italic' : ''}`}>
                        {review.height !== null && review.height !== undefined ? `${review.height} cm` : 'Not specified'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Size:</span>
                      <span className={`ml-1 ${!review.size ? 'text-neutral-400 italic' : ''}`}>
                        {review.size || 'Not specified'}
                      </span>
                    </div>
                  </div>

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 my-3">
                      {review.images.map((img, idx) => {
                        if (!img) return null;

                        // Handle different image URL formats
                        const imageUrl = img.url || img.path || '';
                        const fullImageUrl = imageUrl.startsWith('http')
                          ? imageUrl
                          : imageUrl.startsWith('//')
                            ? `https:${imageUrl}`
                            : `https://${imageUrl}`;

                        return (
                          <div
                            key={`${review._id}-img-${idx}`}
                            className="relative group w-20 h-20 rounded-md overflow-hidden bg-transparent"
                          >
                            <div className="w-full h-full flex items-center justify-center bg-transparent">
                              <img
                                src={fullImageUrl}
                                alt={`Review image ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onClick={() => window.open(fullImageUrl, '_blank')}
                                onError={(e) => {
                                  console.error('Error loading review image:', {
                                    imageUrl: fullImageUrl,
                                    imageData: img,
                                    error: e
                                  });
                                  e.target.src = 'https://via.placeholder.com/80x80?text=Image+Error';
                                }}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain'
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Review Comment */}
                  {review.comment && (
                    <div className="text-neutral-800 dark:text-neutral-200">
                      <p>{review.comment}</p>
                    </div>
                  )}

                  {/* Review Meta */}
                  <div className="text-sm text-neutral-500 dark:text-neutral-500 mt-3 flex flex-wrap items-center gap-3">
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
                      disabled={isMarkingHelpful || 
                              userHelpfulVotes.has(review._id || review.id) || 
                              (currentUser && (String(review.user?._id) === String(currentUser._id) ||
                                  String(review.user?._id)?.toString() === String(currentUser._id)?.toString() ||
                                             String(review.user) === String(currentUser._id)))}
                      title={currentUser && (String(review.user?._id) === String(currentUser._id) ||
                          String(review.user?._id)?.toString() === String(currentUser._id)?.toString() ||
                                           String(review.user) === String(currentUser._id))
                             ? "You can't mark your own review as helpful"
                             : userHelpfulVotes.has(String(review._id || review.id))
                              ? 'You found this helpful'
                               : 'Mark as helpful'}
                      className={`flex items-center gap-1 text-sm ${userHelpfulVotes.has(review._id || review.id) ? 'text-blue-600' : 'text-neutral-600 dark:text-neutral-500 hover:text-blue-600 disabled:opacity-50'} transition-colors`}
                    >
                      <FaThumbsUp className="w-3.5 h-3.5" />
                      <span>{helpfulVotes[review._id || review.id] || 0}</span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                {currentUser && String(currentUser._id) === String(review.user?._id) && (
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditReview(review);
                      }}
                      className="text-neutral-500 hover:text-blue-600 transition-colors p-1"
                      title="Edit review"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReview(review);
                      }}
                      className="text-neutral-500 hover:text-red-600 transition-colors p-1"
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
        
        {/* Modals */}
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
          productName={productName}
        />
      </>
    );
  };

export default ReviewList;