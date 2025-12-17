import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
} from "framer-motion";
import React, { useRef, useState, useLayoutEffect } from "react";

const VelocityText = () => {
  const targetRef = useRef(null);
  const textRef = useRef(null);

  const [textWidth, setTextWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  useLayoutEffect(() => {
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
  const skewX = useSpring(skewXRaw, { mass: 3, stiffness: 300, damping: 50 });

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

  // Make "the" disappear instantly at 40% scroll using step function
  const showThe = useTransform(
    scrollYProgress,
    [0, 0.4, 0.4],  // Show until exactly 40%, then hide
    [1, 1, 0],
    { clamp: true }
  );
  
  // Set opacity and scale based on showThe
  const theOpacity = showThe;
  const theScale = showThe;

  // Move "north." towards "chase" - start earlier and complete by 85%
  const northX = useTransform(
    scrollYProgress,
    [0.4, 0.6],  // Start at 70%, complete by 85%
    [0, -181],
    { 
      clamp: true,
      // Simple linear easing for reliability
      ease: (t) => t
    }
  );
  
  // Custom easing function for smooth zoom
  const smoothEase = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  // Zoom effect that starts at 85% scroll
  const zoomScale = useTransform(
    scrollYProgress,
    [0.65, 1],  // Start zooming at 65% scroll
    [1, 230],    // Scale from 1x to 10x (increased from 5x)
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

  // Background transition effect that starts at 90% scroll
  const backgroundTransition = useTransform(
    scrollYProgress,
    [0.9, 1],  // Start transitioning background at 90% scroll
    ["#fff", "#000"],
    { clamp: true }
  );

  // Section height for the animation container

  return (
      <motion.section
          ref={targetRef}
          className="h-[300vh] bg-neutral-50 text-neutral-950"
          style={{ backgroundColor: backgroundTransition }}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          {/* Horizontal scrolling text */}
            <motion.div
              ref={textRef}
              style={{ 
                skewX, 
                x, 
                willChange: 'transform' // Optimize performance
              }}
              className="absolute whitespace-nowrap text-4xl font-black uppercase leading-[0.85] sm:text-5xl md:text-7xl"
            >
              The world beyond awaits those who dare to
            </motion.div>

          {/* Sticky last words - aligned with scrolling text */}
          <motion.div
              className="absolute left-0 top-0 w-full flex items-center justify-center text-4xl font-black uppercase sm:text-5xl md:text-7xl pointer-events-none"
              style={{
                opacity: showSticky,
                scale: stickyScale,
                x: stickyX,
                skewX,
                zIndex: 10,
                whiteSpace: 'nowrap',
                transition: 'transform 0.3s ease-out',
                height: '100%'
              }}
          >
            <motion.div style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              willChange: 'transform',
              transform: 'translateY(-6px)' // Move the text up by 10px
            }}>
              <motion.span style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                scale: zoomScale,
                transformOrigin: 'center',
                willChange: 'transform',
                position: 'relative',
                zIndex: 20
              }}>
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
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
  );
};

export default VelocityText;
