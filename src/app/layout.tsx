import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mahadev Automobiles",
  description: "Mahadev Automobiles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
