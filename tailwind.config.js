/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // adjust as needed for your file types
  ],
  theme: {
    extend: {}, // optional: customize colors, spacing, fonts, etc.
  },
  plugins: [
  require('@tailwindcss/forms'),
  require('@tailwindcss/typography'),
] , // optional: add Tailwind plugins here

};
