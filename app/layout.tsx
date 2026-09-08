import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fila Urgencia Collipulli",
  description: "Estado de la fila en Unidad de Emergencia Hospital de Collipulli",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
