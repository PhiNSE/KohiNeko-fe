/** @type {import('tailwindcss').Config} */

import { keyframes } from '@emotion/react';

// eslint-disable-next-line no-undef
const plugin = require('tailwindcss/plugin');
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: 'Afacad',
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        full: '20px',
        large: '12px',
      },
      colors: {
        primary: '#B96714',
        secondary: '#ff9933',
      },
      keyframes: {
        'open-menu': {
          '0%': { transform: 'scaleY(0)' },
          '80%': { transform: 'scaleY(1.1)' },
          '100%': { transform: 'scaleY(1)' },
        },
        'close-menu': {
          '0%': { transform: 'scaleY(1)' },
          '80%': { transform: 'scaleY(1.1)' },
          '100%': { transform: 'scaleY(0)' },
        },
      },
      animation: {
        'open-menu': 'open-menu 0.3s ease-in-out forwards',
        'close-menu': 'close-menu 0.3s ease-in-out forwards',
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        h1: { fontSize: theme('fontSize.3xl') },
        h2: { fontSize: theme('fontSize.2xl') },
        h3: { fontSize: theme('fontSize.xl') },
      });
    }),
    // eslint-disable-next-line no-undef
    require('tw-elements/dist/plugin.cjs'),
  ],
};
