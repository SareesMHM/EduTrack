/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#14222B', soft: '#46565F', faint: '#7A8A92' },
        paper: { DEFAULT: '#F3F6F6', raised: '#FFFFFF', line: '#DCE3E4' },
        brand: { DEFAULT: '#12706B', dark: '#0B4F4B', light: '#E2F1EF' },
        shelf: '#0E2A30',
        warn: { DEFAULT: '#B7791F', light: '#FBF1DC' },
        bad: { DEFAULT: '#B4381F', light: '#FBE7E2' },
        good: { DEFAULT: '#1F7A45', light: '#E1F3E8' },
      },
      fontFamily: { sans: ['Figtree', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'] },
    },
  },
  plugins: [],
};
