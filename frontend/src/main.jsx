import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Function to update favicon based on color scheme
const updateFavicon = (isDark) => {
  const favicon = document.getElementById('favicon');
  if (favicon) {
    favicon.href = isDark
      ? '/src/assets/ChaseNorth-white.svg'
      : '/src/assets/ChaseNorth-black.svg';
  }
};

// Create cursor container
const cursorContainer = document.createElement('div');
cursorContainer.id = 'cursor-root';
// Only append if not already in the document
if (!document.getElementById('cursor-root')) {
  document.body.appendChild(cursorContainer);
}

// Initialize theme from localStorage or system preference
if (typeof window !== 'undefined') {
  // Check for saved theme in localStorage
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Apply the theme
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
    updateFavicon(true);
  } else {
    document.documentElement.classList.remove('dark');
    updateFavicon(false);
  }
  
  // Set up listener for system color scheme changes (only if no theme is saved)
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleColorSchemeChange = (e) => {
    if (!localStorage.getItem('theme')) {
      const isDark = e.matches;
      document.documentElement.classList.toggle('dark', isDark);
      updateFavicon(isDark);
    }
  };
  
  darkModeMediaQuery.addEventListener('change', handleColorSchemeChange);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
