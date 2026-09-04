import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

export const alt = `${profile.name} · ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#070709",
          color: "#e9e9e6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#9d9d99" }}>
          <span>{profile.role.toUpperCase()}</span>
          <span>{profile.location.toUpperCase()}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <svg width="150" height="129" viewBox="0 0 100 86">
            <path fill="#e9e9e6" fillRule="evenodd" d="M0 0h100L50 86 0 0Zm25.5 14L50 56.4 74.5 14h-49Z" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 96, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>{profile.name.toUpperCase()}</span>
            <span style={{ fontSize: 28, color: "#9d9d99", marginTop: 16 }}>{profile.bootLine}</span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#6d5ae6" }}>shivenkhurdi.vercel.app</div>
      </div>
    ),
    size,
  );
}
