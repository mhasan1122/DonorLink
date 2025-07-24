/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  // Temporarily remove NativeWind preset to avoid aspect-ratio parsing issues
  // presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#D32F2F',
        'primary-dark': '#C62828',
        secondary: '#FFFFFF',
        text: '#333333',
        accent: '#1976D2',
        safe: '#4CAF50',
        alert: '#FFC107',
      },
      fontFamily: {
        base: ['Roboto', 'San Francisco', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        lg: '12px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    aspectRatio: false, // Disable aspect-ratio utilities to fix parseAspectRatio error
  },
}