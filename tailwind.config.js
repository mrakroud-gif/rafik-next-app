module.exports = {
  darkMode: 'class',
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#360f5a",   // violet Rafik (fond)
          dark:   "#2b0c49",
          fg:     "#ffffff",
          cyan:   "#00d1ff",
          pink:   "#ff2daa",
          lime:   "#2ee66b",
          sun:    "#ffd44d"
        }
      },
      boxShadow: { soft: "0 10px 30px rgba(0,0,0,0.08)" },
      borderRadius: { "2xl": "1.25rem" }
    }
  },
  plugins: []
};
