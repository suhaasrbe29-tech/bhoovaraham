/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0b2545',
          navyLight: '#13315c',
          navyDark: '#07182d',
          blue: '#134074',
          blueAccent: '#1d4ed8',
          saffron: '#d97706',
          saffronDark: '#b45309',
          saffronLight: '#fef3c7',
          green: '#15803d',
          greenLight: '#dcfce7',
          slate: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          text: '#0f172a',
          textMuted: '#64748b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
