/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ufc-blue': '#004C8C',
        'ufc-blue-light': '#0066CC',
        'success': '#28A745',
        'warning': '#FFC107',
        'danger': '#DC3545',
        'gray-dark': '#333333',
        'gray-medium': '#666666',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
