/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        danger: {
          100: "#ff6c8b",
        },
        success: {
          100: "#a4ff8d",
        },
        dark: {
          100: "#1e1e1e",
          200: "#242424"
        }
      }
    },
  },
  plugins: [],
}
