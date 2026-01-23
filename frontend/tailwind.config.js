/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0f14",       // app background
        card: "#111827",     // cards / panels
        accent: "#10b981",   // primary accent (green)
      },
    },
  },
  plugins: [],
};
