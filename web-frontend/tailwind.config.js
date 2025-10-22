/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        secondary: '#06b6d4',
        accent: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
      }
    },
  },
  plugins: [],
}
