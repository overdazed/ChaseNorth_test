// frontend/src/App.jsx
import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import store from "./redux/store";

// Layouts
import UserLayout from "./components/Layout/UserLayout";
import AdminLayout from "./components/Admin/AdminLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import ProductDetails from "./components/Products/ProductDetails";
import Checkout from "./components/Cart/Checkout";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import FAQPage from "./pages/FAQPage";
import Wishlist from "./pages/Wishlist";
import AdminHomePage from "./pages/AdminHomePage";
import EditProductPage from "./components/Admin/EditProductPage";
import OrderManagement from "./components/Admin/OrderManagement";
import Report from "./pages/Report";
import ReportConfirmation from "./pages/ReportConfirmation";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import CustomCursor from "./components/ui/CustomCursor";

// This component handles scroll restoration
const ScrollRestoration = () => {
    const { pathname } = useLocation();
    const navType = useNavigationType();
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            const navigationEntries = performance.getEntriesByType('navigation');
            const isPageRefresh = navigationEntries.length > 0 &&
                navigationEntries[0].type === 'reload';

            if (isPageRefresh) {
                window.scrollTo(0, 0);
                sessionStorage.removeItem(`scrollPos:${pathname}`);
            }
            return;
        }

        if (navType === 'POP') {
            const savedPosition = sessionStorage.getItem(`scrollPos:${pathname}`);
            if (savedPosition) {
                const scrollToPosition = () => {
                    window.scrollTo({
                        top: parseInt(savedPosition, 10),
                        behavior: 'instant'
                    });
                };
                const timer = setTimeout(scrollToPosition, 50);
                return () => clearTimeout(timer);
            } else {
                window.scrollTo(0, 0);
            }
        } else if (navType === 'PUSH') {
            window.scrollTo(0, 0);
        }

        const handleBeforeUnload = () => {
            sessionStorage.setItem(`scrollPos:${pathname}`, window.scrollY);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            handleBeforeUnload();
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [pathname, navType]);

    return null;
};

const App = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Toaster position="top-right" />
                <CustomCursor />
                <ScrollRestoration />
                <Routes>
                    <Route path="/" element={<UserLayout />}>
                        <Route index element={<Home />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="collections/:collection" element={<CollectionPage />} />
                        <Route path="product/:id" element={<ProductDetails />} />
                        <Route path="checkout" element={<Checkout />} />
                        <Route path="order-confirmation" element={<OrderConfirmationPage />} />
                        <Route path="order/:id" element={<OrderDetailsPage />} />
                        <Route path="my-orders" element={<MyOrdersPage />} />
                        <Route path="wishlist" element={<Wishlist />} />
                        <Route path="faq" element={<FAQPage />} />
                        <Route path="report" element={<Report />} />
                        <Route path="report/confirmation" element={<ReportConfirmation />} />
                    </Route>
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<AdminHomePage />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="products" element={<ProductManagement />} />
                        <Route path="products/:id/edit" element={<EditProductPage />} />
                        <Route path="orders" element={<OrderManagement />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    );
};

export default App;