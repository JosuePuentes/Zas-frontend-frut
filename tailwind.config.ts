import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        superfruty: {
          yellow: '#F5D000',
          yellowDark: '#E5C000',
          black: '#0a0a0a',
          blackLight: '#1a1a1a',
          gray: '#6b7280',
          white: '#ffffff',
        },
        frutal: {
          mango: '#F5D000',
          fresa: '#E53935',
          mora: '#1a1a1a',
          kiwi: '#76B93F',
          banana: '#F5D000',
          naranja: '#E65100',
          uva: '#1a1a1a',
          sandia: '#E91E63',
          limon: '#76B93F',
          coco: '#5D4037',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
