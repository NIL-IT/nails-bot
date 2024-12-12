/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      montserrat: ["Montserrat", "sans-serif"],
      manrope: ["Manrope", "sans-serif"],
    },
    fontSize: {
      base: ["10px", "12,19px"],
      xl: "12px",
      "2xl": "15px",
      "3xl": "20px",
    },
    colors: {
      primary: "#DC46A0",
      secondary: "#982CA5",
      black: "#000",
      white: "#fff",
      gray: "#FAFAFA",
      gray_dark: "#707070",
    },
    extend: {},
  },
  plugins: [],
};
