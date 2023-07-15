/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/*.js'
  ], 
  darkMode: ['class', "[class~='dark']"],
  theme: {
    screens: {
      'mic': '640px',
      'mediu': '768px',
      'mare': '1280px',
      'fmare': '1680px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'alb': '#FFFFFF',
      'negru': '#000000',
      'verde_d': '#7AE582',
      'verde_i': '#25A18E',
      'aquamarin': '#9FFFCB',
      'albastru_d': '#00A5CF',
      'albastru_i': '#004E64',
      'albastru_fundal': '#002833',
      'violet_d': '#8C27A7',
      'violet_i': '#4A128F',
      'rosu_eroare': '#FF0000',
      'rosu_required': '#FF0066',
    },
    extend: {},
  },
  plugins: [
    
  ],
  prefix: 'tw-',
}

