
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#F6F5F0",
        surface: "#FFFEFA",
        raised: "#F0F1EA",
        edge: "#E1E4DB",
        fg: "#29382D",
        mute: "#747D72",
        signal: "#285D40",
        spark: "#94604F",
        volt: "#477956",
        flag: "#9A6539",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        rise: {
          "0%": { opacity: 0, transform: "translateY(5px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        blink: {
          "0%,80%,100%": { opacity: 0.2 },
          "40%": { opacity: 1 },
        },
        spin360: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        rise: "rise .25s ease-out both",
        blink: "blink 1.2s infinite both",
        spin360: "spin360 .8s linear infinite",
      },
    },
  },
  plugins: [],
};
