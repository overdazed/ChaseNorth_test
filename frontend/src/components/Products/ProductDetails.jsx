import React, { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import ProductGrid from "./ProductGrid.jsx";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { Lens } from "../ui/lens";
import { getColorHex } from "@/utils/colorUtils";
import { useDispatch, useSelector } from "react-redux";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/Accordion";
import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productsSlice.js";
import { addToCart } from "../../redux/slices/cartSlice.js";
import { getProductReviews } from "../../services/reviewService";
import HeartIcon from "../ui/HeartIcon";
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/shadcn/carousel';
import { Button } from '../ui/shadcn/button';
import PartialStarRating from '../ui/PartialStarRating';
import ReviewModal from './ReviewModal';
import ReviewList from '../Reviews/ReviewList';
import { isDaytime, isProductNew } from "../../utils/productUtils";
import Breadcrumbs from "@/components/Common/Breadcrumbs.jsx";
import xMarkIcon from "@/assets/x-mark.svg";
import sizeShirt from "@/assets/size-shirt.svg"

// Helper function to check if it's daytime (between 6 AM and 6 PM)
// const isDaytime = () => {
//     const hours = new Date().getHours();
//     return hours >= 6 && hours < 18;
// };

// create a dummy product to work with
// const selectedProduct = {
//     name: "Stylish Jacket",
//     price: 120,
//     originalPrice: 150,
//     description: "A comfortable and stylish jacket perfect for any occasion.",
//     brand: "FashionBrand",
//     material: "Leather",
//     sizes: ["S", "M", "L", "XL"],
//     colors: ["Red", "Black"],
//     images: [
//         {
//             url:"https://picsum.photos/500/600?random=1",
//             altText: "Stylish Jacket 1",
//         },
//         {
//             url:"https://picsum.photos/500/600?random=2",
//             altText: "Stylish Jacket 2",
//         },
//     ]
//     // add more properties as needed
// }
//
// // similarProducts array
// const similarProducts = [
//     // add more products as needed
//     {
//         _id: "1",
//         name: "Product 1",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=3",
//                 altText: "Product 1",
//             },
//         ]
//     },
//     {
//         _id: "2",
//         name: "Product 2",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=4",
//                 altText: "Product 1",
//             },
//         ]
//     },
//     {
//         _id: "3",
//         name: "Product 3",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=5",
//                 altText: "Product 1",
//             },
//         ]
//     },
//     {
//         _id: "4",
//         name: "Product 4",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=6",
//                 altText: "Product 1",
//             },
//         ]
//     },
// ]


// pass productId and showRecommendations as props
const ProductDetails = ({ productId: propProductId, showRecommendations = true }) => {
    // Get the product ID from URL parameters if not passed as a prop
    const { id: urlProductId } = useParams();
    // Use the prop productId if available, otherwise use the one from URL
    const productId = propProductId || urlProductId;

    // State to track if it's day or night
    const [isDay, setIsDay] = useState(() => {
        if (typeof window !== 'undefined') {
            return !document.documentElement.classList.contains('dark');
        }
        return true;
    });
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [showSizeChart, setShowSizeChart] = useState(false);

    // Debug: Log the product ID source
    useEffect(() => {
        console.log('Product ID source:', {
            propProductId,
            urlProductId,
            finalProductId: productId
        });
    }, [propProductId, urlProductId, productId]);

    // Review form state
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState({
        title: '',
        comment: '',
        name: '',
        email: ''
    });

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        try {
            // In a real implementation, you would submit the review to your API here
            // For example:
            // await submitReview({
            //     productId,
            //     rating,
            //     ...review
            // });

            // For now, we'll just log it
            console.log('Submitting review:', { productId, rating, ...review });

            // Show success message
            toast.success('Thank you for your review!');

            // Close the modal after submission
            setShowReviewForm(false);

            // Reset form
            setRating(0);
            setReview({
                title: '',
                comment: '',
                name: '',
                email: ''
            });

            // Refresh reviews and product details
            await handleReviewAction();

        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review. Please try again.');
        }
    };

    // Update theme based on dark mode class
    useEffect(() => {
        const handleThemeChange = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setIsDay(!isDark);
        };

        // Initial check
        handleThemeChange();

        // Listen for theme changes
        window.addEventListener('themeChange', handleThemeChange);

        // Clean up
        return () => {
            window.removeEventListener('themeChange', handleThemeChange);
        };
    }, []);

    // Theme classes
    const themeClasses = {
        background: isDay ? 'bg-neutral-50' : 'bg-neutral-950',
        text: isDay ? 'text-neutral-950' : 'text-neutral-50',
        textMuted: isDay ? 'text-neutral-600' : 'text-neutral-400',
        border: isDay ? 'border-neutral-200' : 'border-neutral-800',
        button: {
            background: isDay ? 'bg-neutral-950 hover:bg-neutral-800' : 'bg-neutral-50 hover:bg-neutral-100',
            text: isDay ? 'text-neutral-50' : 'text-neutral-950',
        },
        card: isDay ? 'bg-white' : 'bg-neutral-900',
        input: isDay
            ? 'bg-white border-neutral-300 focus:border-neutral-500'
            : 'bg-neutral-800 border-neutral-700 focus:border-neutral-500 text-neutral-50',
        select: isDay
            ? 'bg-white border-neutral-300 focus:border-neutral-500'
            : 'bg-neutral-800 border-neutral-700 focus:border-neutral-500 text-neutral-50',
        characteristics: {
            text: isDay ? 'text-neutral-800' : 'text-neutral-200',
            value: isDay ? 'text-neutral-950' : 'text-neutral-50',
        },
        quantity: isDay ? 'text-neutral-950' : 'text-neutral-50',
        divider: isDay ? 'border-neutral-200' : 'border-neutral-800',
        accordion: {
            background: isDay ? 'bg-white' : 'bg-neutral-900',
            text: isDay ? 'text-neutral-950' : 'text-neutral-50',
            hover: isDay ? 'hover:bg-neutral-50' : 'hover:bg-neutral-800',
        },
    };

    // get the id from used params
    const {id} = useParams()

    // make use of useDispatch hook to dispatch actions
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    // Check if we were redirected here to show the review modal
    useEffect(() => {
        if (location.state?.showReviewModal) {
            setShowReviewModal(true);
            // Clear the state to prevent the modal from reopening on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Structure selected product
    const { selectedProduct, loading, error, similarProducts } = useSelector(
        (state) => state.products
    );

    // State for reviews
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [refreshReviews, setRefreshReviews] = useState(0); // Add a refresh trigger
    const [selectedStarFilter, setSelectedStarFilter] = useState(null);
    const [showStarDropdown, setShowStarDropdown] = useState(false);

    // Fetch reviews when product changes or when refresh is triggered
    const fetchReviews = useCallback(async () => {
        if (!selectedProduct?._id) return;

        try {
            setReviewsLoading(true);
            const data = await getProductReviews(selectedProduct._id, 1, 100);
            const hasReviews = data.reviews && data.reviews.length > 0;

            // If no reviews but product shows reviews, fix the product data
            if (!hasReviews && selectedProduct.numReviews > 0) {
                dispatch({
                    type: 'products/fetchProductDetails/fulfilled',
                    payload: {
                        ...selectedProduct,
                        rating: 0,
                        numReviews: 0,
                        ratings: {
                            quality: 0,
                            design: 0,
                            fit: 0
                        }
                    }
                });
            }

            setReviews(data.reviews || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setReviewsLoading(false);
        }
    }, [selectedProduct, dispatch]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews, refreshReviews]);

    // Function to trigger a refresh of reviews and product details
    const handleReviewAction = async () => {
        try {
            // First, refresh the product details to get the latest data
            await dispatch(fetchProductDetails(productId));

            // Then refresh the reviews
            const reviewsData = await getProductReviews(productId, 1, 100);
            const hasReviews = reviewsData.reviews && reviewsData.reviews.length > 0;

            // If there are no reviews, ensure the product shows 0 rating
            if (!hasReviews) {
                // Force update the local state to show 0 rating
                dispatch({
                    type: 'products/fetchProductDetails/fulfilled',
                    payload: {
                        ...selectedProduct,
                        rating: 0,
                        numReviews: 0,
                        ratings: {
                            quality: 0,
                            design: 0,
                            fit: 0
                        }
                    }
                });
            }

            setReviews(reviewsData.reviews || []);
            setRefreshReviews(prev => prev + 1);
        } catch (error) {
            console.error('Error refreshing data:', error);
            toast.error('Failed to refresh data');
        }
    };

    // Get the userId and guestId
    const { user, guestId } = useSelector((state) => ({
        user: state.auth?.user,
        guestId: state.auth?.guestId
    }));
    // Then under [isButtonDisabled] > create constant productFetch

    // change image when you click on a thumbnail
    // const [mainImage, setMainImage] = useState("");
    const [mainImage, setMainImage] = useState(null);

    // declare a few state variables that needs to be passed, when the user clicks the "add to cart" button
    // const [selectedSize, setSelectedSize] = useState("");
    const [selectedSize, setSelectedSize] = useState(null);

    // const [selectedColor, setSelectedColor] = useState("");
    const [selectedColor, setSelectedColor] = useState(null);

    const [quantity, setQuantity] = useState(1);

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    // Log similarProducts for debugging
    useEffect(() => {
        console.log('Similar Products:', similarProducts);
    }, [similarProducts]);

    // Use the productId we've determined
    const productFetchId = productId;

    // Reset quantity, selectedSize and selectedColor when product changes
    useEffect(() => {
        setQuantity(1);
        setSelectedSize(null);
        setSelectedColor(null);
    }, [productId]);

    // Update recently viewed products when a product is selected
    useEffect(() => {
        if (selectedProduct) {
            const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            // Remove current product if it exists in the list
            const filtered = viewed.filter(p => p._id !== selectedProduct._id);
            // Add current product to the beginning and keep up to 5 items
            const updated = [selectedProduct, ...filtered].slice(0, 9);
            setRecentlyViewed(updated);
            localStorage.setItem('recentlyViewed', JSON.stringify(updated));
        }
    }, [selectedProduct]);

    // Load recently viewed products on component mount
    useEffect(() => {
        const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        setRecentlyViewed(viewed);
    }, []);

    useEffect(() => {
        // if the product id is not null
        if (productFetchId) {
            // then dispatch the fetchProductById action
            dispatch(fetchProductDetails(productFetchId));
            dispatch(fetchSimilarProducts({id: productFetchId}));
        }
    }, [dispatch, productFetchId]);

    useEffect(() => {
        // if selected Product has one or more images
        if (selectedProduct?.images?.length > 0) {
            // set the main image to the first image
            setMainImage(selectedProduct.images[0].url);
        }
    }, [selectedProduct]);

    const handleQuantityChange = (action) => {
        // if the action is "plus", increase the quantity
        if (action === "plus") setQuantity((prev) => prev + 1);
        // if the action is "minus", decrease the quantity (we don't want to have negative quantity)
        if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
    }

    // declare add to cart function
    const handleAddToCart = () => {
        // if the user has not selected a size and a color
        if (!selectedSize || !selectedColor) {
            // display an error message
            toast.error("Please select a size and color before adding to cart.", {duration: 2000});
            return;
        }
        // disable the button
        setIsButtonDisabled(true);
        // to simulate the adding to cart functionality
        //         setTimeout(() => {
        //             // display a success message
        //             toast.success("Product added to cart!", {
        //                 duration: 2000
        //             });
        //             // enable the button
        //             // button not disabled, because we need to add the disabled attribute
        //             setIsButtonDisabled(false);
        //         }, 500);
        // }

        dispatch(
            addToCart({
                productId: productFetchId,
                quantity,
                size: selectedSize,
                color: selectedColor,
                guestId,
                userId: user?._id,
            })
        )
            .then(() => {
                // display a success message
                toast.success("Product added to cart!", {
                    duration: 1250,
                });
                // enable the button
                setIsButtonDisabled(false);
            })
            .finally(() => {
                setIsButtonDisabled(false);
            })
    }

    // Check for loading condition
    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${themeClasses.background}`}>
                <p className={themeClasses.text}>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${themeClasses.background}`}>
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }


    return (
        <div className={`min-h-screen py-20 px-4 transition-colors duration-300 ${themeClasses.background} ${themeClasses.text} flex flex-col items-center justify-center`}>
            <div className="max-w-6xl ml-[14px] w-full">
                {selectedProduct ? (
                    <div className={`relative ${themeClasses.background} ${themeClasses.text}`}>
                        <div className="pl-1 pr-4">
                            <div className="flex flex-col md:flex-row">
                                {/* Main Image */}
                                <div className="w-full md:w-[calc(80%-2rem)] -mt-5 relative scale-95 origin-top-left">
                                    <div className="pl-4 md:pl-7 md:pr-5">
                                        <div className={`relative w-full ${isDay ? 'bg-neutral-50' : 'bg-neutral-900'} overflow-visible aspect-[4/5] scale-95`}>
                                            <div className="absolute inset-0 overflow-hidden">
                                                <Lens
                                                    zoomFactor={2.5}
                                                    lensSize={200}
                                                    className="w-full h-full"
                                                >
                                                    <div className="relative w-full h-full">
                                                        <img
                                                            src={mainImage}
                                                            alt="Main Product"
                                                            className="w-full h-full object-cover"
                                                            style={{ aspectRatio: '4/5' }}
                                                        />
                                                        {selectedProduct?.createdAt && isProductNew(selectedProduct.createdAt) && (
                                                            <img
                                                                src="/new-star.svg"
                                                                alt="New"
                                                                className="absolute -top-2 -left-2 w-20 h-20 md:w-16 md:h-16 z-10 transition-all duration-200"
                                                            />
                                                        )}
                                                    </div>
                                                </Lens>
                                            </div>
                                        </div>

                                        {/* Recently Viewed Section - Desktop (under main image) */}
                                        <div className="hidden md:block mt-4 w-full">
                                            <h3 className={`text-xl font-bold mb-4 ${themeClasses.text}`}>Recently Viewed</h3>
                                            <div className="relative max-w-lg mx-auto">
                                                <Carousel
                                                    opts={{
                                                        align: 'start',
                                                        loop: false,
                                                        skipSnaps: false,
                                                        dragFree: true,
                                                    }}
                                                >
                                                    <CarouselContent>
                                                        {recentlyViewed
                                                            .filter(product => product._id !== selectedProduct?._id)
                                                            .slice(0, 8) // Ensure we only show 8 products
                                                            .map((product) => (
                                                                <CarouselItem key={product._id} className="basis-1/3">
                                                                    <Link to={`/product/${product._id}`} className="group block scale-90">
                                                                        <div className="relative aspect-[3/4]  overflow-hidden">
                                                                            <img
                                                                                src={product.images?.[0]?.url || `https://picsum.photos/150/150?random=${product._id}`}
                                                                                alt={product.name || 'Product'}
                                                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 scale-100"
                                                                                onError={(e) => {
                                                                                    e.target.onerror = null;
                                                                                    e.target.src = 'https://placehold.co/150x150?text=Product';
                                                                                }}
                                                                            />
                                                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                                                                <p className={`text-[11px] font-medium text-neutral-50 truncate`}>
                                                                                    {product.name || 'Product'}
                                                                                </p>
                                                                                <p className={`text-[10px] text-neutral-400`}>
                                                                                    {product.price % 1 === 0 ? product.price.toFixed(0) : product.price?.toFixed(2) || '0'} €
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                </CarouselItem>
                                                            ))}
                                                    </CarouselContent>
                                                    <CarouselPrevious className={`-left-8 -translate-y-1/2 top-1/2 ${isDay ? 'text-neutral-950 hover:text-neutral-50' : 'text-neutral-50'}`} />
                                                    <CarouselNext className={`-right-8 -translate-y-1/2 top-1/2 ${isDay ? 'text-neutral-950 hover:text-neutral-50' : 'text-neutral-50'}`} />
                                                </Carousel>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile Thumbnails - Only shown on small screens */}
                                    <div className="md:hidden flex overflow-x-auto space-x-3 py-4 -mx-2 px-2">
                                        {selectedProduct.images?.map((image, index) => (
                                            <div key={index} className="flex-shrink-0 w-16" style={{ height: '80px' }}>
                                                <div className="w-full h-full">
                                                    <img
                                                        src={image.url}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className={`w-full h-full object-cover cursor-pointer ${
                                                            mainImage === image.url
                                                                ? 'ring-1 outline outline-0.5 ' + (isDay ? 'ring-black outline-black' : 'ring-neutral-50 outline-neutral-50 bg-neutral-50')
                                                                : ''
                                                        }`}
                                                        style={{ aspectRatio: '4/5' }}
                                                        onClick={() => setMainImage(image.url)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Recently Viewed Section - Moved under accordion
                                    {recentlyViewed.filter(p => p._id !== selectedProduct?._id).length > 0 && (
                                        <div className="mt-8">
                                            <h3 className={`text-lg font-medium mb-4 ${!isDay ? 'text-neutral-50' : 'text-neutral-950'}`}>Recently Viewed</h3>
                                            <div className="grid grid-cols-4 gap-4">
                                                {recentlyViewed
                                                    .filter(product => product._id !== selectedProduct?._id) // Exclude current product
                                                    .slice(0, 5) // Show max 5 items
                                                    .map((product) => (
                                                        <Link
                                                            to={`/product/${product._id}`}
                                                            key={product._id}
                                                            className="group block"
                                                        >
                                                        <div className="w-full aspect-square overflow-hidden rounded-lg bg-neutral-100 mb-2">
                                                            <div className="w-full h-full">
                                                                <img
                                                                    src={product.images?.[0]?.url || `https://picsum.photos/150/150?random=${product._id}`}
                                                                    alt={product.name || 'Product'}
                                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = 'https://placehold.co/150x150?text=Product';
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <p className={`text-sm font-medium ${!isDay ? 'text-neutral-50' : 'text-neutral-950'}`}>
                                                            {product.name || 'Product'}
                                                        </p>
                                                        <p className={`text-sm ${!isDay ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                                            ${product.price || '0.00'}
                                                        </p>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    */}
                                </div>

                                {/* Right Side - Image Gallery */}
                                <div className="hidden md:flex flex-col justify-center w-20 h-full">
                                    <div className="flex flex-col items-center space-y-4">
                                        {selectedProduct.images?.map((image, index) => (
                                            <div key={index} className="flex-shrink-0 w-14 md:w-14 lg:w-16" style={{ height: 'auto' }}>
                                                <div className="w-full">
                                                    <img
                                                        src={image.url}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className={`w-full object-cover cursor-pointer ${
                                                            mainImage === image.url
                                                                ? 'ring-1 outline outline-0.5 ' + (isDay ? 'ring-black outline-black' : 'ring-neutral-100 outline-neutral-100 bg-neutral-100')
                                                                : 'opacity-60 hover:opacity-100'
                                                        }`}
                                                        style={{ aspectRatio: '4/5', height: 'auto' }}
                                                        onClick={() => setMainImage(image.url)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Vertical Divider - Thin */}
                                <div className={`hidden md:block h-auto w-[0.5px] mx-8 ${isDay ? 'bg-neutral-200/80' : 'bg-neutral-600/80'}`}></div>

                                {/* Right Content */}
                                <div className="w-full md:w-1/2 pl-0 md:pl-6">
                                    <h1 className={`text-2xl md:text-3xl font-semibold mb-4 ${themeClasses.text}`}>
                                        {selectedProduct.name}
                                    </h1>

                                    {/* Product Description */}
                                    <div className="mb-6">
                                        {/*<p className={`mb-4 ${themeClasses.textMuted}`}>*/}
                                        {/*    {selectedProduct.description}*/}
                                        {/*</p>*/}

                                        {/* Price Section - Moved below description */}
                                        <div className="mt-4">
                                            {selectedProduct.originalPrice && (
                                                <p className={`text-lg mb-1 line-through ${themeClasses.textMuted}`}>
                                                    ${selectedProduct.originalPrice}
                                                </p>
                                            )}
                                            <p className={`text-3xl font-medium mb-2 ${themeClasses.text}`}>
                                                {selectedProduct.price} €
                                            </p>
                                            <div className="flex items-center">
                                                <div className="flex items-center">
                                                    <PartialStarRating rating={selectedProduct?.rating || 0} size="sm" />
                                                </div>
                                                <p className={`ms-2 text-sm font-bold ${isDay ? 'text-neutral-950' : 'text-neutral-50'}`}>
                                                    {selectedProduct?.rating?.toFixed(1) || '0.0'}
                                                </p>
                                                <span className="w-1 h-1 mx-1.5 bg-neutral-500 rounded-full dark:bg-neutral-400"></span>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        const reviewsSection = document.getElementById('reviews');
                                                        if (reviewsSection) {
                                                            reviewsSection.scrollIntoView({ behavior: 'smooth' });
                                                        }
                                                    }}
                                                    className="text-sm font-medium text-neutral-600 underline hover:no-underline dark:text-neutral-50 focus:outline-none"
                                                >
                                                    ({selectedProduct?.numReviews || 0})
                                                </button>
                                                {/*<button*/}
                                                {/*    type="button"*/}
                                                {/*    onClick={() => setShowReviewModal(true)}*/}
                                                {/*    className="ml-2 text-sm font-medium text-primary-700 hover:underline dark:text-primary-500"*/}
                                                {/*>*/}
                                                {/*    Write a review*/}
                                                {/*</button>*/}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Color Selection */}
                                    <div className={`${selectedColor ? 'mb-1' : 'mb-6'}`}>
                                        <p className={`mb-2 ${themeClasses.characteristics.text}`}>Color:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProduct.colors?.map((colorName) => (
                                                <div key={colorName} className="flex flex-col items-center">
                                                    <button
                                                        onClick={() => setSelectedColor(colorName)}
                                                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                                                            selectedColor === colorName
                                                                ? 'ring-1 ring-offset-1 ring-accent scale-110' 
                                                                : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-500'
                                                        }`}
                                                        style={{
                                                            backgroundColor: getColorHex(colorName),
                                                            border: getColorHex(colorName) === '#FFFFFF' || getColorHex(colorName) === '#FFF' ? '1px solid #E5E7EB' : 'none',
                                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                            // boxShadow: '0.25px 0.25px 0 0 rgba(255, 255, 255, 0.5)'
                                                            boxShadow: selectedColor === colorName ? '0 0 0 1px rgba(87, 17, 0, 1)' : '0.1px 0.1px 0 0 rgba(255, 255, 255, 0.5)'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1.1)';
                                                            e.currentTarget.style.boxShadow = isDay 
                                                                ? '0 0 8px rgba(0,0,0,0.25)'
                                                                : '0 0 8px rgba(255,255,255,0.75)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = selectedColor === colorName ? 'scale(1.1)' : 'scale(1)';
                                                            e.currentTarget.style.boxShadow = selectedColor === colorName ? '0 0 0 2px rgba(87, 17, 0, 1)' : 'none';
                                                        }}
                                                        aria-label={`Select color ${colorName}`}
                                                    />
                                                    {selectedColor === colorName && (
                                                        <span className="text-xs mt-1 text-center text-neutral-600 dark:text-neutral-300">
                                                            {colorName}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Size Selection */}
                                    <div className="mb-6">
                                        {/*<p className={`mb-2 ${themeClasses.characteristics.text}`}>Size:</p>*/}
                                        <div className="flex justify-between items-center mb-2">
                                            <p className={`mb-2 ${themeClasses.characteristics.text}`}>Size (<span>{selectedProduct.sizeChartData && selectedProduct.sizeChartData.length > 0 && (
                                                <button
                                                    onClick={() => setShowSizeChart(true)}
                                                    className="text-sm text-indigo-600 hover:no-underline underline dark:text-gray-400"
                                                >
                                                    Size Chart
                                                </button>
                                            )}</span>):</p>
                                        </div>
                                        <div className={`grid ${selectedProduct.sizes?.length === 4 ? 'grid-cols-4' : 'grid-cols-5'} gap-2 w-full`}>
                                            {selectedProduct.sizes?.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    // className={`w-full h-12 flex items-center justify-center rounded-full border border-[0.5px] transition-all ${
                                                    //     selectedSize === size
                                                    //         ? isDay
                                                    //             ? 'bg-black text-neutral-50 border-black'
                                                    //             : 'bg-white text-black border-white'
                                                    //         : isDay
                                                    //             ? 'bg-white border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100 text-black'
                                                    //             : 'bg-neutral-950 border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800 text-neutral-50'
                                                    // }`}
                                                    className={`w-full h-12 flex items-center justify-center rounded-full border border-[0.5px] transition-all ${
                                                        selectedSize === size
                                                            ? isDay
                                                                ? 'bg-black text-neutral-50 border-black'
                                                                : 'bg-white text-black border-black'
                                                            : isDay
                                                                ? 'bg-white border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100 text-black'
                                                                : 'bg-black border-black hover:border-black hover:bg-neutral-900 text-neutral-50'
                                                    }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quantity Selector */}
                                    <div className="mb-8">
                                        <p className={`mb-2 ${themeClasses.characteristics.text}`}>Quantity:</p>
                                        <div className={`flex items-center border-[0.5px] ${themeClasses.border} w-32 rounded-md overflow-hidden`}>
                                            <button
                                                className={`w-10 h-10 flex items-center justify-center border-r ${themeClasses.border} ${isDay ? 'hover:bg-neutral-100' : 'hover:bg-neutral-800'}`}
                                                onClick={() => handleQuantityChange('minus')}
                                            >
                                                <span className={themeClasses.text}>-</span>
                                            </button>
                                            <div className={`flex-1 text-center ${themeClasses.text}`}>
                                                {quantity}
                                            </div>
                                            <button
                                                className={`w-10 h-10 flex items-center justify-center border-l ${themeClasses.border} ${isDay ? 'hover:bg-neutral-100' : 'hover:bg-neutral-800'}`}
                                                onClick={() => handleQuantityChange('plus')}
                                            >
                                                <span className={themeClasses.text}>+</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={isButtonDisabled}
                                            // className={`flex-1 h-12 flex items-center justify-center rounded-full text-sm font-slim transition-colors duration-200 ${
                                            //     isButtonDisabled
                                            //         ? 'bg-neutral-400 cursor-not-allowed'
                                            //         : `${themeClasses.button.background} ${themeClasses.button.text} hover:opacity-90`
                                            // }`}
                                            className={`flex-1 h-12 flex items-center justify-center rounded-full text-sm font-slim transition-colors duration-200 ${
                                                isButtonDisabled
                                                    ? 'bg-neutral-400 cursor-not-allowed'
                                                    : `bg-black text-neutral-50 hover:bg-neutral-900`
                                            }`}
                                        >
                                            {isButtonDisabled ? 'Adding...' : 'Add to Cart'}
                                        </button>
                                        <div className="ml-0.5 group w-8 h-8 flex items-center justify-center">
                                            <HeartIcon
                                                productId={selectedProduct?._id}
                                                className="w-6 h-6 transition-transform duration-200 group-hover:scale-125"
                                                color="#571100"
                                            />
                                        </div>
                                    </div>

                                    {/* Product Details Accordion */}
                                    <div className="mt-10">
                                        <h3 className={`text-xl font-bold mb-4 ${themeClasses.text}`}>Product Details</h3>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value="product-description" className={`border-b ${themeClasses.divider}`}>
                                                <AccordionTrigger className={`text-left ${themeClasses.accordion.hover} ${themeClasses.accordion.text}`}>
                                                    <span className={themeClasses.characteristics.text}>Product Description</span>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-2">
                                                    <div className="space-y-2">
                                                        <div className={themeClasses.textMuted}>
                                                            <p>
                                                                {selectedProduct.description || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="product-info" className={`border-b ${themeClasses.divider}`}>
                                                <AccordionTrigger className={`text-left ${themeClasses.accordion.hover} ${themeClasses.accordion.text}`}>
                                                    <span className={themeClasses.characteristics.text}>Information</span>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-2">
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between">
                                                            <span className={themeClasses.characteristics.text}>Brand</span>
                                                            <span className={`font-medium ${themeClasses.characteristics.value}`}>
                                                                {selectedProduct.brand || 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className={themeClasses.characteristics.text}>Material</span>
                                                            <span className={`font-medium ${themeClasses.characteristics.value}`}>
                                                                {selectedProduct.material ? (Array.isArray(selectedProduct.material) ? selectedProduct.material.join(', ') : selectedProduct.material) : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className={themeClasses.characteristics.text}>Collection</span>
                                                            <span className={`font-medium ${themeClasses.characteristics.value}`}>
                                                                {selectedProduct.collections || 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className={themeClasses.characteristics.text}>Category</span>
                                                            <span className={`font-medium ${themeClasses.characteristics.value}`}>
                                                                {selectedProduct.category || 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className={themeClasses.characteristics.text}>Gender</span>
                                                            <span className={`font-medium ${themeClasses.characteristics.value}`}>
                                                                {selectedProduct.gender || 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className={themeClasses.characteristics.text}>Tags</span>
                                                            <span className={`font-medium ${themeClasses.characteristics.value}`}>
                                                                {selectedProduct.tags ? (Array.isArray(selectedProduct.tags) ? selectedProduct.tags.join(', ') : selectedProduct.tags) : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className={themeClasses.characteristics.text}>Created At</span>
                                                            <span className={`font-medium ${themeClasses.characteristics.value}`}>
                                                                {selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toISOString().split('T')[0] : 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="shipping" className={`border-b ${themeClasses.divider}`}>
                                                <AccordionTrigger className={`text-left ${themeClasses.accordion.hover} ${themeClasses.accordion.text}`}>
                                                    Shipping & Returns
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-2">
                                                    <div className="space-y-2">
                                                        <p className={themeClasses.textMuted}>
                                                            We offer worldwide shipping through trusted courier partners. Standard delivery takes 3-5 business days.
                                                        </p>
                                                        <p className={themeClasses.textMuted}>
                                                            All orders are carefully packaged and fully insured.
                                                        </p>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="care" className={`border-b ${themeClasses.divider}`}>
                                                <AccordionTrigger className={`text-left ${themeClasses.accordion.hover} ${themeClasses.accordion.text}`}>
                                                    Care Instructions
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-2">
                                                    <p className={themeClasses.textMuted}>
                                                        Follow the care label instructions. Most items can be machine washed cold and tumble dried low.
                                                    </p>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* Recently Viewed Section - Mobile Only (under accordion) */}
                                        <div className="md:hidden">
                                            {recentlyViewed.filter(p => p._id !== selectedProduct?._id).length > 0 && (
                                                <div className="mt-8">
                                                    <h2 className={`text-2xl text-center font-medium mb-8 ${themeClasses.text}`}>
                                                        Recently Viewed
                                                    </h2>
                                                    <ProductGrid
                                                        products={recentlyViewed.filter(p => p._id !== selectedProduct?._id)}
                                                        loading={false}
                                                        error={null}
                                                        isDay={isDay}
                                                        newStarBadgeSize="md"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className={themeClasses.text}>No product selected</p>
                    </div>
                )}

                {/* You May Like Section - Only show if showRecommendations is true */}
                {selectedProduct && showRecommendations && (
                    <div className="mt-16 pl-1 pr-4 md:px-8">
                        <h2 className={`text-2xl text-center font-medium mb-16 select-none ${themeClasses.text}`}>
                            You May Also Like
                        </h2>
                        <ProductGrid
                            products={similarProducts}
                            loading={loading}
                            error={error}
                            isDay={isDay}
                            newStarBadgeSize="md"
                        />
                    </div>
                )}

                {/* Review Form Modal */}
                {showReviewForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-neutral-800 rounded-xl w-full max-w-md p-6 relative">
                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    onClick={() => setShowReviewModal(true)}*/}
                            {/*    className="ml-2 text-sm font-medium text-primary-700 hover:underline dark:text-primary-500"*/}
                            {/*>*/}
                            {/*    Write a review*/}
                            {/*</button>*/}


                            <form onSubmit={handleReviewSubmit}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                        Your Rating
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                className="focus:outline-none"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHover(star)}
                                                onMouseLeave={() => setHover(0)}
                                            >
                                                <Star
                                                    className={`w-8 h-8 ${(hover || rating) >= star ? 'text-yellow-400' : 'text-neutral-300'}`}
                                                    fill={(hover || rating) >= star ? 'currentColor' : 'none'}
                                                    stroke="currentColor"
                                                    strokeWidth={1.5}
                                                />
                                            </button>
                                        ))}
                                        <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400">
                                            {rating ? `${rating} star${rating > 1 ? 's' : ''}` : 'Rate this product'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="review-title" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                        Review Title
                                    </label>
                                    <input
                                        type="text"
                                        id="review-title"
                                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent dark:bg-neutral-700 dark:text-neutral-50"
                                        placeholder="Summarize your experience"
                                        value={review.title}
                                        onChange={(e) => setReview({...review, title: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="review-comment" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                        Your Review
                                    </label>
                                    <textarea
                                        id="review-comment"
                                        rows="4"
                                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent dark:bg-neutral-700 dark:text-neutral-50"
                                        placeholder="Share details about your experience with this product"
                                        value={review.comment}
                                        onChange={(e) => setReview({...review, comment: e.target.value})}
                                        required
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label htmlFor="reviewer-name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            id="reviewer-name"
                                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent dark:bg-neutral-700 dark:text-neutral-50"
                                            placeholder="Enter your name"
                                            value={review.name}
                                            onChange={(e) => setReview({...review, name: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="reviewer-email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="reviewer-email"
                                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent dark:bg-neutral-700 dark:text-neutral-50"
                                            placeholder="your@email.com"
                                            value={review.email}
                                            onChange={(e) => setReview({...review, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowReviewForm(false)}
                                        className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-black text-neutral-50 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!rating || !review.title || !review.comment || !review.name || !review.email}
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Reviews Section */}
                <div id="reviews" className="mt-20 pl-1 pr-4 md:px-8 max-w-4xl mx-auto">
                    <h2 className={`text-2xl font-medium mb-8 text-center select-none ${themeClasses.text}`}>
                        Customer Reviews
                    </h2>

                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center mb-2">
                                <p className={`text-sm font-bold ${isDay ? 'text-neutral-950' : 'text-neutral-50'} mr-2`}>
                                    {selectedProduct?.rating?.toFixed(1) || '0.0'}
                                </p>
                                <div className="flex items-center">
                                    <PartialStarRating rating={selectedProduct?.rating || 0} size="md" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                {selectedProduct?.numReviews || 0} global ratings
                            </p>
                        </div>
                        {/*<button */}
                        {/*    onClick={() => setShowReviewForm(true)}*/}
                        {/*    className="px-4 py-2 text-sm font-medium text-neutral-50 bg-black rounded-full hover:bg-neutral-800 transition-colors"*/}
                        {/*>*/}
                        {/*    Write a Review*/}
                        {/*</button>*/}
                        <button
                            type="button"
                            onClick={() => {
                                if (!user) {
                                    // Redirect to login with current path as state
                                    navigate('/login', { 
                                        state: { 
                                            from: window.location.pathname,
                                            showReviewModal: true
                                        }
                                    });
                                    return;
                                }
                                setShowReviewModal(true);
                            }}
                            className="px-4 py-2.5 text-sm font-medium text-neutral-50 bg-black rounded-full hover:bg-neutral-900 transition-colors"
                        >
                            Write a Review
                        </button>
                    </div>

                    {/* Rating Distribution */}
                    <div className="mt-6">
                        {/*<h3 className="text-lg font-medium mb-4">Rating Breakdown</h3>*/}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column - Star Ratings */}
                            <div className="space-y-4">
                                {/*<h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Overall Rating</h4>*/}
                                {reviewsLoading ? (
                                    <div className="py-4 text-center text-neutral-500">
                                        Loading reviews...
                                    </div>
                                ) : (
                                    [5, 4, 3, 2, 1].map(stars => {
                                        // Count reviews for this star rating
                                        const count = reviews.filter(
                                            review => Math.round(review.rating) === stars
                                        ).length;

                                        // Calculate percentage for the bar width
                                        const totalReviews = reviews.length || 1;
                                        const percentage = (count / totalReviews) * 100;

                                        return (
                                            <div key={`star-${stars}`} className="flex items-center">
                                                <button
                                                    onClick={() => {
                                                        // Toggle functionality: if clicking the same star rating again, reset to null
                                                        setSelectedStarFilter(selectedStarFilter === stars ? null : stars);
                                                    }}
                                                    className={`w-12 text-sm font-medium text-indigo-500 hover:underline text-left ${selectedStarFilter === stars ? 'underline' : ''}`}
                                                >
                                                    {stars} star{stars > 1 ? 's' : ''}
                                                </button>
                                                <div className="flex-1 h-3 mx-4 bg-neutral-200 rounded-full dark:bg-neutral-700">
                                                    <div
                                                        className="h-3 bg-yellow-300 rounded-full transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="w-6 text-sm font-medium text-neutral-500 dark:text-neutral-400 text-right">
                                                    {percentage.toFixed(0)}%
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Right Column - Additional Ratings */}
                            <div className="space-y-4">
                                {(() => {
                                    // Calculate average ratings from reviews
                                    const ratingSums = {
                                        quality: { sum: 0, count: 0 },
                                        design: { sum: 0, count: 0 },
                                        fit: { sum: 0, count: 0 },
                                        // width: { sum: 0, count: 0 },
                                        // length: { sum: 0, count: 0 }
                                    };

                                    // Calculate sums and counts for each rating type
                                    reviews.forEach(review => {
                                        if (review.qualityRating) {
                                            ratingSums.quality.sum += review.qualityRating;
                                            ratingSums.quality.count++;
                                        }
                                        if (review.designRating) {
                                            ratingSums.design.sum += review.designRating;
                                            ratingSums.design.count++;
                                        }
                                        if (review.fitRating) {
                                            ratingSums.fit.sum += review.fitRating;
                                            ratingSums.fit.count++;
                                        }
                                        // if (review.widthRating) {
                                        //     ratingSums.width.sum += review.widthRating;
                                        //     ratingSums.width.count++;
                                        // }
                                        // if (review.lengthRating) {
                                        //     ratingSums.length.sum += review.lengthRating;
                                        //     ratingSums.length.count++;
                                        // }
                                    });

                                    // Create rating items with calculated averages
                                    const ratingItems = [
                                        {
                                            label: 'Quality',
                                            value: ratingSums.quality.count > 0 ? ratingSums.quality.sum / ratingSums.quality.count : 0,
                                            count: ratingSums.quality.count
                                        },
                                        {
                                            label: 'Design',
                                            value: ratingSums.design.count > 0 ? ratingSums.design.sum / ratingSums.design.count : 0,
                                            count: ratingSums.design.count
                                        },
                                        {
                                            label: 'Fit',
                                            value: ratingSums.fit.count > 0 ? ratingSums.fit.sum / ratingSums.fit.count : 0,
                                            count: ratingSums.fit.count
                                        },
                                        // {
                                        //     label: 'Width',
                                        //     value: ratingSums.width.count > 0 ? ratingSums.width.sum / ratingSums.width.count : 0,
                                        //     count: ratingSums.width.count,
                                        //     showFitLabels: true
                                        // },
                                        // {
                                        //     label: 'Length',
                                        //     value: ratingSums.length.count > 0 ? ratingSums.length.sum / ratingSums.length.count : 0,
                                        //     count: ratingSums.length.count,
                                        //     showFitLabels: true
                                        // }
                                    ];

                                    return ratingItems.map(({ label, value, count, showFitLabels }, index) => (
                                        <div key={label} className={`space-y-1 ${index === 3 ? 'pb-3' : ''}`}>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                    {label}
                                                </span>
                                                {!showFitLabels && (
                                                    <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                                        {`${value > 0 ? Math.round(value * 10) / 10 : '0'}/5`}
                                                        {/*{count > 0 && ` (${count})`}*/}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="h-3 w-full bg-neutral-200 rounded-full dark:bg-neutral-700 relative">
                                                <div
                                                    className="h-3 bg-yellow-300 rounded-full"
                                                    style={{ width: `${(value / 5) * 100}%` }}
                                                ></div>
                                                {showFitLabels && (
                                                    <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                                        <span>{label === 'Length' ? 'too short' : 'too tight'}</span>
                                                        <span>perfect</span>
                                                        <span>{label === 'Length' ? 'too long' : 'too wide'}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* Star Filter Section */}
                    <div className="mt-6 flex flex-wrap gap-2 items-center">
                        <div className="relative inline-block text-left">
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setShowStarDropdown(!showStarDropdown)}
                                    className="inline-flex justify-center w-full rounded-full shadow-sm px-4 py-2 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-700"
                                    id="options-menu"
                                    aria-haspopup="true"
                                    aria-expanded="true"
                                >
                                    {selectedStarFilter ? `${selectedStarFilter} Star${selectedStarFilter > 1 ? 's' : ''}` : 'Filter by Rating'}
                                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            {showStarDropdown && (
                                <div className="origin-top-right absolute left-0 mt-2 w-40 rounded-lg shadow-lg bg-white z-10 dark:bg-neutral-800">
                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                        {[5, 4, 3, 2, 1].map((star) => {
                                            const count = reviews.filter(review => Math.round(review.rating) === star).length;
                                            return (
                                                <button
                                                    key={star}
                                                    onClick={() => {
                                                        setSelectedStarFilter(star);
                                                        setShowStarDropdown(false);
                                                    }}
                                                    className="w-full text-left block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-50"
                                                    role="menuitem"
                                                >
                                                    {star} Star{star > 1 ? 's' : ''} ({count})
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setSelectedStarFilter(null)}
                            className={`px-4 py-2 text-sm rounded-full transition-colors ${
                                selectedStarFilter === null
                                    ? 'bg-indigo-600 text-neutral-50'
                                    : 'bg-white text-neutral-700 hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-700'
                            }`}
                        >
                            All Reviews
                        </button>
                    </div>

                    {/* Review Section */}
                    <section className="mt-12">
                        <div className="flex justify-between items-center mb-6">
                            {/*<h2 className="text-2xl font-semibold">Customer Reviews</h2>*/}
                            {console.log('Current user:', user)}
                            {/*{user && (*/}
                            {/*    <button*/}
                            {/*        onClick={() => setShowReviewModal(true)}*/}
                            {/*        className="px-4 py-2 bg-primary-600 text-neutral-50 rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"*/}
                            {/*    >*/}
                            {/*        Write a Review*/}
                            {/*    </button>*/}
                            {/*)}*/}
                        </div>

                        {selectedStarFilter !== null && reviews.filter(review => Math.round(review.rating) === selectedStarFilter).length === 0 ? (
                            <div className="text-center py-8">
                                <p className={`text-md md:text-lg ${themeClasses.textMuted}`}>
                                    There are no reviews with {selectedStarFilter} star{selectedStarFilter > 1 ? 's' : ''}
                                </p>
                            </div>
                        ) : (
                            <ReviewList
                                productId={productId}
                                productName={selectedProduct?.name || 'this product'}
                                refreshKey={refreshReviews}
                                currentUser={user}
                                onReviewAction={async () => {
                                    // Refresh both product data and reviews when a review action occurs
                                    if (productId) {
                                        try {
                                            // Refresh product details
                                            await dispatch(fetchProductDetails(productId));

                                            // Force refresh of reviews
                                            const data = await getProductReviews(productId, 1, 100);
                                            setReviews(data.reviews || []);

                                            // Increment refreshKey to force re-render
                                            setRefreshReviews(prev => prev + 1);
                                        } catch (error) {
                                            console.error('Error refreshing data:', error);
                                            toast.error('Error updating review information');
                                        }
                                    }
                                }}
                                filteredReviews={selectedStarFilter !== null
                                    ? reviews.filter(review => Math.round(review.rating) === selectedStarFilter)
                                    : reviews
                                }
                            />
                        )}
                    </section>
                </div>
            </div>

            <ReviewModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                productId={productId}
                productName={selectedProduct?.name || 'this product'}
                sizes={selectedProduct?.sizes || []}
                onReviewSubmit={() => {
                    // Refresh reviews list
                    setRefreshReviews(prev => prev + 1);
                    // Refresh product data to update the average rating
                    if (productId) {
                        dispatch(fetchProductDetails(productId));
                    }
                }}
                user={user}
            />

            {/* Size Chart Modal */}
            {showSizeChart && selectedProduct?.sizeChartData && selectedProduct.sizeChartData.length > 0 && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-xl w-full max-w-2xl p-6 relative max-h-[80vh] overflow-y-auto">
                        <button
                            type="button"
                            alt="Close"
                            onClick={() => setShowSizeChart(false)}
                            className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                        >
                            <img
                                src={xMarkIcon}
                                alt=""
                                className="h-4 w-4 dark:hover:opacity-50"
                                style={{ filter: 'invert(50%)' }}
                            />
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">Size Chart</h2>

                        {/* Size Chart Table */}
                        <div className="overflow-x-auto mb-6">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-neutral-100 dark:bg-neutral-300">
                                        <th className="p-3 border border-neutral-300 dark:border-neutral-500 text-left font-semibold dark:text-black uppercase text-sm">Size</th>
                                        <th className="p-3 border border-neutral-300 dark:border-neutral-500 text-left font-semibold dark:text-black uppercase text-sm">Width (cm)</th>
                                        <th className="p-3 border border-neutral-300 dark:border-neutral-500 text-left font-semibold dark:text-black uppercase text-sm">Length (cm)</th>
                                        <th className="p-3 border border-neutral-300 dark:border-neutral-500 text-left font-semibold dark:text-black uppercase text-sm">Sleeve Center Back (cm)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProduct.sizeChartData.map((row, index) => (
                                        <tr key={index} className="bg-white dark:bg-neutral-800">
                                            <td className="p-3">{row.size}</td>
                                            <td className="p-3">{row.width}</td>
                                            <td className="p-3">{row.length}</td>
                                            <td className="p-3">{row.sleeveCenterBack}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Product-Specific Sizes */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-50">Available Sizes for this Product:</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedProduct.sizes?.map((size) => (
                                    <span
                                        key={size}
                                        className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm text-neutral-900 dark:text-neutral-50"
                                    >
                                        {size}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <img
                            src={sizeShirt}
                            alt="Size Chart Shirt"
                            className="mt-4 w-full max-w-md mx-auto"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetails;

// include in Home.jsx