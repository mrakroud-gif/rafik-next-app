"use client";
import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";

export default function ProfilPage(){
  const user   = useAppStore(s => s.user);
  const login  = useAppStore(s => s.login);
  const logout = useAppStore(s => s.logout);

  const [name, setName]   = useState(user?.name  || "");
  const [email, setEmail] = useState(user?.email || "");

  useEffect(()=>{ setName(user?.name||""); setEmail(user?.email||""); }, [user?.name, user?.email]);

  function save(){
    if (!email.trim() || !name.trim()) return;
    login(email.trim(), name.trim());
    try { localStorage.setItem("rafik_user", JSON.stringify({ name: name.trim(), email: email.trim() })); } catch {}
  }

  useEffect(()=>{
    try {
      const raw = localStorage.getItem("rafik_user");
      if (raw && !user) {
        const u = JSON.parse(raw);
        if (u?.email && u?.name) login(u.email, u.name);
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Profil</h1>

      <div className="card p-4 space-y-3 max-w-md">
        <label className="block">
          <div className="text-sm text-gray-600 dark:text-gray-300">Nom</div>
          <input className="input w-full" value={name} onChange={e=>setName(e.target.value)} placeholder="Votre nom" />
        </label>
        <label className="block">
          <div className="text-sm text-gray-600 dark:text-gray-300">Email</div>
          <input className="input w-full" value={email} onChange={e=>setEmail(e.target.value)} placeholder="vous@exemple.com" />
        </label>

        <div className="flex gap-2 pt-2">
          <button onClick={save} className="btn btn-primary">Enregistrer</button>
          {user && <button onClick={logout} className="btn btn-outline">Se déconnecter</button>}
        </div>

        {user && (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Connecté en tant que <span className="font-medium">{user.name}</span> ({user.email})
          </div>
        )}
      </div>
    </main>
  );
}
