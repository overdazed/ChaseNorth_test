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
import { useLocation } from 'react-router-dom';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';
import NightHomeLoader from '../components/Common/NightHomeLoader.jsx';
import axios from "axios";
import VelocityText from "../components/Common/VelocityText";
import Bento from "../components/Products/Bento";
import Featured from "../components/Common/Featured.jsx";
import ParallaxSection2 from "@/components/Common/ParallaxSection2.jsx";

const Home = () => {
    const { pathname } = useLocation();
    const [isNightMode, setIsNightMode] = useState(() => {
        const hours = new Date().getHours();
        return hours >= 18 || hours < 6;
    });

    const [isLoading, setIsLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products);
    const [bestSellerProduct, setBestSellerProduct] = useState(null);

    // Theme change listener
    useEffect(() => {
        const handleThemeChange = (e) => {
            if (e?.detail?.isDarkMode !== undefined) {
                setIsNightMode(e.detail.isDarkMode);
            }
        };
        window.addEventListener('themeChange', handleThemeChange);
        return () => window.removeEventListener('themeChange', handleThemeChange);
    }, []);

    // ---------- SCROLL HANDLING ----------

    // 1️⃣ Take manual control of scroll restoration
    useEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }, []);

    // 2️⃣ Save scroll position before leaving the page
    useEffect(() => {
        const saveScrollPosition = () => {
            sessionStorage.setItem('scrollPosition', String(window.scrollY));
        };
        window.addEventListener('beforeunload', saveScrollPosition);
        return () => window.removeEventListener('beforeunload', saveScrollPosition);
    }, []);

    // 3️⃣ Restore scroll on back/forward, reset to top on refresh/direct visit
    useEffect(() => {
        const navEntry = performance.getEntriesByType('navigation')[0];
        if (navEntry?.type === 'back_forward') {
            const savedPosition = sessionStorage.getItem('scrollPosition');
            if (savedPosition !== null) {
                requestAnimationFrame(() => {
                    window.scrollTo(0, parseInt(savedPosition, 10));
                });
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, []);

    // ---------- DATA FETCHING ----------
    useEffect(() => {
        dispatch(fetchProductsByFilters({
            gender: "Women",
            category: "Bottom Wear",
            limit: 8
        }));

        const fetchBestSeller = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
                setBestSellerProduct(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchBestSeller();
    }, [dispatch]);

    // Loader for 2.5s
    useEffect(() => {
        setIsLoading(true);
        setShowContent(false);
        const timer = setTimeout(() => {
            setIsLoading(false);
            setShowContent(true);
        }, 2500);
        return () => clearTimeout(timer);
    }, [pathname]);

    if (isLoading) return <NightHomeLoader />;

    // ---------- RENDER ----------
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
        </div>
    );
};

export default Home;
