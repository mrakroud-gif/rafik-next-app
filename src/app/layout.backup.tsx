import "./globals.css";
import type { Viewport, Metadata } from "next";
import Header from "@/components/Header";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0f19" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export const metadata: Metadata = {
  title: "Rafik — Assistant IA",
  description: "Assistant shopping intelligent (MA).",
  icons: [{ rel: "icon", url: "/favicon-32.png" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="bg-grid min-h-screen">
        <Header />
        {children}
      </body>
    </html>
  );
}
