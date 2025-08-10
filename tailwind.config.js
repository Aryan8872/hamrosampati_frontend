/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        ManropeRegular: ["Manrope-Regular"],
        ManropeMedium: ["Manrope-Medium"],
        ManropeBold: ["Manrope-Bold"],
        ManropeSemiBold: ["Manrope-SemiBold"],
        ManropeLight: ["Manrope-Light"]
      },
      screens: {
        "lgx": "1105px",
        "smx": "410px"
      },
      backgroundColor: {
        buttonColor: "#2563eb",
        bodyBgColor: "#F6F8FC",
        navbarBgColor: "#F6F7FB",
      },
      colors: {
        buttonColor: "#2563eb",
        navbarButtonTextColor: "#374151"

      },
    },
  },
  plugins: [],
}