/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
      colors: {
        'brand-gold': '#D4AF37', // Metallic Gold
        'brand-dark': '#051626', // Deep Navy Blue matching the logo background
        'brand-light': '#F5F5F5', // Light gray for contrast
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'], // Elegant serif for headings
        sans: ['Inter', 'sans-serif'], // Clean sans for body
      }
    },
    },
    plugins: [],
}
