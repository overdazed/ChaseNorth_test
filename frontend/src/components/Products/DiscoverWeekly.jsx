import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/CanvasRevealEffect";
import { Link } from "react-router-dom";


const API_BASE = import.meta.env.VITE_API_BASE;

// ================== Helper functions ==================
const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const getCurrentWeekKey = () => {
  const now = new Date();
  const friday = new Date(now);

  // Set to Friday 7 PM
  friday.setHours(19, 0, 0, 0);

  // If it's before this week's Friday 7 PM, use last week's
  if (now.getDay() < 5 || (now.getDay() === 5 && now.getHours() < 19)) {
    friday.setDate(friday.getDate() - 7);
  }

  const year = friday.getFullYear();
  const firstDayOfYear = new Date(year, 0, 1);
  const pastDaysOfYear = Math.floor(
      (friday - firstDayOfYear) / (24 * 60 * 60 * 1000)
  );
  const weekNumber = Math.ceil(
      (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
  );

  return `${year}-${weekNumber}`;
};

const isNighttime = () => {
  const hours = new Date().getHours();
  return hours >= 18 || hours < 6;
};

// ================== Card component ==================
const Card = ({ title, icon, children, className = "" }) => {
  const [hovered, setHovered] = useState(false);

  return (
      <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`${
              isNighttime()
                  ? "ring-[0.5px] ring-neutral-50/80 bg-neutral-950"
                  : "border-[0.5px] border-black/10 bg-neutral-50"
          } group/canvas-card flex items-center justify-center max-w-sm w-full mx-auto p-4 relative h-[30rem] ${className}`}
      >
        {/* Top-left corner icon */}
        <Icon
            className={`absolute h-6 w-6 -top-3 -left-3 ${
                isNighttime() ? "text-white" : "text-black"
            }`}
        />
        {/* Bottom-right corner icon */}
        <Icon
            className={`absolute h-6 w-6 -bottom-3 -right-3 ${
                isNighttime() ? "text-white" : "text-black"
            }`}
        />

        <AnimatePresence>
          {hovered && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full w-full absolute inset-0"
              >
                {children}
              </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-20 w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200">
            {icon}
          </div>
          <h2 className="dark:text-white text-xl opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-black -mt-8 font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200">
            {title}
          </h2>
        </div>
      </div>
  );
};

// ================== Icons ==================
const AceternityIcon = () => {
  const isNight = isNighttime();
  const logo = isNight
      ? "/src/assets/ChaseNorth-white.svg"
      : "/src/assets/ChaseNorth-black.svg";

  return (
      <img
          src={logo}
          alt="ChaseNorth Logo"
          className="h-24 w-24 group-hover/canvas-card:opacity-80 transition-opacity"
      />
  );
};

const Icon = ({ className, ...rest }) => {
  const isNight = isNighttime();
  const logo = isNight
      ? "/src/assets/ChaseNorth_x-white.svg"
      : "/src/assets/ChaseNorth_x-black.svg";

  return (
      <img
          src={logo}
          alt="ChaseNorth Logo"
          className={`${className} w-6 h-6`}
          {...rest}
      />
  );
};

// ================== DiscoverWeeklyContent ==================
const DiscoverWeeklyContent = () => {
  const [weeklyProduct, setWeeklyProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextUpdate, setNextUpdate] = useState("");

  const formatDate = (date) =>
      new Date(date).toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

  const calculateNextFriday = () => {
    const now = new Date();
    const nextFriday = new Date(now);

    const daysUntilFriday = (5 - now.getDay() + 7) % 7;
    nextFriday.setDate(now.getDate() + (daysUntilFriday || 7));
    nextFriday.setHours(19, 0, 0, 0);

    if (now > nextFriday) {
      nextFriday.setDate(nextFriday.getDate() + 7);
    }
    return nextFriday;
  };

  useEffect(() => {
    const setWeeklyProductFromData = async () => {
      try {
        setLoading(true);
        const allProducts = await fetchProducts();

        if (!Array.isArray(allProducts) || allProducts.length === 0) {
          throw new Error("No products found in the data");
        }

        const womenProducts = allProducts.filter(
            (product) =>
                product.gender &&
                product.gender.toString().toLowerCase() === "women"
        );

        if (womenProducts.length === 0) {
          const allGenders = [
            ...new Set(allProducts.map((p) => p.gender).filter(Boolean)),
          ];
          throw new Error(
              `No women's products available. Available genders: ${allGenders.join(
                  ", "
              )}`
          );
        }

        const weekKey = getCurrentWeekKey();

        const productIndex = weekKey
            .split("-")
            .reduce(
                (acc, val) => (acc + parseInt(val, 10)) % womenProducts.length,
                0
            );

        const selectedProduct = womenProducts[productIndex];
        if (!selectedProduct) throw new Error("Failed to select a product");

        const nextFriday = calculateNextFriday();

        setWeeklyProduct(selectedProduct);
        setNextUpdate(formatDate(nextFriday));

        const timeUntilUpdate = nextFriday - new Date();
        const timer = setTimeout(() => {
          setWeeklyProductFromData();
        }, Math.max(0, timeUntilUpdate));

        return () => clearTimeout(timer);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    setWeeklyProductFromData();
  }, []);

  if (loading) {
    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg max-w-md text-center">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p className="mb-4">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
    );
  }

  return (
      <div
          className={`min-h-screen ${
              isNighttime() ? "bg-neutral-950" : "bg-neutral-50"
          } pt-[10rem] px-4`}
      >
        <div className="max-w-7xl mx-auto">
          <h1
              className={`text-3xl md:text-4xl font-bold text-center mb-12 ${
                  isNighttime() ? "text-neutral-50" : "text-neutral-950"
              }`}
          >
            Discover Weekly
          </h1>

          <div className="relative group overflow-hidden h-full">
            {/* Dim overlay that disappears on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:opacity-0 transition-opacity duration-500 z-0"></div>

            {/* Product Image */}
            <img
                src={
                    weeklyProduct.images?.[0]?.url ||
                    "https://via.placeholder.com/400x600?text=No+Image"
                }
                alt={weeklyProduct.name}
                className="w-full h-full object-cover"
            />

            {/* Hover Content - Bottom Aligned */}
            <div className="absolute bottom-0 left-0 right-0 pt-24 pb-6 px-6 bg-gradient-to-t from-black/95 via-black/60 via-50% to-transparent">
              <div className="space-y-2">
                <p className="font-bold text-white text-lg transform -translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                  {weeklyProduct.brand || "Brand"}
                </p>
                <p className="font-medium text-white text-2xl transform -translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out delay-75">
                  {weeklyProduct.name}
                </p>
              </div>
            </div>

            {/* Existing color swatches */}
            {weeklyProduct.colors && weeklyProduct.colors.length > 0 && (
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  {weeklyProduct.colors.map((color, i) => (
                      <div
                          key={i}
                          className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: color }}
                      />
                  ))}
                </div>
            )}
          </div>

          {/*{nextUpdate && (*/}
          {/*    <div className="text-center mt-8 text-[9px] text-gray-500 dark:text-gray-400">*/}
          {/*      Next update: {nextUpdate}*/}
          {/*    </div>*/}
          {/*)}*/}
        </div>
      </div>
  );
};

// ================== Parallax Wrapper ==================
// In the DiscoverWeekly component at the bottom of the file, update these values:
export default function DiscoverWeekly() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (isMobile) {
    return (
      <div className={`relative w-full ${isNighttime() ? 'bg-neutral-950' : 'bg-neutral-50'}`}>
        <div className="w-full max-w-7xl mx-auto px-4 pt-0 pb-20">
          <DiscoverWeeklyContent />
        </div>
      </div>
    );
  }

  return (
      <div
          className="relative h-[600px] sm:h-[800px] lg:h-[1000px] max-h-[1000px]"
          style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <div className="relative h-[calc(100vh+600px)] sm:h-[calc(100vh+800px)] lg:h-[calc(100vh+1000px)] -top-[100vh]">
          <div className="h-[600px] sm:h-[800px] lg:h-[1000px] sticky top-[calc(100vh-600px)] sm:top-[calc(100vh-800px)] lg:top-[calc(100vh-1000px)]">
            <DiscoverWeeklyContent />
          </div>
        </div>
      </div>
  );
}
