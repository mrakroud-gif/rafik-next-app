"use client";
import { useAppStore } from "@/lib/store";

export default function FavorisPage(){
  const favs = useAppStore(s => s.favorites);
  return (
    <main className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Favoris</h1>
      {(!favs || favs.length===0) ? (
        <div className="card p-5 text-gray-600 dark:text-gray-300">Aucun favori pour le moment.</div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {favs.map((o:any, i:number)=>(
            <div key={o.id||i} className="card p-4">
              <div className="font-medium">{o.title||o.name||"Produit"}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
