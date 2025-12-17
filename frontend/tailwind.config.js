/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode using class strategy
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // custom red color
      colors: {
        'custom-red': '#ea2e0e',
        'accent': '#571100',
        'nav-grey': '#bdc7df',
        // Add dark mode colors
        dark: {
          primary: '#1a1a1a',
          secondary: '#2d2d2d',
          text: '#f5f5f5'
        }
      },
      // custom ring width
      ringWidth: {
        '0.5': '0.5px',
      },
    },
  },
  plugins: [],
}