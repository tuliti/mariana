import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Physics-IQ Verified",
  description: "Verified visual physics intelligence results.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
