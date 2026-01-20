import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import mountainImage from "../../assets/Jetski.jpg";
import { useNavigate } from 'react-router-dom';

const ParallaxSection2 = () => {
  const navigate = useNavigate();
  const container = useRef();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  
  // Adjust parallax effect for mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    isMobile ? ["-10vh", "10vh"] : ["-15vh", "5vh"]
  );
  
  const opacity = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    isMobile ? [0.9, 1, 0.9] : [0.8, 1, 0.8]
  );

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center h-screen overflow-hidden bg-black"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="fixed top-[-15vh] left-0 h-[130vh] w-full pointer-events-none">
        <motion.div 
          style={{ y, opacity }} 
          className="relative w-full h-full"
        >
          <img 
            src={mountainImage}
            alt="Majestic mountain landscape" 
            className="w-full h-full object-cover mix-blend-overlay pointer-events-auto" 
          />
        </motion.div>
      </div>

      <h3 className="absolute top-12 left-6 text-white uppercase z-10 text-sm md:text-base lg:text-lg select-none">
        Endless Horizons
      </h3>

      {/* Container for text and button with consistent spacing */}
      <div className="absolute inset-x-6 bottom-24 z-10">
        {/* Text with responsive sizing and spacing */}
        <p className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-3xl mb-2 md:mb-4 select-none">
          Discover the perfect blend of adventure and style with our curated collection
        </p>
      </div>

      {/* Original button with its existing positioning */}
      <div className="absolute bottom-12 left-6 right-6 sm:left-6 sm:right-auto z-10">
        <button
            onClick={() => navigate('/collections/all')}
            className="bg-transparent border-2 border-white text-white px-6 py-2 text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-300"
        >
          Explore Collection
        </button>
      </div>
    </div>
  );
};

export default ParallaxSection2;
