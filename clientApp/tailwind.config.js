/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: "#00a2ff",
        bluesecond: "#57cfe4",
        primary: '#0C4A60',     // Dark teal
        secondary: '#EF6C33',   // Orange
        tertiary: '#ABDFF1',    // Light blue
        quaternary: '#E1DDDB',  // Light gray
        'primary-dark': '#00224f',
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [],
}
