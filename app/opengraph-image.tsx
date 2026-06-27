import { ImageResponse } from "next/og";

export const alt = "Shiven Khurdi · AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#08080a",
          backgroundImage:
            "radial-gradient(900px circle at 12% 8%, rgba(198,255,58,0.18), transparent 45%), radial-gradient(700px circle at 95% 100%, rgba(120,140,255,0.10), transparent 40%)",
          color: "#ededea",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#a0a09a",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 999,
                backgroundColor: "#c6ff3a",
              }}
            />
            <span>Portfolio</span>
          </div>
          <span>Boston, MA</span>
        </div>

        {/* Name + role */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 150,
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: -4,
            }}
          >
            Shiven Khurdi
            <span style={{ color: "#c6ff3a" }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 40,
              color: "#a0a09a",
            }}
          >
            AI Engineer · LLM systems, multi-agent platforms & computer vision
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(237,237,234,0.14)",
            paddingTop: 28,
            fontSize: 24,
            color: "#87877e",
          }}
        >
          <span>M.S. Artificial Intelligence · Northeastern University</span>
          <span style={{ color: "#c6ff3a" }}>↗</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
