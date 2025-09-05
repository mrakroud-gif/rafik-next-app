"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";

export default function Header() {
  const [theme, setTheme] = useState<"light"|"dark">("light");
  const favCount = useAppStore((s:any) => Array.isArray(s.favorites) ? s.favorites.length : 0);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const t = (saved as "light"|"dark") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(t);
    document.documentElement.classList.toggle("dark", t==="dark");
  }, []);

  function toggle(){
    const t = theme==="dark" ? "light" : "dark";
    setTheme(t); localStorage.setItem("theme", t);
    document.documentElement.classList.toggle("dark", t==="dark");
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="brand">
          <img
            src="/logo.svg" alt="Rafik" width={28} height={28}
            className="rounded-lg bg-white/20 dark:bg-white/10 p-[3px]"
            onError={(e)=>{ (e.currentTarget as HTMLImageElement).src='/rafik-logo.png'; }}
          />
          <span className="hidden sm:inline">Rafik</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/" className="btn btn-ghost">Accueil</Link>
          <Link href="/chat" className="btn btn-ghost">Chat</Link>
          <Link href="/favoris" className="btn btn-ghost">Favoris <span className="badge ml-2">{favCount}</span></Link>
          <Link href="/profil" className="btn btn-primary">Profil</Link>
          <button onClick={toggle} className="btn btn-outline">{theme==="dark"?"☀️":"🌙"}</button>
        </nav>
      </div>
    </header>
  );
}
