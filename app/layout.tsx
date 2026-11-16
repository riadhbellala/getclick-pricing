import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Tarifs 2026 — Getclick",
  description:
    "Sites vitrine, e-commerce, logiciels SaaS et assistants IA. Des prix clairs, un devis composé en direct, envoyé sur WhatsApp.",
};

export const viewport: Viewport = { themeColor: "#f2ede6" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={archivo.variable}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
