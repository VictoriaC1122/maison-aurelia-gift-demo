import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #15120F, #C2A46D)",
          color: "#FCFAF6",
          fontSize: 28,
          fontFamily: "Baskerville"
        }}
      >
        MA
      </div>
    ),
    size
  );
}
