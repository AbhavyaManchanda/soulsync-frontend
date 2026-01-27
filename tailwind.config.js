/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 👈 Ye dark mode toggle ke liye zaroori hai
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 👈 Ye batata hai Tailwind ko ki kahan classes dhundni hain
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        secondary: "#7c3aed",
      }
    },
  },
  plugins: [],
}