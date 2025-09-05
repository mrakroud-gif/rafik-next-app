"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Item({ href, label, icon }: { href: string; label: string; icon: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <li>
      <Link
        href={href}
        className={
          "flex flex-col items-center justify-center py-2 " +
          (active ? "text-black dark:text-white font-medium" : "text-gray-600")
        }
      >
        <span>{icon}</span>
        <span>{label}</span>
      </Link>
    </li>
  );
}

export default function Navigation() {
  return (
    <nav className="bottom-nav">
      <ul className="grid grid-cols-6 text-xs">
        <Item href="/" label="Accueil" icon="🏠" />
        <Item href="/chat" label="Chat" icon="💬" />
        <Item href="/compare" label="Comparer" icon="📊" />
        <Item href="/favoris" label="Favoris" icon="⭐" />
        <Item href="/achats" label="Achats" icon="🧾" />
        <Item href="/profil" label="Profil" icon="👤" />
      </ul>
    </nav>
  );
}
