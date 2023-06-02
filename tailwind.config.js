/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "bright-lilac": "#DF9AF6",
        "green-sheen": "#7ABEA2",
        "orange-yellow": "#FBD26D",
        cornsilk: "#FEF5DD",
        "light-red": "#F4CECB",
      },
      fontFamily: {
        sans: ["Graphik", "sans-serif"],
        serif: ["--var(--font-merriweather)"],
        // mono: ["Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
