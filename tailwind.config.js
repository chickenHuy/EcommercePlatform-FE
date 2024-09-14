/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
    },
    colors: {
      "black-primary": "#1f1f1f",
      "black-secondary": "#292929",
      "black-tertiary": "#3d3d3d",

      "white-primary": "#ffffff",
      "white-secondary": "#e6e6e6",
      "white-tertiary": "#828282",

      "gray-primary": "#c0c0c0",
      "gray-secondary": "#adadad",
      "gray-tertiary": "#959595",

      "transparent-primary": "#00000000",
    }
  },
  plugins: [],
};
