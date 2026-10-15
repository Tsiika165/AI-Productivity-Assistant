module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { ink: "#14213D", mist: "#EEF2F6", signal: "#0F766E", flag: "#B45309" },
      fontFamily: { sans: ["var(--font-plex)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
