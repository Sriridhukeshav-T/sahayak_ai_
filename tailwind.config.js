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
        civic: {
          primary: '#065F46',
          dark: '#064E3B',
          accent: '#0F766E',
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          text: '#0F172A',
          muted: '#475569',
          border: '#E2E8F0',
          success: '#15803D',
          warning: '#B45309',
          error: '#B91C1C',
          info: '#0369A1',
        },
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
        }
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '10px',
        '2xl': '12px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
