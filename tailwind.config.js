/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        app: "#F0F2F5",
        surface: "#FFFFFF",
        primary: "#4CAF50",
        strong: "#344767",
        default: "#FFFFFF"
      }
    }
  },
  plugins: [],
};
