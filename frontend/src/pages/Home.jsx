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
import {useEffect, useState } from "react";
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
  const [isNightMode, setIsNightMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const hours = new Date().getHours();
      // Night mode from 6 PM (18:00) to 6 AM (06:00)
      const isNight = hours >= 18 || hours < 6;
      setIsNightMode(isNight);
    };

    // Set initial theme
    updateTheme();

    // Update theme every minute to handle day/night transitions
    const intervalId = setInterval(updateTheme, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Scroll to top on initial load and prevent scroll restoration
  useEffect(() => {
    // This will run once when the component mounts
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Clean up
    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []); // Empty dependency array means this runs once on mount
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
            <VelocityText />
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
