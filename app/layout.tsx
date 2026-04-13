import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formation Recognition",
  description: "Football formation trainer and quiz app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
