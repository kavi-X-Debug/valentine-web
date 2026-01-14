/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        love: {
          light: '#FFF0F5', // Lavender Blush
          pink: '#FFB7C5',  // Cherry Blossom Pink
          red: '#E32636',   // Alizarin Crimson
          cream: '#FFFDD0', // Cream
          beige: '#F5F5DC', // Beige
          dark: '#5A1818',  // Dark Red/Brown for text
        }
      },
      fontFamily: {
        cursive: ['"Dancing Script"', 'cursive'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'hearts-pattern': "url('https://www.transparenttextures.com/patterns/heart-necklace.png')",
      }
    },
  },
  plugins: [],
}
