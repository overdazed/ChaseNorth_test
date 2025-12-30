import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import XMarkButton from "../ui/XMarkButton";
import xMarkIcon from "../../assets/x-mark.svg";
import BellButton from "../ui/BellButton";
import RedoButton from "../ui/RedoButton";
import { useDispatch, useSelector } from 'react-redux';
import { updateWishlistCount } from '../../redux/wishlistSlice'; // Adjust the path as needed

const API_BASE = import.meta.env.VITE_API_BASE;

// Function to transform product data to match the component's expected format
const transformProducts = (products) => {
  return products.map((product, index) => ({
    id: product._id || index,
    title: product.name,
    price: `$${product.price?.toFixed(2) || "0.00"}`,
    brand: product.brand || "Fashion",
    colors: Array.isArray(product.colors) ? product.colors : ["#000000"],
    image: product.images?.[0]?.url || "https://via.placeholder.com/400x500",
    category: product.category || "Fashion",
    createdAt: product.createdAt,
  }));
};

// Helper function to check if it's daytime (between 6 AM and 6 PM)
const isDaytime = () => {
  const hours = new Date().getHours();
  return hours >= 6 && hours < 18;
};

// Fetch products from the backend data file
const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/products`);
    if (!response.ok) {
      console.error("Failed to fetch products. Status:", response.status);
      return [];
    }
    const data = await response.json().catch(e => {
      console.error("Error parsing JSON response:", e);
      return null;
    });

    if (!data) return [];

    try {
      return transformProducts(data);
    } catch (transformError) {
      console.error("Error transforming products:", transformError);
      return [];
    }
  } catch (error) {
    console.error("Error in fetchProducts:", error);
    return [];
  }
};

function SwipeCards() {
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id || 'guest';
  const dispatch = useDispatch();

  const [isDay, setIsDay] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      // Default to light theme if no theme is saved
      return savedTheme === 'light' || savedTheme === null;
    }
    return true; // Default to day mode if can't determine
  });

// Listen for theme changes
  useEffect(() => {
    const updateTheme = () => {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        setIsDay(savedTheme === 'light' || savedTheme === null);
      }
    };

    // Initial check
    updateTheme();

    // Listen for theme changes from DarkModeToggle
    const handleThemeChange = () => {
      updateTheme();
    };

    window.addEventListener('themeChange', handleThemeChange);

    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [cards, setCards] = useState([]);
  const [showHeart, setShowHeart] = useState(false);
  const [showXMark, setShowXMark] = useState(false);
  // Heart scaling temporarily disabled for performance
  // const [heartScale, setHeartScale] = useState(1);
  const [outOfCards, setOutOfCards] = useState(false);
  const [swipedCards, setSwipedCards] = useState([]);
  const [canRedo, setCanRedo] = useState(false);
  const [isRedoAnimating, setIsRedoAnimating] = useState(false);
  const [redoDirection, setRedoDirection] = useState('right');
  const [redoKey, setRedoKey] = useState(0);
  const controls = useAnimation();
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Check if the movement is a click (minimal movement)
  const isClick = (start, end) => {
    const dx = Math.abs(start.x - end.x);
    const dy = Math.abs(start.y - end.y);
    return dx < 3 && dy < 3; // 3 px threshold for click detection
  };

  const addToWishlist = (productId) => {
    try {
      const wishlistKey = `wishlist_${userId}`;
      const saved = localStorage.getItem(wishlistKey);
      const wishlist = saved ? JSON.parse(saved) : [];
      if (!wishlist.includes(productId)) {
        const updatedWishlist = [...wishlist, productId];
        localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
        // Update Redux store if needed
        dispatch(updateWishlistCount(updatedWishlist.length));
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const removeFromWishlist = (productId) => {
    try {
      const wishlistKey = `wishlist_${userId}`;
      const saved = localStorage.getItem(wishlistKey);
      if (saved) {
        const wishlist = JSON.parse(saved);
        const updatedWishlist = wishlist.filter(id => id !== productId);
        localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
        // Update Redux store if needed
        dispatch(updateWishlistCount(updatedWishlist.length));
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const loadAvailableProducts = async () => {
    setDirection(0);
    setCurrentIndex(0);
    setSwipedCards([]);

    const products = await fetchProducts();
    const wishlistKey = `wishlist_${userId}`;
    const savedWishlist = localStorage.getItem(wishlistKey);
    const wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];

    // Filter out products that are already in the wishlist
    const availableProducts = products.filter(
        (product) => !wishlist.includes(product.id)
    );

    setCards(availableProducts);
    setOutOfCards(availableProducts.length === 0);
  };

  // Load products on component mount
  useEffect(() => {
    (async () => {
      try {
        await loadAvailableProducts();
      } catch (error) {
        console.error('Error loading products:', error);
        // Optionally set some error state here to show to the user
      }
    })();
  }, []);

  const handleCardClick = (e, card) => {
    const dragEnd = { x: e.clientX, y: e.clientY };
    if (isClick(dragStart, dragEnd)) {
      // Save scroll position
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      sessionStorage.setItem(`scrollPos:${window.location.pathname}`, scrollY);

      // Navigate to product page
      window.location.href = `/product/${card._id || card.id}`;
      console.log("Card clicked:", card);
    }
  };

  const visibleCards = cards.slice(currentIndex, currentIndex + 3);

  const animateSwipe = async (direction) => {
    if (currentIndex >= cards.length) return;

    // Show heart when swiping right, X when swiping left
    if (direction === 'right') {
      setShowHeart(true);
      // Hide heart after animation completes
      setTimeout(() => setShowHeart(false), 200);
    } else {
      setShowXMark(true);
      // Hide X after animation completes
      setTimeout(() => setShowXMark(false), 200);
    }

    await controls.start({
      x: direction === "right" ? 400 : -400,
      rotate: direction === "right" ? 20 : -20,
      opacity: 1,
      transition: {
        duration: 0.08,  // Faster animation for button clicks
        ease: [0.6, 0, 0.4, 1]  // Snappier easing for faster feel
      }
    });

    // Call handleSwipe after the animation completes
    setTimeout(() => {
      handleSwipe(direction);

      // Reset controls for the next card
      controls.start({
        x: 0,
        rotate: 0,
        opacity: 1,
        scale: 1.0,
        transition: { duration: 0 }
      });
    }, 200);
  };

  const handleSwipe = (dir) => {
    if (currentIndex >= cards.length) return;

    const currentCard = cards[currentIndex];
    setDirection(dir === "right" ? 1 : -1);
    setShowHeart(false); // Ensure heart is hidden when moving to next card
    setShowXMark(false); // Ensure X is hidden when moving to next card

    if (dir === "right") {
      addToWishlist(currentCard.id);
    }

    // Add to swiped cards history
    setSwipedCards((prev) => [...prev, { card: currentCard, direction: dir }]);
    setCanRedo(true);

    // Move to the next card
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      if (newIndex >= cards.length) {
        setOutOfCards(true);
      }
      return newIndex;
    });
  };

  const handleRedo = async () => {
    if (swipedCards.length === 0 || isRedoAnimating) return;

    const lastSwipe = swipedCards[swipedCards.length - 1];
    const direction = lastSwipe.direction;

    // If the last swipe was a like (right), remove it from wishlist when undoing
    if (direction === 'right') {
      removeFromWishlist(lastSwipe.card.id);
    }

    // Update state to show the previous card
    const newSwipedCards = [...swipedCards];
    newSwipedCards.pop();

    // Update all state in a single batch
    setSwipedCards(newSwipedCards);
    setCanRedo(newSwipedCards.length > 0);
    setRedoDirection(direction);
    setIsRedoAnimating(true);

    if (outOfCards) {
      setOutOfCards(false);
    } else {
      setCurrentIndex(prev => Math.max(0, prev - 1));
    }

    // Force a re-render with the new card
    await new Promise(resolve => requestAnimationFrame(resolve));

    // Animate the card in from the opposite direction of the original swipe
    await controls.start({
      x: [direction === 'right' ? -150 : 150, 0],
      rotate: [direction === 'right' ? -10 : 10, 0],
      scale: [0.9, 1],
      transition: {
        duration: 0.4,
        ease: [0.2, 0, 0.1, 1]
      }
    });

    setIsRedoAnimating(false);
  };

  const resetCards = async () => {
    setCurrentIndex(0);
    setSwipedCards([]);
    setCanRedo(false);
    setOutOfCards(false);
    try {
      await loadAvailableProducts();
    } catch (error) {
      console.error('Error resetting cards:', error);
      // Optionally set some error state here to show to the user
    }
  };

  const getCardStyle = (index) => {
    // First card should have no rotation or offset
    if (index === 0) {
      return {
        position: 'absolute',
        left: '0%',
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        zIndex: 100,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderRadius: '1rem',
        overflow: 'hidden',
        pointerEvents: 'auto',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        willChange: 'transform',
      };
    }

    // For other cards, apply subtle angles and offsets
    const offsets = [0, -8, 8, -12, 12, -4, 16];     // Reduced horizontal offsets
    const rotations = [0, -3, 2, -2, 2, -3, 3];      // More subtle angles (max 3°)
    const yOffsets = [0, 4, 8, 12, 16, 20, 24];      // Reduced vertical spacing

    // Use predefined values or calculate for deeper stacks
    const xOffset = offsets[index] || (index % 2 === 0 ? -10 : 10) * (1 + index * 0.2);
    const rotation = rotations[index] || (index % 2 === 0 ? -2 : 2) * (1 + index * 0.1);
    const yOffset = yOffsets[index] || index * 10;

    // Calculate scale for depth
    const scale = 1 - (index * 0.02);

    // Add some randomness to the transitions for a more natural feel
    const transitionDelay = index * 0.02;

    // Return style object with individual transform properties
    return {
      position: 'absolute',
      left: '0%',
      x: xOffset,
      y: yOffset,
      rotate: rotation,
      scale: scale,
      opacity: 1,
      zIndex: 100 - index,
      transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${transitionDelay}s`,
      boxShadow: index === 0
        ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      borderRadius: '1rem',
      overflow: 'hidden',
      pointerEvents: index === 0 ? 'auto' : 'none',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      willChange: 'transform',
      transformOrigin: 'center bottom', // Pivot from center bottom for all cards
    };
  };

  if (outOfCards || cards.length === 0) {
    return (
      <div className={`w-full py-16 ${!isDay ? 'bg-neutral-950' : 'bg-neutral-50'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-8 ${!isDay ? 'text-neutral-50' : ''}`}>No More Items</h2>
          <p className="text-center text-neutral-600 mb-6">
            You've seen all available items.
          </p>
          <div className="flex justify-center">
            <button
              onClick={loadAvailableProducts}
              className={`px-6 py-3 rounded-full font-medium transition-colors duration-200 ${!isDay ? 'bg-neutral-50 text-neutral-950 hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'}`}
            >
              Swipe Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-[780px] py-0 ${isDay ? 'bg-neutral-50' : 'bg-neutral-950'} relative z-0`}>
      <div className="container mx-auto px-4 h-full relative z-0">
        <h2 className={`text-3xl font-bold text-center mb-4 ${isDay ? 'text-black' : 'text-white'} relative z-0`}>
          Swipe your way through
        </h2>

        <div className="relative w-full flex flex-col items-center h-full">
          <div className="relative h-[600px] w-full flex items-center justify-center overflow-visible z-0">
            {currentIndex < cards.length ? (
              <div className="relative w-full max-w-sm h-[500px] mx-auto z-0">
                {visibleCards.map((card, index) => (
                  <motion.div
                    key={`${card.id}-${currentIndex}-${index}-${redoKey}`}
                    className={`absolute w-full h-full ${isDay ? 'bg-neutral-50' : 'bg-neutral-900'} rounded-3xl shadow-xl overflow-hidden ${
                      index === 0 ? "cursor-grab active:cursor-grabbing z-20" : "z-10"
                    }`}
                    initial={false}
                    animate={index === 0 ? controls : {}}
                    style={{
                      ...getCardStyle(index),
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transformStyle: "preserve-3d",
                      willChange: "transform"
                    }}
                    onPointerDown={(e) => {
                      setDragStart({ x: e.clientX, y: e.clientY });
                    }}
                    onPointerUp={(e) => handleCardClick(e, card)}
                    drag={index === 0 ? "x" : false}
                    dragConstraints={{ left: -300, right: 300, top: 0, bottom: 0 }}
                    dragTransition={{
                      bounceStiffness: 300,
                      bounceDamping: 25,
                      power: 0.1,
                      timeConstant: 150
                    }}
                    whileHover={{ scale: 1.02 }}
                    dragElastic={0.1}
                    dragMomentum={true}
                    onDragStart={() => {
                      if (index === 0) {
                        controls.start({ scale: 1.03 });
                      }
                    }}
                    onDrag={(e, info) => {
                      if (index === 0) {
                        const isDraggingRight = info.offset.x > 30;
                        const isDraggingLeft = info.offset.x < -30;
                        setShowHeart(isDraggingRight);
                        setShowXMark(isDraggingLeft);

                        if (isDraggingRight) {
                          const progress = Math.min(
                            Math.max((info.offset.x - 30) / 100, 0),
                            1
                          );
                          // setHeartScale(1 + progress * 0.6); // Heart scaling disabled
                          controls.start({
                            rotate: progress * 15,
                            transition: { duration: 0.1 }
                          });
                        } else if (isDraggingLeft) {
                          const progress = Math.min(
                            Math.max((Math.abs(info.offset.x) - 30) / 100, 0),
                            1
                          );
                          controls.start({
                            rotate: -progress * 15,
                            transition: { duration: 0.1 }
                          });
                        } else {
                          // setHeartScale(1); // Heart scaling reset
                          controls.start({
                            rotate: 0,
                            transition: { duration: 0.2 }
                          });
                        }
                      }
                    }}
                    onDragEnd={async (e, info) => {
                      setShowHeart(false);
                      setShowXMark(false);
                      if (index === 0) {
                        if (info.offset.x < -80) {
                          await controls.start({
                            x: -500,
                            rotate: -30,
                            transition: { duration: 0.3 }
                          });
                          handleSwipe("left");
                        } else if (info.offset.x > 80) {
                          await controls.start({
                            x: 500,
                            rotate: 30,
                            transition: { duration: 0.3 }
                          });
                          handleSwipe("right");
                        } else {
                          await controls.start({
                            x: 0,
                            rotate: 0,
                            scale: 1.0,
                            transition: { type: 'spring', stiffness: 300, damping: 20 }
                          });
                        }
                      }
                    }}
                    transition={{
                      type: 'spring',
                      damping: 35,
                      stiffness: 200,
                      mass: 0.5
                    }}
                    whileTap={{ scale: index === 0 ? 0.98 : 1 }}
                  >
                    <div className="relative w-full h-full">
                      {index === 0 && (
                        <>
                          {/* Heart Icon */}
                          <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
                            style={{
                              opacity: showHeart ? 1 : 0,
                              transition: "opacity 0.2s ease-out",
                              transform: 'translate(-50%, -50%) scale(2.5)'
                            }}
                          >
                            <div className="relative w-8 h-8">
                              <svg
                                viewBox="0 0 24 24"
                                className="absolute w-full h-full fill-current text-accent"
                                style={{
                                  filter: 'drop-shadow(0 0 2px white) drop-shadow(0 0 2px white) drop-shadow(0 0 2px white)'
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
                              </svg>
                            </div>
                          </motion.div>

                          {/* X Mark Icon */}
                          <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
                            style={{
                              opacity: showXMark ? 1 : 0,
                              transition: "opacity 0.2s ease-out",
                              transform: 'translate(-50%, -50%) scale(2.5)'
                            }}
                          >
                            <div className="relative w-8 h-8">
                              <img
                                src={xMarkIcon}
                                alt="Nope"
                                className="w-full h-full object-contain"
                                style={{
                                  filter: 'drop-shadow(0 0 2px white) drop-shadow(0 0 2px white) drop-shadow(0 0 2px white)'
                                }}
                              />
                            </div>
                          </motion.div>
                        </>
                      )}
                      {/* New Product Badge */}
                      {card.createdAt && (() => {
                        const createdDate = new Date(card.createdAt);
                        const currentDate = new Date();
                        const daysDifference = (currentDate - createdDate) / (1000 * 60 * 60 * 24);
                        return daysDifference <= 14 && (
                          <div className="absolute -top-2 -left-2 z-10">
                            <img
                              src="/new-star.svg"
                              alt="New Product"
                              className="w-20 h-20 object-contain"
                              onError={(e) => {
                                console.error('Failed to load new-star.svg');
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        );
                      })()}
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover rounded-2xl"
                        draggable="false"
                      />
                      {index === 0 && (
                        <div className="absolute bottom-4 right-4 flex space-x-2 z-30">
                          {card.colors.map((color, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full border border-neutral-400 shadow-md"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 pt-24 pb-6 px-6 bg-gradient-to-t from-black/95 via-black/60 via-50% to-transparent rounded-b-2xl">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold text-white">
                            {card.title}
                          </h3>
                          <span className="text-lg font-bold text-white">
                            {card.price}
                          </span>
                        </div>
                        <p className="text-neutral-200 mt-1">{card.brand}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-neutral-600 text-lg mb-6">
                  No more items to show
                </p>
                <button
                  onClick={resetCards}
                  className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
                >
                  Reset Cards
                </button>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex justify-center items-center w-full max-w-sm gap-4">
            <XMarkButton onClick={() => animateSwipe("left")} />
            <RedoButton onClick={canRedo ? handleRedo : undefined} />
            <BellButton onClick={() => animateSwipe("right")} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SwipeCards;
