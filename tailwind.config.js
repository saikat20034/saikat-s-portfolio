/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#080D17',
          900: '#0B1220',
          800: '#121B2E',
          700: '#1A2540',
          600: '#293554',
        },
        paper: '#EDEFF3',
        muted: '#8A97B4',
        brass: {
          400: '#D9B268',
          500: '#C99A4A',
          600: '#AD7E33',
        },
        signal: '#4FA97A',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(237,239,243,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(237,239,243,0.035) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '36px 36px',
      },
    },
  },
  plugins: [],
};
