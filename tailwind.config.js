/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],  presets: [require("nativewind/preset")],
  darkMode: "media", 
  theme: {
    extend: {
      colors: {
        primary: "#FE9525",
        secondary: "#B0B0B0",
        error: "#E57373",
        success: "#81C784",
        gray: "#4F4F4F",

        ui: {
          header: "#1A3A66",  
          body: "#0B223D",  
          footer: "#1A3A66",  
          secondary: "#1E1E1E",
          card: "#1A3A66", 
        },

        separator: "#ffcc96",

      },
    },
  },
  plugins: [],
};
