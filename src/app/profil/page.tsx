"use client";
import { useState, useEffect, FormEvent } from "react";
import { useAppStore } from "@/lib/store";

export default function ProfilPage() {
  const user   = useAppStore(s => s.user);
  const login  = useAppStore(s => s.login);
  const logout = useAppStore(s => s.logout);

  const [name, setName]   = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user?.name, user?.email]);

  function save(e?: FormEvent) {
    e?.preventDefault();
    const n = name.trim();
    const em = email.trim();
    if (!n || !em) return;
    login(em, n);
  }

  return (
    <main className="container mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-4">Profil</h1>

      <form onSubmit={save} className="card p-4 space-y-3">
        <label className="block">
          <div className="text-sm text-gray-600 dark:text-gray-300">Nom</div>
          <input
            className="input w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre nom"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-600 dark:text-gray-300">Email</div>
          <input
            className="input w-full"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@example.com"
          />
        </label>

        <div className="flex gap-2 pt-2">
          <button type="submit" className="btn btn-primary" data-testid="save-profile">Enregistrer</button>
          {user ? (
            <button type="button" onClick={logout} className="btn btn-outline">Se deconnecter</button>
          ) : null}
        </div>

        {user ? (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Connecte en tant que <span className="font-medium">{user.name}</span> ({user.email})
          </p>
        ) : null}
      </form>
    </main>
  );
}
