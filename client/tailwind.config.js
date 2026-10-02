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
          saffron: '#FF9933',
          navy: '#002B49',
          blue: '#0b4a72',
          green: '#138808',
          gold: '#C5A059',
          lightBg: '#F8FAFC',
          cardBg: '#FFFFFF',
          border: '#E2E8F0',
          textDark: '#0F172A',
          textMuted: '#64748B'
        }
      }
    },
  },
  plugins: [],
}
