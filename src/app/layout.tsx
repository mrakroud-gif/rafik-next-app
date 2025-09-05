import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0b0f19" },
  ],
};

export const metadata = {
  title: "Rafik — Assistant shopping",
  description: "Assistant shopping marocain (FR/AR).",
  icons: { icon: "/favicon-32.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <Header />
        {children}

        {/* Bottom nav mobile */}
        <nav className="bottom-nav md:hidden">
          <div className="wrap">
            <div className="inner">
              <ul>
                <li><Link href="/" className="block text-center py-2">🏠<div>Accueil</div></Link></li>
                <li><Link href="/chat" className="block text-center py-2">💬<div>Chat</div></Link></li>
                <li><Link href="/favoris" className="block text-center py-2">⭐<div>Favoris</div></Link></li>
                <li><Link href="/profil" className="block text-center py-2">👤<div>Profil</div></Link></li>
              </ul>
            </div>
          </div>
        </nav>
      </body>
    </html>
  );
}
