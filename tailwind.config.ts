import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          bg:   "#0D0221", // fond très profond
          a:    "#FF1FA8", // magenta (logo)
          b:    "#19D3FF", // cyan (logo)
          c:    "#57D144", // vert (logo)
          d:    "#FFD51F", // jaune (logo)
          ink:  "#F7F8FF", // texte clair
        },
      },
      boxShadow: {
        glass: "0 10px 40px rgba(0,0,0,.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      }
    },
  },
  plugins: [],
};

export default config;
