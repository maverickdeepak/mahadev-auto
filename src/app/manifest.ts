import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mahadev Automobiles - Bike Repair Shop in Sataun, Sirmour | Owner: Sunil Tomar (Chottu)",
    short_name: "Mahadev Automobiles",
    description:
      "Professional bike repair and maintenance services in Sataun, District Sirmour, Himachal Pradesh. Owned by Sunil Tomar (Chottu).",
    start_url: "/",
    display: "standalone",
    background_color: "#2563eb",
    theme_color: "#1d4ed8",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
