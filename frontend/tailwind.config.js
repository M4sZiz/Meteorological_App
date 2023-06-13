/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    
  ],
  theme: {
    extend: {
      colors: {
        primary: '#488cc2',
        secondary: '#008322',
        text: '#333333',
        backgrounds: {
          body: '#F5F5F5',
          card: '#EAEAEA',
          table: '#0D4067',
          hover: '#121B2C',
        },
        button: {
          text: '#FFFFFF',
          background: '#008322',
          hover: '#006322',
        },
      },
    },
  },
  plugins: [],
}

