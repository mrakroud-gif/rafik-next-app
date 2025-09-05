import "./globals.css";
import Header from "@/components/Header";
import type { ReactNode } from "react";
export const metadata = {
  title: "Rafik",
  description: "Assistant shopping",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/rafik-logo.svg"
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }:{children:ReactNode}){
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-[#0B1020] text-white">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
