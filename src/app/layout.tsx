import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CertiGen - Verifiable Certificate System",
  description: "Generate professional digital certificates with unique QR codes for instant validation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
