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
          "'Noto Serif TC'",
          "'Songti TC'",
          "STSong",
          "PMingLiU",
          "serif"
        ],
        body: [
          "Georgia",
          "'Times New Roman'",
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
