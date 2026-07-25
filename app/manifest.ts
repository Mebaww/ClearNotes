import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ClearNotes — Less Reading. More Understanding.",
    short_name: "ClearNotes",
    description:
      "Upload a document and get organized notes that help you find what matters faster.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0F0F0F",
    theme_color: "#C49A3C",
    categories: ["productivity", "education", "utilities"],
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [],
    prefer_related_applications: false,
  };
}
