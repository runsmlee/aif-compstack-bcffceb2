import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#C7452E',
          50: '#FDF4F2',
          100: '#FAE5E0',
          200: '#F4C8BD',
          300: '#EBA595',
          400: '#DE7A64',
          500: '#C7452E',
          600: '#B33A26',
          700: '#963020',
          800: '#7A281D',
          900: '#5F2017',
          950: '#3D140F',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 0 rgba(0, 0, 0, 0.2)',
        'card-hover': '0 4px 12px -2px rgba(0, 0, 0, 0.4), 0 2px 6px -1px rgba(0, 0, 0, 0.3)',
        'glow-brand': '0 0 0 1px rgba(199, 69, 46, 0.3), 0 2px 8px -2px rgba(199, 69, 46, 0.25)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
