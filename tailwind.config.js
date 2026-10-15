/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#060A12",      // page background
        surface: "#0B1322",   // cards
        raised: "#111C30",    // inputs, nested blocks
        edge: "#1F2F49",      // borders
        fg: "#E6EEF9",        // main text
        mute: "#8EA2BF",      // secondary text
        signal: "#22D3EE",    // primary accent (cyan)
        spark: "#F472B6",     // v1 / playful accent (pink)
        volt: "#A3E635",      // success accent (lime)
        flag: "#FACC15",      // warnings, missing info (amber)
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        rise: { "0%": { opacity: 0, transform: "translateY(8px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        blink: { "0%,80%,100%": { opacity: 0.2 }, "40%": { opacity: 1 } },
        spin360: { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        rise: "rise .35s ease-out both",
        blink: "blink 1.2s infinite both",
        spin360: "spin360 .8s linear infinite",
      },
    },
  },
  plugins: [],
};