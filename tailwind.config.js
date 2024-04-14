/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  safelist: ['p-small', 'p-middle', 'p-large'],
  theme: {
    color: {
      title: 'red'
    },
    extend: {
      padding: {
        small: '0.5rem',
        middle: '0.75rem',
        large: '1rem'
      },
      backgroundColor: {
        header: 'rgb(250, 250, 250)'
      },
      borderColor: {
        divider: 'rgb(240, 240, 240)'
      }
    }
  },

  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.flex-center': {
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center'
        },
        '.flex-between': {
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'space-between'
        }
      });
    })
    // require('tailwind-scrollbar')
  ]
};

// uno.config.ts
// import { defineConfig, presetAttributify, presetUno } from 'unocss';

// export default defineConfig({
//   presets: [presetAttributify({}), presetUno()],
//   rules: [['will-change-transform', { 'will-change': 'transform' }]],
//   shortcuts: [
//     ['flex-center', 'flex items-center justify-center'],
//     ['flex-between', 'flex items-center justify-between'],
//     ['table-border', 'border-0 border-#e5e7eb border-solid'],
//     ['table-outline', 'outline outline-1 outline-#2680EB']
//   ]
// });
