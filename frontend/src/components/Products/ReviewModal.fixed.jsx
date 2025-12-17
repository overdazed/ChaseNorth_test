import { useState, useRef, useEffect } from 'react';
import { createReview } from '../../services/reviewService';
import { toast } from 'react-toastify';
import xMarkIcon from '../../assets/x-mark.svg';
import CustomSelect from '../Common/CustomSelect';
import { supabase } from '../../services/superbaseClient';

const ReviewModal = ({ isOpen, onClose, productName, productId, onReviewSubmit, user, sizes = [] }) => {
    // State hooks at the top level
    const [isUploading, setIsUploading] = useState(false);
    const [rating, setRating] = useState(0);
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
            widthRating: 0,
            lengthRating: 0
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

        // If no session, try to sign in anonymously
        if (!session) {
            console.log('No active session, attempting anonymous sign-in...');
            const { data: { user }, error: signInError } = await supabase.auth.signInAnonymously();
            
            if (signInError || !user) {
                console.error('Anonymous sign-in failed:', signInError);
                throw new Error('Could not authenticate. Please refresh the page and try again.');
            }
            
            console.log('Anonymous user created:', user.id);
            return { user };
        }

        console.log('Using existing session for user:', session.user.id);
        return session;
    };

    // ... rest of your component code ...

    // Placeholder for the JSX return
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/65 p-4 select-none overflow-y-auto">
            {/* Your modal JSX here */}
            <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-lg dark:bg-gray-800 my-8 max-h-[calc(100vh-4rem)] flex flex-col">
                {/* Modal content */}
                <div className="flex-shrink-0 flex items-center justify-between rounded-t border-b border-gray-200 p-4 dark:border-gray-700 md:p-5">
                    <div>
                        <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                            Add a review for:
                        </h3>
                        <p className="font-medium text-primary-700 dark:text-neutral-50">{productName}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="group ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200"
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
                    {/* Your form fields here */}
                    <div className="mb-4">
                        <h4 className="text-lg font-medium mb-2">Review Form</h4>
                        {/* Add your form fields here */}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
