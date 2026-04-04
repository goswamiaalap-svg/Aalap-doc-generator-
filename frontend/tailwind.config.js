/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#1e293b',
        background: '#f8fafc',
        surface: '#ffffff',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
