"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";

export default function Header(){
  const [theme, setTheme] = useState<"light"|"dark">("dark");
  const [logoSrc, setLogoSrc] = useState("/rafik-logo.svg");
  const favCount = useAppStore?.(s => Array.isArray(s.favorites) ? s.favorites.length : 0) ?? 0;

  useEffect(()=>{
    const t = (localStorage.getItem("theme") as "light"|"dark") || "dark";
    setTheme(t);
    document.documentElement.classList.toggle("dark", t==="dark");
  },[]);

  function toggle(){
    const t = theme==="dark" ? "light" : "dark";
    setTheme(t);
    localStorage.setItem("theme", t);
    document.documentElement.classList.toggle("dark", t==="dark");
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0B1020]/90 backdrop-blur border-b border-white/10 text-white">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* Fallback PNG si SVG échoue */}
          <img
            src={logoSrc}
            alt="Rafik"
            width={36}
            height={36}
            onError={() => setLogoSrc("/rafik-logo.png")}
            className="h-9 w-9 rounded-xl ring-2 ring-white/40 shadow-lg bg-[#0a0f1e] object-contain p-1"
          />
          <span className="font-semibold tracking-wide" data-testid="brand-name">Rafik</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/" className="btn btn-outline">Accueil</Link>
          <Link href="/chat" className="btn btn-outline">Chat</Link>
          <Link href="/favoris" className="btn btn-outline">Favoris ({favCount})</Link>
          <Link href="/profil" className="btn btn-outline">Profil</Link>
          <button onClick={toggle} className="btn btn-outline" aria-label="Basculer thème">
            {theme==="dark" ? "☀️" : "🌙"}
          </button>
        </nav>
      </div>
    </header>
  );
}
