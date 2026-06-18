import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mariana | Physics-IQ Verified",
  description: "Mariana ranks verified visual physics intelligence results.",
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
