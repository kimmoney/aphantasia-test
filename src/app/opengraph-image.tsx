import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f6f1",
          color: "#171717",
          padding: 72,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 28 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#be123c",
            }}
          />
          Aphantasia Profile Test
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 78, fontWeight: 700, lineHeight: 1.05 }}>
            How vivid is your mind&apos;s eye?
          </div>
          <div style={{ marginTop: 30, fontSize: 34, color: "#525252" }}>
            Visual imagery, spatial sense, and face recognition profile.
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 26 }}>
          <span>Visual Imagery</span>
          <span>Spatial Sense</span>
          <span>Face Recognition</span>
        </div>
      </div>
    ),
    size,
  );
}
