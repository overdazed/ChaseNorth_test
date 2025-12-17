import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
} from "framer-motion";
import React, { useRef, useState, useLayoutEffect, useEffect } from "react";

const VelocityText = () => {
  const targetRef = useRef(null);
  const textRef = useRef(null);

  const [textWidth, setTextWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [transformOrigin, setTransformOrigin] = useState('35.7% 60%');

  useLayoutEffect(() => {
    // Set transform origin based on time of day
    const updateTransformOrigin = () => {
      const hours = new Date().getHours();
      const isNightTime = hours >= 18 || hours < 6; // 6 PM to 6 AM
      setTransformOrigin(isNightTime ? 'center' : '35% 35%');
    };

    updateTransformOrigin();
    
    if (textRef.current) {
      setTextWidth(textRef.current.scrollWidth);
      setViewportWidth(window.innerWidth);
    }
    const handleResize = () => {
      if (textRef.current) {
        setTextWidth(textRef.current.scrollWidth);
        setViewportWidth(window.innerWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"], // full section
  });

  const scrollVelocity = useVelocity(scrollYProgress);
  const skewXRaw = useTransform(scrollVelocity, [-0.5, 0.5], ["45deg", "-45deg"]);
  const skewX = useSpring(skewXRaw, { mass: 3, stiffness: 200, damping: 50 });

  // Start text off-screen to the right and scroll in
  const startX = viewportWidth; // Start off-screen to the right
  const maxScrollDistance = -(textWidth + viewportWidth); // Scroll distance to bring text in
  // Faster animation by completing the scroll in 50% of the scroll distance
  const x = useTransform(
    scrollYProgress,
    [0, 0.5],  // Complete the scroll in the first 50% of the scroll distance
    [startX, maxScrollDistance],
    { clamp: true }
  );

  // Track scroll progress for the main animation
  const mergePhase = useTransform(
    scrollYProgress,
    [0, 1],  // Extended the range to make the merge phase slower
    [0, 1],
    { clamp: true }
  );

  // Show sticky text immediately
  const showSticky = useTransform(
    scrollYProgress,
    [0, 0.1],  // Show immediately and be fully visible by 10% scroll
    [0, 1],
    { clamp: true }
  );

  // Slide in from right with offset for centering
  const stickyX = useTransform(
    scrollYProgress,
    [0.25, 0.33],  // Start at 10%, complete by 30% of scroll
    ['120%', '-17.85%'],
    { clamp: true }
  );

  // Keep scale constant
  const stickyScale = 1;

  // For the "the" animation - combines fade and scale effects
  // Exponential ease-in function for smooth fade-out
  const exponentialEaseIn = (t) => {
    return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
  };

  // Make "the" fade out gradually based on scroll position
  const showThe = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5],  // Start fading at 30%, complete fade by 60%
    [1, 1, 0],      // Full opacity at 30%, fully transparent at 60%
    {
      clamp: true,
      // Use smooth easing for a more natural fade
      ease: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    }
  );

  // Set opacity and scale based on showThe
  const theOpacity = showThe;
  const theScale = showThe;

  // Calculate northX based on viewport width for responsive movement
  const getNorthXValue = () => {
    if (typeof window === 'undefined') return -100; // Default server-side value
    
    const width = window.innerWidth;
    
    // Adjusted values for better small screen behavior
    if (width < 480) return -113;      // Mobile (small) - significantly reduced from -300
    if (width < 768) return -135;     // Mobile (large)
    if (width < 1024) return -120;    // Tablet
    if (width < 1280) return -180;    // Laptop
    return -181;                      // Desktop
  };

  // Move "north." towards "chase" - responsive movement
  const northX = useTransform(
    scrollYProgress,
    [0.3, 0.7],  // Start at 30%, complete by 70% of scroll
    [0, getNorthXValue()],
    {
      clamp: true,
      ease: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    }
  );
  
  // Update on resize
  React.useEffect(() => {
    const updateNorthX = () => {
      northX.set(getNorthXValue());
    };
    
    window.addEventListener('resize', updateNorthX);
    return () => window.removeEventListener('resize', updateNorthX);
  }, [northX]);

  // Custom easing function for smooth zoom
  const smoothEase = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  // Zoom effect that starts at 85% scroll
  const zoomScale = useTransform(
    scrollYProgress,
    [0.7, 1.2],  // Start zooming at 65% scroll
    [1, 400],    // Scale from 1x to 10x (increased from 5x)
    {
      clamp: true,
      ease: smoothEase
    }
  );

  // Text fade-out effect that starts at 80% scroll
  const textFadeOut = useTransform(
    scrollYProgress,
    [0.8, 1],  // Start fading out at 80% scroll
    [1, 0],
    { clamp: true }
  );

  // Background transition effect - keeping it white
  const backgroundTransition = useTransform(
    scrollYProgress,
    [0.9, 1],  // Range where the transition would happen
    ["#fff", "#fff"],  // Both start and end colors are white
    { clamp: true }
  );

  // // Background transition effect that starts at 90% scroll
  // const backgroundTransition = useTransform(
  //   scrollYProgress,
  //   [0.9, 1],  // Start transitioning background at 90% scroll
  //   ["#fff", "#000"],
  //   { clamp: true }
  // );

  // Section height for the animation container

  return (
    <motion.section
      ref={targetRef}
      className="h-[500vh] bg-neutral-50 text-neutral-950 relative"
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Horizontal scrolling text */}
          <motion.div
            ref={textRef}
            style={{
              skewX,
              x,
              willChange: 'transform',
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              transform: 'translateY(-50%)'
            }}
            className="whitespace-nowrap text-3xl font-black uppercase leading-[0.85] sm:text-4xl md:text-5xl lg:text-7xl text-center"
          >
            The world beyond awaits those who dare to
          </motion.div>

          {/* Sticky last words - positioned relative to the same container */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center text-3xl font-black uppercase sm:text-4xl md:text-5xl lg:text-7xl pointer-events-none"
            style={{
              opacity: showSticky,
              scale: stickyScale,
              x: stickyX,
              skewX,
              zIndex: 10,
              whiteSpace: 'nowrap',
              transition: 'top 0.3s ease-out, transform 0.3s ease-out',
              top: typeof window !== 'undefined' ?
                (window.innerWidth < 640 ? '47.4%' :
                 window.innerWidth < 768 ? '49%' : '50%') : '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          >
            <motion.span
              style={{
                x: stickyX,
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                left: '0' // Centered
              }}
            >
              <motion.span
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  scale: zoomScale,

                  transformOrigin: transformOrigin,
                  willChange: 'transform',
                  position: 'relative',
                  zIndex: 20
                }}
              >
                <div className="mt-3 md:mt-0">
                  <span>chase</span>
                  <motion.span
                    style={{
                      opacity: theOpacity,
                      margin: "0 0.25em",
                      display: "inline-block",
                      transformOrigin: 'center',
                      scale: theScale,
                      willChange: 'transform, opacity',
                      transition: 'opacity 3s ease-out, transform 3s ease-out'
                    }}
                  >
                    the
                  </motion.span>
                  <motion.span
                    className="relative"
                    style={{
                      x: useTransform(
                        [northX, scrollYProgress],
                        ([latestNorthX, latestScrollY]) => {
                          // On mobile (less than 768px), reduce the x-offset to 66.5% of original
                          if (typeof window !== 'undefined' && window.innerWidth < 768) {
                            return latestNorthX * 0.665;
                          }
                          return latestNorthX;
                        }
                      ),
                      display: 'inline-block'
                    }}
                  >
                    north
                    <motion.span
                      style={{
                        opacity: theOpacity,
                        display: 'inline-block',
                        transition: 'opacity 1s ease-out'
                      }}
                    >
                      .
                    </motion.span>
                  </motion.span>
                </div>
              </motion.span>
            </motion.span>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default VelocityText;
