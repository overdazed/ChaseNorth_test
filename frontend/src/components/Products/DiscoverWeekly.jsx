import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/CanvasRevealEffect";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

// ================== Helper functions ==================
const isNighttime = () => {
  const hours = new Date().getHours();
  return hours >= 18 || hours < 6;
};

// ================== Card component ==================
const Card = ({ title, icon, children, className = "", isDarkMode }) => {
  const [hovered, setHovered] = useState(false);

  return (
      <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`${
              isDarkMode
                  ? "ring-[0.5px] ring-neutral-50/80 bg-neutral-950"
                  : "border-[0.5px] border-black/10 bg-neutral-50"
          } group/canvas-card flex items-center justify-center max-w-sm w-full mx-auto p-4 relative h-[30rem] ${className}`}
      >
        <Icon
            className={`absolute h-6 w-6 -top-3 -left-3 ${
                isDarkMode ? "text-white" : "text-black"
            }`}
            isDarkMode={isDarkMode}
        />
        <Icon
            className={`absolute h-6 w-6 -bottom-3 -right-3 ${
                isDarkMode ? "text-white" : "text-black"
            }`}
            isDarkMode={isDarkMode}
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
          <h2 className={`text-xl opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-white -mt-8 font-bold group-hover/canvas-card:-translate-y-2 transition duration-200`}>
            {title}
          </h2>
        </div>
      </div>
  );
};

