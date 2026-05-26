/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add custom colors for UNO game
        "card-red": "#EF4444",
        "card-blue": "#3B82F6",
        "card-green": "#10B981",
        "card-yellow": "#FBBF24",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};
