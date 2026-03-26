/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        vipGold: {
          50: "#FFF7E6",
          100: "#FFE7BF",
          200: "#FFD38A",
          300: "#F7B95B",
          400: "#E7A23A",
          500: "#C88A2E", // main gold
          600: "#A56F25",
          700: "#7B531D",
          800: "#4F3613",
          900: "#2B1D0A",
        },
        vipBlack: "#070707",
      },
    },
  },
  plugins: [],
};
