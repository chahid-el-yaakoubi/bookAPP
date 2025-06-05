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
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-scale': {
          '0%': { transform: 'scale(0.5)', opacity: '0' }, // Corrected scale format
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-scale-reverse': { // Reverse animation
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.5)', opacity: '0' },
        }

      },
      animation: {
        'slide-up': 'slide-up 0.2s ease-out',
        'slide-scale': 'slide-scale 0.3s ease-out',
        'slide-scale-reverse': 'slide-scale-reverse 2s ease-out',
      }
    },
  },
  plugins: [],
}
