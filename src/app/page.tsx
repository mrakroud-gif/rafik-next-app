"use client";
import Link from "next/link";

export default function HomePage(){
  return (
    <section className="grid place-items-center gap-8 py-16">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl opacity-30 rounded-full"
               style={{background:"radial-gradient(60% 60% at 50% 50%, #7c3aed 0%, #22d3ee 100%)"}}/>
          <img
            src="/rafik-logo.svg"
            alt="Rafik"
            width={120}
            height={120}
            className="relative h-28 w-28 rounded-2xl ring-4 ring-white/40 shadow-2xl bg-[#0a0f1e] p-2 animate-pulse"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Bienvenue chez <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-300">Rafik</span>
        </h1>
        <p className="text-white/70 text-center max-w-xl">
          Dis-moi le <b>produit</b>, ton <b>budget (DH)</b> et ta <b>ville</b>. Je te propose 2–4 options concrètes.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/chat" className="btn btn-primary">Commencer le chat</Link>
        <Link href="/profil" className="btn btn-outline">Profil</Link>
        <Link href="/login" className="btn btn-outline">Connexion</Link>
      </div>
    </section>
  );
}
