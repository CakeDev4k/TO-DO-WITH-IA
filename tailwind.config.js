// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Isso é o mais importante!
  darkMode: 'class', 
  theme: {
    extend: {},
  },
  plugins: [],
}