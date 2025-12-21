import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // If we have a saved theme, use it
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    } else {
      // No saved theme, use time-based theme
      const hour = new Date().getHours();
      const isNightTime = hour < 6 || hour >= 18; // 6pm to 6am is night time
      
      // Set initial theme based on time
      setIsDarkMode(isNightTime);
      document.documentElement.classList.toggle('dark', isNightTime);
      
      // Save the initial theme
      localStorage.setItem('theme', isNightTime ? 'dark' : 'light');
    }
    
    setIsMounted(true);
  }, []);

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    
    // Update the theme
    document.documentElement.classList.toggle('dark', newIsDarkMode);
    
    // Save the preference
    localStorage.setItem('theme', newIsDarkMode ? 'dark' : 'light');
    
    // Update the state
    setIsDarkMode(newIsDarkMode);

    // Dispatch theme change event
    const event = new CustomEvent('themeChange', {
      detail: { isDarkMode: newIsDarkMode }
    });
    window.dispatchEvent(event);
  };

  // Theme context style toggle function
  const toggleThemeContext = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';

    // Update the theme
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save to localStorage
    localStorage.setItem('theme', newTheme);

    // Update state
    setIsDarkMode(!isDarkMode);

    // Notify other components
    const event = new CustomEvent('themeChange', {
      detail: { isDarkMode: !isDarkMode }
    });
    window.dispatchEvent(event);
  };

  return (
      <div className="ml-4 relative">
        <label htmlFor="darkModeToggle" className="cursor-pointer">
          <input
              type="checkbox"
              id="darkModeToggle"
              className="hidden"
              checked={isDarkMode}
              onChange={toggleTheme}  // Using the original toggle function
          />
          <div className="relative w-6 h-6">
            <AnimatePresence mode="wait">
              {isDarkMode ? (
                  <motion.div
                      key="moon"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.3 }}
                      className="group"
                      style={{ position: 'relative' }}
                  >
                    <div className="text-gray-700 group-hover:text-black transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </motion.div>
              ) : (
                  <motion.div
                      key="sun"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.3 }}
                      className="group"
                      style={{ position: 'relative' }}
                  >
                    <div className="text-gray-700 group-hover:text-black transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                      </svg>
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
        </label>
      </div>
  );
};

export default DarkModeToggle;