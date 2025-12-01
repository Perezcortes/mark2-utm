import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. IMPORTAMOS EL TOASTER
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital ID UTM",
  description: "Sistema de Identidad Seguro Mark II",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        {/* 2. AGREGAMOS EL COMPONENTE AQUÍ (richColors hace que se vean rojo/verde bonitos) */}
        <Toaster position="top-center" richColors theme="dark" />
      </body>
    </html>
  );
}