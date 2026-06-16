/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0f172a',
        'bg-card': '#1e293b',
        'bg-card-hover': '#334155',
        'accent-primary': '#6366f1',
        'accent-secondary': '#06b6d4',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
