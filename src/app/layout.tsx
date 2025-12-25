import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CertiGen - Sistema de Certificados Verificables",
  description: "Genera certificados digitales profesionales con codigo QR unico para validacion instantanea. Perfecto para cursos, talleres y programas educativos.",
  keywords: ["certificados", "validacion", "qr code", "educacion", "cursos"],
  authors: [{ name: "CertiGen" }],
  openGraph: {
    title: "CertiGen - Sistema de Certificados Verificables",
    description: "Genera certificados digitales profesionales con codigo QR unico para validacion instantanea.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased bg-white`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
