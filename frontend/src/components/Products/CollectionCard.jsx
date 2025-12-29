import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from "react-router-dom";

const CollectionCard = ({ 
  image, 
  gender, 
  isNightMode,
  colors = [[236, 72, 153], [232, 121, 249], [167, 139, 250]]
}) => {
  const [hovered, setHovered] = useState(false);
  
  const cardClass = `relative flex-1 h-[700px] overflow-hidden group ${isNightMode ? 'bg-neutral-900' : 'bg-white'}`;
  const contentClass = `absolute bottom-8 left-8 p-6 ${isNightMode ? 'bg-neutral-900/90 text-white' : 'bg-white/90 text-neutral-900'}`;
  const titleClass = `text-2xl font-bold mb-3`;
  const linkClass = `underline hover:opacity-80 transition-opacity ${isNightMode ? 'text-white' : 'text-neutral-900'}`;

  return (
    <div 
      className={cardClass}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={image}
        alt={`${gender}'s Collection`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      <motion.div 
        className={contentClass}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={titleClass}>
          {gender}'s Collection
        </h2>
        <Link
          to={`/collections/all?gender=${gender}`}
          className={linkClass}
        >
          Shop Now
        </Link>
      </motion.div>
    </div>
  );
};

export default CollectionCard;
