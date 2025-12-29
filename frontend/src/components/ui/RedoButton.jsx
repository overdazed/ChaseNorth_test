import React from 'react';
import { motion } from 'framer-motion';
import RedoIcon from '../../assets/redo.svg';

const RedoButton = ({ onClick, disabled = false }) => {
  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-colors ${
        disabled 
          ? 'bg-neutral-300 cursor-not-allowed' 
          : 'bg-neutral-300 hover:bg-neutral-300 cursor-pointer'
      }`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      aria-label="Redo last action"
    >
      <img 
        src={RedoIcon} 
        alt="Redo" 
        className={`w-6 h-6 ${disabled ? 'opacity-50' : ''}`}
        style={{ transform: 'rotate(0deg)' }}
      />
    </motion.button>
  );
};

export default RedoButton;
