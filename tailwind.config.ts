import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        "primary-bg": "#2c7c8d",
        "secondary-bg": "#3B92A2",
        "action-bg": "#35F1B0",
        "brand-deep": "#1a5a66",
        "brand-mist": "#7ec8d4",
        correct: {
          DEFAULT: "#148a4b",
          soft: "#22b05f",
          deep: "#0f6f3c",
          glow: "rgba(20, 138, 75, 0.45)",
        },
        skip: {
          DEFAULT: "#c62828",
          soft: "#e53935",
          deep: "#a81f1f",
          glow: "rgba(198, 40, 40, 0.45)",
        },
        google: {
          "text-gray": "#3c4043",
          "button-blue": "#1a73e8",
          "button-blue-hover": "#5195ee",
          "button-dark": "#202124",
          "button-dark-hover": "#555658",
          "button-border-light": "#dadce0",
          "logo-blue": "#4285f4",
          "logo-green": "#34a853",
          "logo-yellow": "#fbbc05",
          "logo-red": "#ea4335",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "brand-wash":
          "radial-gradient(ellipse at 30% 20%, rgba(126, 200, 212, 0.35), transparent 55%), radial-gradient(ellipse at 80% 90%, rgba(53, 241, 176, 0.12), transparent 50%), linear-gradient(160deg, #2c7c8d 0%, #3B92A2 55%, #247a8a 100%)",
      },
      keyframes: {
        "flash-correct": {
          "0%": { opacity: "0" },
          "25%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "flash-skip": {
          "0%": { opacity: "0" },
          "25%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "word-in": {
          "0%": { opacity: "0", transform: "scale(0.92) translateY(8px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.9" },
        },
      },
      animation: {
        "flash-correct": "flash-correct 0.45s ease-out",
        "flash-skip": "flash-skip 0.45s ease-out",
        "word-in": "word-in 0.28s ease-out",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