// ================== Icons ==================
const AceternityIcon = ({ isDarkMode }) => {
  const logo = isDarkMode
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

const Icon = ({ className, isDarkMode, ...rest }) => {
  const logo = isDarkMode
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
const DiscoverWeeklyContent = ({ isDarkMode }) => {
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

  // Fetch weekly product data
  useEffect(() => {
    const fetchWeeklyProduct = async () => {
      try {
        // First try the API endpoint
        const response = await fetch(`${API_BASE}/api/products/weekly`);
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }
        const data = await response.json();
        setWeeklyProduct(data.product);
        setNextUpdate(data.nextUpdate);
      } catch (err) {
        console.error('Error fetching weekly product:', err);
        // Fallback to a local featured product
        const response = await fetch(`${API_BASE}/api/products?isFeatured=true&limit=1`);
        if (response.ok) {
          const products = await response.json();
          if (products.length > 0) {
            setWeeklyProduct(products[0]);
            // Set next update to tomorrow at 7 PM
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(19, 0, 0, 0);
            setNextUpdate(tomorrow.toISOString());
          }
        } else {
          setError('Could not load weekly product. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyProduct();
  }, []);

  // Fetch the most recent product for New Arrivals Card
  const [newArrivalsProduct, setNewArrivalsProduct] = useState(null);
  const [mensNewItemProduct, setMensNewItemProduct] = useState(null);

  useEffect(() => {
    const fetchNewArrivalsProduct = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products/new-arrivals?limit=1`);
        if (response.ok) {
          const products = await response.json();
          if (products.length > 0) {
            setNewArrivalsProduct(products[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching new arrivals product:', err);
      }
    };

    const fetchMensNewItemProduct = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products/new-arrivals?gender=Men&limit=1`);
        if (response.ok) {
          const products = await response.json();
          if (products.length > 0) {
            setMensNewItemProduct(products[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching men\'s new item product:', err);
      }
    };

    fetchNewArrivalsProduct();
    fetchMensNewItemProduct();
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
              isDarkMode ? "bg-neutral-950" : "bg-neutral-50"
          } pt-[10rem] px-4`}
      >
        <div className="max-w-7xl mx-auto select-none">
          <h1
              className={`text-3xl md:text-4xl font-bold text-center mb-12 ${
                  isDarkMode ? "text-neutral-50" : "text-neutral-950"
              }`}
          >
            Discover Weekly
          </h1>

          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
            {weeklyProduct && (
                <div className="w-full h-full">
                  <Link
                      to={`/product/${weeklyProduct._id || weeklyProduct.id}`}
                      onClick={(e) => {
                        const scrollY =
                            window.scrollY || document.documentElement.scrollTop;
                        sessionStorage.setItem(
                            `scrollPos:${window.location.pathname}`,
                            scrollY
                        );
                      }}
                      className="block w-full h-full"
                  >
                    <Card
                        title="New in Women"
                        icon={<AceternityIcon isDarkMode={isDarkMode} />}
                        isDarkMode={isDarkMode}
                    >
                      <div className="absolute inset-0">
                        <img
                            src={
                                weeklyProduct.images?.[0]?.url ||
                                "https://via.placeholder.com/400x600?text=No+Image"
                            }
                            alt={weeklyProduct.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10" />
                      </div>
                      {weeklyProduct.colors && weeklyProduct.colors.length > 0 && (
                          <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
                            {weeklyProduct.colors.map((color, i) => (
                                <div
                                    key={i}
                                    className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                          </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 pt-24 pb-6 px-6 bg-gradient-to-t from-black/95 via-black/60 via-50% to-transparent">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold text-white">
                            {weeklyProduct.name}
                          </h3>
                          <span className="text-lg font-bold text-white">
                        {weeklyProduct.price?.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </span>
                        </div>
                        {weeklyProduct.brand && (
                            <p className="text-neutral-200 mt-1">{weeklyProduct.brand}</p>
                        )}
                      </div>
                    </Card>
                  </Link>
                </div>
            )}

            <div className="w-full h-full">
              {newArrivalsProduct ? (
                <Link
                    to={`/product/${newArrivalsProduct._id || newArrivalsProduct.id}`}
                    onClick={(e) => {
                      const scrollY =
                          window.scrollY || document.documentElement.scrollTop;
                      sessionStorage.setItem(
                          `scrollPos:${window.location.pathname}`,
                          scrollY
                      );
                    }}
                    className="block w-full h-full"
                >
                  <Card
                      title="New Arrivals"
                      icon={<AceternityIcon isDarkMode={isDarkMode} />}
                      isDarkMode={isDarkMode}
                  >
                    <div className="absolute inset-0">
                      <img
                          src={
                              newArrivalsProduct.images?.[0]?.url ||
                              "https://via.placeholder.com/400x600?text=No+Image"
                          }
                          alt={newArrivalsProduct.name}
                          className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>
                    {newArrivalsProduct.colors && newArrivalsProduct.colors.length > 0 && (
                        <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
                          {newArrivalsProduct.colors.map((color, i) => (
                              <div
                                  key={i}
                                  className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                                  style={{ backgroundColor: color }}
                              />
                          ))}
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 pt-24 pb-6 px-6 bg-gradient-to-t from-black/95 via-black/60 via-50% to-transparent">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold text-white">
                          {newArrivalsProduct.name}
                        </h3>
                        <span className="text-lg font-bold text-white">
                      {newArrivalsProduct.price?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                      </div>
                      {newArrivalsProduct.brand && (
                          <p className="text-neutral-200 mt-1">{newArrivalsProduct.brand}</p>
                      )}
                    </div>
                  </Card>
                </Link>
              ) : (
                <Card
                    title="New Arrivals"
                    icon={<AceternityIcon isDarkMode={isDarkMode} />}
                    isDarkMode={isDarkMode}
                >
                  <CanvasRevealEffect
                      animationSpeed={3}
                      containerClassName={isDarkMode ? "bg-red-700" : "bg-red-600"}
                      colors={isDarkMode ? [[220, 38, 38]] : [[239, 68, 68]]}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">Coming Soon</span>
                  </div>
                </Card>
              )}
            </div>

            <div className="w-full h-full">
              {mensNewItemProduct ? (
                <Link
                    to={`/product/${mensNewItemProduct._id || mensNewItemProduct.id}`}
                    onClick={(e) => {
                      const scrollY =
                          window.scrollY || document.documentElement.scrollTop;
                      sessionStorage.setItem(
                          `scrollPos:${window.location.pathname}`,
                          scrollY
                      );
                    }}
                    className="block w-full h-full"
                >
                  <Card
                      title="Men's new item"
                      icon={<AceternityIcon isDarkMode={isDarkMode} />}
                      isDarkMode={isDarkMode}
                  >
                    <div className="absolute inset-0">
                      <img
                          src={
                              mensNewItemProduct.images?.[0]?.url ||
                              "https://via.placeholder.com/400x600?text=No+Image"
                          }
                          alt={mensNewItemProduct.name}
                          className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>
                    {mensNewItemProduct.colors && mensNewItemProduct.colors.length > 0 && (
                        <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
                          {mensNewItemProduct.colors.map((color, i) => (
                              <div
                                  key={i}
                                  className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                                  style={{ backgroundColor: color }}
                              />
                          ))}
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 pt-24 pb-6 px-6 bg-gradient-to-t from-black/95 via-black/60 via-50% to-transparent">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold text-white">
                          {mensNewItemProduct.name}
                        </h3>
                        <span className="text-lg font-bold text-white">
                      {mensNewItemProduct.price?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                      </div>
                      {mensNewItemProduct.brand && (
                          <p className="text-neutral-200 mt-1">{mensNewItemProduct.brand}</p>
                      )}
                    </div>
                  </Card>
                </Link>
              ) : (
                <Card
                    title="Men's new item"
                    icon={<AceternityIcon isDarkMode={isDarkMode} />}
                    isDarkMode={isDarkMode}
                >
                  <CanvasRevealEffect
                      animationSpeed={3}
                      containerClassName={isDarkMode ? "bg-sky-700" : "bg-sky-600"}
                      colors={isDarkMode ? [[56, 189, 248]] : [[125, 211, 252]]}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">Stay Tuned</span>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

// ================== Main Component ==================
const DiscoverWeekly = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    // Initial check
    checkDarkMode();

    // Set up a mutation observer to watch for changes to the html class
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Check if mobile
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
        <div className={`relative w-full ${isDarkMode ? 'bg-neutral-950' : 'bg-neutral-50'}`}>
          <div className="w-full max-w-7xl mx-auto px-4 pt-0 pb-20">
            <DiscoverWeeklyContent isDarkMode={isDarkMode} />
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
            <DiscoverWeeklyContent isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
  );
};

export default DiscoverWeekly;