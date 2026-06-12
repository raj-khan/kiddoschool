import { ImageResponse } from "next/og";

import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#FDFBF7",
          color: "#3D372F",
          fontFamily: "sans-serif",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -80,
            top: -60,
            width: 280,
            height: 280,
            borderRadius: 999,
            background: "#E9EEE1"
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 70,
            top: 70,
            width: 150,
            height: 150,
            borderRadius: 999,
            background: "#F8EDD2"
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -40,
            bottom: -40,
            width: 320,
            height: 220,
            borderRadius: 60,
            background: "#F7E6DF"
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px",
            width: "100%"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 82,
                height: 82,
                borderRadius: 26,
                background: "#9DAE8B",
                color: "white",
                fontSize: 34,
                fontWeight: 800
              }}
            >
              h
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" }}>
                Early learning · ages 3–6
              </div>
              <div style={{ fontSize: 64, fontWeight: 900 }}>{SITE_NAME}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 820 }}>
            <div style={{ fontSize: 70, fontWeight: 900, lineHeight: 1.02 }}>
              Where little minds take root.
            </div>
            <div style={{ marginTop: 18, fontSize: 28, lineHeight: 1.35, fontWeight: 600 }}>
              {SITE_TAGLINE}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 24,
              fontWeight: 700
            }}
          >
            <div style={{ display: "flex", gap: 14 }}>
              <span
                style={{
                  padding: "12px 18px",
                  borderRadius: 999,
                  background: "#FFFFFF"
                }}
              >
                Browser-only
              </span>
              <span
                style={{
                  padding: "12px 18px",
                  borderRadius: 999,
                  background: "#FFFFFF"
                }}
              >
                Calm by design
              </span>
            </div>
            <div>Apple meets Montessori</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
