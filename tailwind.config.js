/** @type {import('tailwindcss').Config} */
import scrollbarFixPlugin from './scrollbar-fix-plugin'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a56db',
        secondary: '#7e3af2',
      },
    },
  },
  plugins: [scrollbarFixPlugin],
}
