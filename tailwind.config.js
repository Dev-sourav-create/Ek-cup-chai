/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        chaiBrown: "#c49a6c",
      },
      backgroundColor: {
        DEFAULT: "var(--background)",
      },
      textColor: {
        DEFAULT: "var(--foreground)",
      },
      fontFamily: {
        pacifico: ["var(--font-pacifico)"],
        poppins: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
