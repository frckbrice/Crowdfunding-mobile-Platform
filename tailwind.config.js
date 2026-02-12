/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3D38ED',
        primaryMuted: '#C9C8FA',
        background: '#F5F5F5',
        dark: '#141518',

        lightGray: '#D8DCE2',
        secondary: {
          DEFAULT: "#FF9C01",
          100: "#FF9001",
          200: "#FF8E01",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        lightGray: {
          100: '#CDCDE0',
          200: '#626D77',
        },
        fontFamily: {
          pthin: ["Poppins-Thin", "sans-serif"],
          pextralight: ["Poppins-ExtraLight", "sans-serif"],
          plight: ["Poppins-Regular", "sans-serif"],
          pmedium: ["Poppins-medium", "sans-serif"],
          psemibold: ["Poppins-SemiBold", "sans-serif"],
          pbold: ["Poppins-Bold", "sans-serif"],
          pblack: ["Poppins-Black", "sans-serif"],
        }
      },
      backgroundImage: {
        "login-image": "url('./assets/images/1riche1povreloginimg.png')",
      }
    },
  },
  plugins: [],
}
