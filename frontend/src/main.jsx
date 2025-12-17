import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Function to update favicon based on color scheme
const updateFavicon = (isDark) => {
  const favicon = document.getElementById('favicon');
  if (favicon) {
    favicon.href = isDark 
      ? '/src/assets/ChaseNorth-white.svg'
      : '/src/assets/ChaseNorth-black.svg';
  }
};

// Check system color scheme and set up listener
if (typeof window !== 'undefined') {
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Set initial favicon
  updateFavicon(darkModeMediaQuery.matches);
  
  // Update favicon when color scheme changes
  darkModeMediaQuery.addEventListener('change', (e) => {
    updateFavicon(e.matches);
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
