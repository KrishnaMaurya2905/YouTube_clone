/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0F0F0F',
        'secondary': '#3F3F3F',
        'tertiary': '#0000ff',
      }
    },
  },
  plugins: [],
}