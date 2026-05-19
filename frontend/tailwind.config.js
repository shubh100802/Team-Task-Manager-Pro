/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "#020617",
          card: "#0f172a",
          border: "#1e293b",
          primary: "#6366f1",
          accent: "#22d3ee",
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444",
        },
      },
      boxShadow: {
        soft: "0 18px 40px rgba(2, 6, 23, 0.35)",
        panel: "0 12px 30px rgba(2, 6, 23, 0.28)",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};
