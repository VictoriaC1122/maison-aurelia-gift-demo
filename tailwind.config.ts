import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F1E8",
        pearl: "#FCFAF6",
        ink: "#15120F",
        champagne: "#C2A46D",
        /** 淺色背景上的金色文字（對比足夠，小字也看得清楚） */
        gold: "#8C6D3A",
        rosegold: "#BF8B7A",
        mist: "#D9CFC2"
      },
      boxShadow: {
        aura: "0 24px 80px rgba(21, 18, 15, 0.10)",
        glass: "0 18px 50px rgba(89, 63, 20, 0.12)"
      },
      borderRadius: {
        luxe: "1.75rem"
      },
      fontFamily: {
        display: [
          "Georgia",
          "'Times New Roman'",
          "var(--font-noto-serif-tc)",
          "'Noto Serif TC'",
          "'Songti TC'",
          "STSong",
          "PMingLiU",
          "serif"
        ],
        body: [
          "Georgia",
          "'Times New Roman'",
          "var(--font-noto-serif-tc)",
          "'Noto Serif TC'",
          "'Songti TC'",
          "STSong",
          "PMingLiU",
          "serif"
        ]
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top right, rgba(194,164,109,0.35), transparent 20%), radial-gradient(circle at bottom left, rgba(191,139,122,0.22), transparent 24%)"
      }
    }
  },
  plugins: []
};

export default config;
