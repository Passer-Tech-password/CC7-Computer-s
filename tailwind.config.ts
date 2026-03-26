import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      colors: {
        "primary-red": "#E63946",
        "primary-blue": "#4361EE",
        "primary-yellow": "#F4D35E",
        dark: "#1D3557",
        light: "#F1FAEE"
      },
      boxShadow: {
        glow: "0 10px 30px rgba(67, 97, 238, 0.25)"
      }
    }
  },
  plugins: []
} satisfies Config;
