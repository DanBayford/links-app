/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html",
    "./templates/**/*.svg",
    "./frontend/inputs.css",
    "./frontend/src/**.*.jsx",
  ],
  theme: {
    extend: {
      // fontFamily: {
      //   sans: ["InstrumentSans", "sans"],
      // },
      colors: {
        // purple: {
        //   600: "rgb(99,60,225)",
        // },
        indigo: {
          // 50: "rgb(239,235,255)",
          // 300: "rgb(190,173,255)",
        },
        gray: {
          // 50: "rgb(250,250,250)",
          // 300: "rgb(217,217,217)",
          // 500: "rgb(115,115,115)",
          // 800: "rgb(51,51,51)",
        },
        red: {
          // 500: "#rgb(255,57,57)",
        },
        // white: "rgb(255,255,255)",
      },
    },
  },
  plugins: [],
};
