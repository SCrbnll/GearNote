/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "media", // activado por sistema, pero aquí defines solo colores claros (modo claro)
  theme: {
    extend: {
      colors: {
        // Color primario principal
        primary: "#FE9525",
        secondary: "#B0B0B0",
        error: "#E57373",
        success: "#81C784",

        ui: {
          header: "#1A3A66",  
          body: "#0B223D",  
          footer: "#1A3A66",  
          secondary: "#1E1E1E", 
        },

        separator: "#ffcc96",

      },
    },
  },
  plugins: [],
};
