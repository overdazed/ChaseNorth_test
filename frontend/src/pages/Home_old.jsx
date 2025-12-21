import Hero from '../components/Layout/Hero'
// import GenderCollectionSection from "../components/Products/GenderCollectionSection.jsx";
import NewArrivals from "../components/Products/NewArrivals.jsx";
import ProductDetails from "../components/Products/ProductDetails.jsx";
import ProductGrid from "../components/Products/ProductGrid.jsx";
import FeaturedCollection from "../components/Products/FeaturedCollection.jsx";
import FeaturesSection from "../components/Products/FeaturesSection.jsx";
import DiscoverWeekly from "../components/Products/DiscoverWeekly.jsx";
import SwipeCards from "../components/Products/SwipeCards.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState, useRef } from "react";
// import { useLayoutEffect } from "react";
import { useLocation } from 'react-router-dom';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';
import NightHomeLoader from '../components/Common/NightHomeLoader.jsx';
import axios from "axios";
import VelocityText from "../components/Common/VelocityText";
import Bento from "../components/Products/Bento";
import {SVGMaskHover} from "../components/Common/SVGMaskHover";
import Featured from "../components/Common/Featured.jsx";
import ParallaxSection2 from "@/components/Common/ParallaxSection2.jsx";

// const placeholderProducts = [
//     {
//         _id: "1",
//         name: "Product 1",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=1",
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
//                 url:"https://picsum.photos/500/500?random=2",
//                 altText: "Product 2",
//             },
//         ]
//     },
//     {
//         _id: "3",
//         name: "Product 3",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=3",
//                 altText: "Product 3",
//             },
//         ]
//     },
//     {
//         _id: "4",
//         name: "Product 4",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=4",
//                 altText: "Product 4",
//             },
//         ]
//     },
//     {
//         _id: "5",
//         name: "Product 5",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=5",
//                 altText: "Product 5",
//             },
//         ]
//     },
//     {
//         _id: "6",
//         name: "Product 6",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=6",
//                 altText: "Product 6",
//             },
//         ]
//     },
//     {
//         _id: "7",
//         name: "Product 7",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=7",
//                 altText: "Product 7",
//             },
//         ]
//     },
//     {
//         _id: "8",
//         name: "Product 8",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=8",
//                 altText: "Product 8",
//             },
//         ]
//     }
// ]

const Home = () => {
  const { pathname } = useLocation();
  const [isNightMode, setIsNightMode] = useState(() => {
    // Set initial theme based on the current time
    const hours = new Date().getHours();
    // Night mode from 6 PM (18:00) to 6 AM (06:00)
    return hours >= 18 || hours < 6;
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const location = useLocation();

  // Handle manual theme changes
  const handleThemeChange = (e) => {
    if (e?.detail?.isDarkMode !== undefined) {
      setIsNightMode(e.detail.isDarkMode);
    }
  };
  
  // Listen for theme changes
  useEffect(() => {
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  // Handle refresh and initial scroll position
  useEffect(() => {
    // Save scroll position before refresh
      const handleKeyDown = (e) => {
          if ((e.key === 'F5') || (e.ctrlKey && e.key === 'r')) {
              // Set scroll position to 0
              window.scrollTo(0, 0);
              // Also save it to session storage
              sessionStorage.setItem('scrollPosition', '0');
          }
      };

    // Set initial scroll position to top
    sessionStorage.setItem('scrollPosition', '0');
    window.scrollTo(0, 0);

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle back/forward navigation and refresh case
  useEffect(() => {
    const handlePopState = () => {
      const savedPosition = sessionStorage.getItem('scrollPosition');
      if (savedPosition) {
        requestAnimationFrame(() => {
          window.scrollTo({
            top: parseInt(savedPosition),
            behavior: 'auto'
          });
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save scroll position when leaving the page
  useEffect(() => {
    const saveScrollPosition = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY);
    };

    // Save scroll position when the page is about to unload
    window.addEventListener('beforeunload', saveScrollPosition);

    // Clean up
    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, []);

  // Handle initial load and refresh
  useEffect(() => {
    // Check if this is a back/forward navigation
    const navigationEntries = performance.getEntriesByType('navigation');
    const isBackForward = navigationEntries.length > 0 &&
                         navigationEntries[0].type === 'back_forward';

    if (!isBackForward) {
      // Only scroll to top on initial load or refresh
      window.scrollTo(0, 0);
    }
  }, []);

  // Empty dependency array means this runs once on mount
    // We will making use of the useDispatch hook
    const dispatch = useDispatch();
    // Get the products, loading and error using the useSelector hook, that allows us to access data from the reduxstore
    const { products, loading, error } = useSelector((state) => state.products);
    // remember our products are available in our productsSlice

    // add a constant for best seller product
    const [bestSellerProduct, setBestSellerProduct] = useState(null);

    useEffect(() => {
        // Fetch products for a specific collection
        dispatch(
            fetchProductsByFilters({
            gender: "Women",
            category: "Bottom Wear",
            limit: 8
            })
        );
        // Fetch best seller product
        const fetchBestSeller = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
                );
                setBestSellerProduct(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchBestSeller();
        // dependencies array
    }, [dispatch]);

    // Show loader for 2 seconds on every visit
    useEffect(() => {
        setIsLoading(true);
        setShowContent(false);
        
        const timer = setTimeout(() => {
            setIsLoading(false);
            setShowContent(true);
        }, 2500);

        return () => clearTimeout(timer);
    }, [pathname]);

    useEffect(() => {
        const handleThemeChange = (e) => {
            setIsNightMode(e.detail.isDarkMode);
        };

        window.addEventListener('themeChange', handleThemeChange);
        return () => window.removeEventListener('themeChange', handleThemeChange);
    }, []);

    // Show loader while loading
    if (isLoading) {
        return <NightHomeLoader />;
    }

    return (
        <div className={showContent ? 'fade-in' : 'opacity-0'}>
            <Hero/>
            <VelocityText isNightMode={isNightMode}/>
            <Bento/>
            <Featured/>
            <DiscoverWeekly />
            <NewArrivals/>
            <ParallaxSection2 />

            {/* Best Sellers Section */}
            <div className={isNightMode ? 'bg-neutral-950' : 'bg-neutral-50'}>
                <div className="container mx-auto">
                    <h2 className={`text-3xl text-center font-bold mb-4 pt-40 ${isNightMode ? 'text-neutral-50' : 'text-neutral-950'}`}>
                        Best Seller
                    </h2>
                    {bestSellerProduct ? (
                        <ProductDetails productId={bestSellerProduct._id} showRecommendations={true} />
                    ) : (
                        <p className="text-center pb-8">Loading best seller product ...</p>
                    )}
                </div>
            </div>


            {/*/!* Top Wears for Women section with dark mode *!/*/}
            {/*<div className="bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">*/}
            {/*    <div className="container mx-auto py-12 px-4">*/}
            {/*        <h2 className="text-3xl text-center font-bold mb-12 text-neutral-950 dark:text-neutral-50">*/}
            {/*            Top Wears for Women*/}
            {/*        </h2>*/}
            {/*        <ProductGrid products={products} isDay={typeof document !== 'undefined' ? !document.documentElement.classList.contains('dark') : true} />*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*<SwipeCards />*/}

            {/* Featured Collection */}
            {/*<FeaturedCollection/>*/}
            {/*/!* Features Section *!/*/}
            {/*<FeaturesSection/>*/}
        </div>
    )
}
export default Home
