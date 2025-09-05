"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

export default function LoginPage(){
  const { data: session } = useSession();
  const router = useRouter();
  const login = useAppStore(s=>s.login);

  function guest(){
    login("invite@local", "Invité");
    router.replace("/chat");
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Connexion</h1>

      <div className="card p-6 max-w-md space-y-3">
        {!session?.user ? (
          <>
            <button onClick={()=>signIn("google")} className="btn btn-primary w-full py-3 rounded-2xl">Continuer avec Google</button>
            {/* <button onClick={()=>signIn("apple")} className="btn w-full py-3 rounded-2xl">Continuer avec Apple</button> */}
            <button onClick={guest} className="btn btn-outline w-full py-3 rounded-2xl">Continuer en invité</button>
          </>
        ) : (
          <>
            <div className="text-white/80">Connecté en tant que <b>{session.user.name}</b> ({session.user.email})</div>
            <div className="flex gap-2">
              <Link href="/chat" className="btn btn-primary rounded-2xl">Aller au chat</Link>
              <button onClick={()=>signOut()} className="btn btn-outline rounded-2xl">Se déconnecter</button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
