import { Noto_Serif_TC } from "next/font/google";

export const notoSerifTC = Noto_Serif_TC({
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
  variable: "--font-noto-serif-tc",
  fallback: ["Songti TC", "STSong", "PMingLiU", "serif"]
});
