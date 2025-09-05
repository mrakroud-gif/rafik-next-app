"use client";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage(){
  const router = useRouter();
  const login = useAppStore(s => s.login);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function submit(){
    if (!name || !email) return;
    login(email, name);
    router.push("/");
  }

  return (
    <main className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Se connecter</h1>
      <div className="card p-4 max-w-md">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nom" className="rounded-xl border border-gray-300 px-4 py-3 w-full mb-2" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="rounded-xl border border-gray-300 px-4 py-3 w-full mb-3" />
        <button onClick={submit} className="rounded-xl bg-black text-white px-5 py-3 w-full">Connexion</button>
      </div>
    </main>
  );
}
