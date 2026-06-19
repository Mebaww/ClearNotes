import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #F5F5F7 0%, #F0ECE4 52%, #E9D7B7 100%)",
          color: "#1D1D1F",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: 999,
            background: "rgba(184, 134, 59, 0.18)",
            filter: "blur(20px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -120,
            bottom: -140,
            width: 420,
            height: 420,
            borderRadius: 999,
            background: "rgba(255, 255, 255, 0.55)",
            filter: "blur(18px)",
          }}
        />

        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            padding: 72,
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 32,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  width: "fit-content",
                  padding: "12px 18px",
                  borderRadius: 999,
                  background: "rgba(255, 255, 255, 0.65)",
                  border: "1px solid rgba(29, 29, 31, 0.08)",
                  boxShadow: "0 14px 40px rgba(29, 29, 31, 0.08)",
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    background: "#B8863B",
                  }}
                />
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: -0.4,
                  }}
                >
                  ClearNotes
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div
                  style={{
                    fontSize: 76,
                    lineHeight: 0.95,
                    fontWeight: 800,
                    letterSpacing: -3.5,
                    maxWidth: 700,
                  }}
                >
                  Read less.
                  <br />
                  Understand more.
                </div>
                <div
                  style={{
                    fontSize: 30,
                    lineHeight: 1.4,
                    maxWidth: 760,
                    color: "rgba(29, 29, 31, 0.76)",
                  }}
                >
                  Turn PDFs, slide decks, and Word documents into structured notes that are easier to skim, share, and study.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {[
                "PDFs",
                "Slide decks",
                "Word docs",
                "Work",
                "Study",
              ].map((label) => (
                <div
                  key={label}
                  style={{
                    padding: "14px 18px",
                    borderRadius: 999,
                    background: "rgba(255, 255, 255, 0.72)",
                    border: "1px solid rgba(29, 29, 31, 0.08)",
                    fontSize: 24,
                    fontWeight: 600,
                    color: "rgba(29, 29, 31, 0.88)",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              width: 400,
              marginLeft: 48,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
                padding: 28,
                borderRadius: 32,
                background: "rgba(255, 255, 255, 0.7)",
                border: "1px solid rgba(29, 29, 31, 0.08)",
                boxShadow: "0 24px 60px rgba(29, 29, 31, 0.12)",
                backdropFilter: "blur(18px)",
              }}
            >
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 999, background: "#FF5F57" }} />
                <div style={{ width: 12, height: 12, borderRadius: 999, background: "#FEBC2E" }} />
                <div style={{ width: 12, height: 12, borderRadius: 999, background: "#28C840" }} />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  paddingTop: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                    color: "rgba(29, 29, 31, 0.6)",
                  }}
                >
                  Source
                </div>
                <div style={{ fontSize: 30, lineHeight: 1.3, fontWeight: 700 }}>
                  Quarterly_Report_Q3.pdf
                </div>
                <div style={{ fontSize: 24, lineHeight: 1.4, color: "rgba(29, 29, 31, 0.75)" }}>
                  Extract the important points. Group them. Make the document easier to use.
                </div>
              </div>

              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  padding: 22,
                  borderRadius: 24,
                  background: "rgba(184, 134, 59, 0.08)",
                  border: "1px solid rgba(184, 134, 59, 0.18)",
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 700, color: "#B8863B" }}>
                  Output
                </div>
                <div style={{ fontSize: 24, lineHeight: 1.4 }}>
                  Clean notes, highlighted takeaways, and a structure you can actually scan.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
