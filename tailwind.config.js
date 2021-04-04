module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        bookBlue:'#496184',
        primary: '#FF6363',
        secondary: {
          100: '#E2E2D5',
          200: '#888883',
        },
        terraCotta: {
          100: '#F4CABD',
          200: '#F1BDAD',
          300: '#EDAC99',
          400: '#E89780',
          500: '#E27D60',
          600: '#B5644D',
          700: '#91503E',
          800: '#744032',
          900: '#5D3328',
        },
        puertoRico: {
          100: '#B1E0D9',
          200: '#9DD8D0',
          300: '#85CEC4',
          400: '#67C2B5',
          500: '#41B3A3',
          600: '#348F82',
          700: '#2A7268',
          800: '#225B53',
          900: '#1B4942',
        },
        tumbleweed: {
          100: '#F6DBC9',
          200: '#F4D2BC',
          300: '#F1C7AB',
          400: '#EDB996',
          500: '#E8A87C',
          600: '#BA8663',
          700: '#956B4F',
          800: '#77563F',
          900: '#5F4532',
        },
        viola: {
          100: '#E7D1D7',
          200: '#E1C5CD',
          300: '#D9B6C1',
          400: '#CFA4B1',
          500: '#C38D9E',
          600: '#9C717E',
          700: '#7D5A65',
          800: '#644851',
          900: '#503A41',
        },
        bermuda: {
          100: '#CDF1E3',
          200: '#C1EDDC',
          300: '#B1E9D3',
          400: '#9DE3C8',
          500: '#85DCBA',
          600: '#6AB095',
          700: '#558D77',
          800: '#44715F',
          900: '#365A4C',
        }
      },
      fontFamily: {
        body: ['Roboto Slab']
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
