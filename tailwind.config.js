/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(22,36,28,0.04), 0 4px 12px rgba(22,36,28,0.05)',
      },
      colors: {
        brand: {
          50: '#EDF6F0',
          100: '#D6EBDD',
          200: '#AFD7BC',
          300: '#83C09B',
          400: '#59A87A',
          500: '#3A8F5F',
          600: '#2E7D52',
          700: '#256444',
          800: '#1E4F37',
          900: '#183F2C',
        },
      },
    },
  },
  plugins: [],
}
