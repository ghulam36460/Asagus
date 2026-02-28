/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1D4DF1',
          black: '#000000',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        display: ['var(--font-azonix)', 'sans-serif'],
        body: ['var(--font-roboto)', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(29, 77, 241, 0.5)',
        'glow-lg': '0 0 40px rgba(29, 77, 241, 0.6)',
      },
    },
  },
  plugins: [],
}
