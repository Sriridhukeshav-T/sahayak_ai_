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
        navy: {
          950: '#060a16',
          900: '#0b1329',
          850: '#0e172e',
          800: '#0f172a',
          700: '#1e293b',
          600: '#334155',
        },
        gov: {
          blue: '#1d4ed8',
          dark: '#1e40af',
          light: '#3b82f6',
          sky: '#0284c7',
        },
        brand: {
          teal: '#0d9488',
          emerald: '#059669',
          amber: '#d97706',
          danger: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
