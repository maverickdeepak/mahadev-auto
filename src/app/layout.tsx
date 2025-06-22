import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import StructuredData from "./components/StructuredData";

export const metadata: Metadata = {
  title: {
    default:
      "Mahadev Automobiles - Best Bike Repair Shop in Sataun, Sirmour | Owner: Sunil Tomar (Chottu)",
    template: "%s | Mahadev Automobiles",
  },
  description:
    "Professional bike repair and maintenance services in Sataun, District Sirmour, Himachal Pradesh. Owned by Sunil Tomar (Chottu) with 7+ years experience. Same-day repairs, quality parts, emergency services. Call +91 83509-02050 for appointment.",
  keywords: [
    "bike repair shop Sataun",
    "bicycle repair Sirmour",
    "bike service Himachal Pradesh",
    "motorcycle repair Sataun",
    "bike maintenance Sirmour",
    "emergency bike repair",
    "bike mechanic Sataun",
    "bicycle service center",
    "bike parts Sataun",
    "bike tune-up Sirmour",
    "Mahadev Automobiles",
    "Sunil Tomar bike repair",
    "Chottu bike shop",
    "bike repair shop near me",
    "bicycle repair shop",
    "bike service center",
    "professional bike mechanic",
  ],
  authors: [{ name: "Sunil Tomar (Chottu)" }],
  creator: "Sunil Tomar (Chottu)",
  publisher: "Mahadev Automobiles",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://mahadevautomobiles.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://mahadevautomobiles.vercel.app",
    siteName: "Mahadev Automobiles",
    title:
      "Mahadev Automobiles - Best Bike Repair Shop in Sataun, Sirmour | Owner: Sunil Tomar (Chottu)",
    description:
      "Professional bike repair and maintenance services in Sataun, District Sirmour, Himachal Pradesh. Owned by Sunil Tomar (Chottu) with 7+ years experience. Same-day repairs available.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mahadev Automobiles - Professional Bike Repair Shop in Sataun, Sirmour | Owner: Sunil Tomar (Chottu)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Mahadev Automobiles - Best Bike Repair Shop in Sataun, Sirmour | Owner: Sunil Tomar (Chottu)",
    description:
      "Professional bike repair and maintenance services in Sataun, District Sirmour, Himachal Pradesh. Owned by Sunil Tomar (Chottu) with 7+ years experience.",
    images: ["/og-image.jpg"],
    creator: "@mahadevautomobiles",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  other: {
    "geo.region": "IN-HP",
    "geo.placename": "Sataun, Sirmour, Himachal Pradesh",
    "geo.position": "30.7500;77.2500",
    ICBM: "30.7500, 77.2500",
    owner: "Sunil Tomar (Chottu)",
    "business.type": "Bike Repair Shop",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              style: {
                background: "#10B981",
                color: "#fff",
              },
            },
            error: {
              duration: 4000,
              style: {
                background: "#EF4444",
                color: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
