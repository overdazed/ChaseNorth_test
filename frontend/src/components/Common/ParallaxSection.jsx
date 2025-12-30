import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import spiralImage from "../../assets/spiral-circles.jpg";

const ParallaxSection = () => {
  const container = useRef();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      // Set initial value
      checkMobile();
      
      // Add event listener for window resize
      window.addEventListener('resize', checkMobile);
      
      // Clean up
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  
  // Adjust parallax effect based on device
  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    isMobile ? ["-5vh", "5vh"] : ["-10vh", "10vh"]
  );

  return (
    <div
      ref={container}
      className="select-none relative flex items-center justify-center h-screen overflow-hidden"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="fixed top-[-10vh] left-0 h-[120vh] w-full pointer-events-none">
        <motion.div 
          style={{ y }} 
          className="relative w-full h-full"
        >
          <img 
            src={spiralImage}
            alt="Abstract spiral circles" 
            className="w-full h-full object-cover pointer-events-auto" 
          />
        </motion.div>
      </div>

      <h3 className="absolute top-8 sm:top-12 right-4 sm:right-6 text-white uppercase z-10 text-xs sm:text-sm md:text-base lg:text-lg px-2 py-1 sm:bg-transparent sm:px-0 sm:py-0">
        Anatomy of Possibility
      </h3>

      <div className={`absolute right-4 sm:right-6 bottom-12 sm:bottom-12 z-10 w-full flex justify-end`}>
        <p className="text-white text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-5xl text-right">
          Every section is a frame for your story.<br className="sm:hidden" /> Shape it, remix it, and let your content spill<br className="sm:hidden" /> into unexpected patterns that keep people scrolling.
        </p>
      </div>
    </div>
  );
};

export default ParallaxSection;
