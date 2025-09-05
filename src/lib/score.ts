"use client";
import { useMemo, useState } from "react";
import data from "@/data/offers.json";
import type { Offer } from "@/lib/types";
import { parse } from "@/lib/parse";
import { matchOffers } from "@/lib/match";
import { scoreOffer } from "@/lib/score";
import { useAppStore } from "@/lib/store";
import Link from "next/link";

export default function ComparePage() {
  const offers = data as Offer[];
  const addFav = useAppStore(s => s.addFavorite);
  const buy = useAppStore(s => s.addPurchase);

  const [q, setQ] = useState('iPhone 13 entre 4500 et 5200 dh à Casablanca');
  const [sort, setSort] = useState<'score'|'price_asc'|'price_desc'>('score');

  const parsed = useMemo(()=>parse(q), [q]);
  const result = useMemo(()=>{
    const list = matchOffers(offers, {
      city: parsed.city,
      product: parsed.product,
      budgetMin: parsed.budgetMin,
      budgetMax: parsed.budgetMax
    });
    const withScore = list.map(o => ({ o, score: scoreOffer(parsed, o)}));
    if (sort==='price_asc') withScore.sort((a,b)=>a.o.price-b.o.price);
    else if (sort==='price_desc') withScore.sort((a,b)=>b.o.price-a.o.price);
    else withScore.sort((a,b)=>b.score-a.score);
    return withScore.slice(0,30);
  }, [offers, parsed, sort]);

  function exportCSV(){
    const header = ['title','price','city','seller','url','score'];
    const rows = result.map(r => [r.o.title, r.o.price, r.o.city, r.o.seller, r.o.url, r.score]);
    const csv = [header.join(','), ...rows.map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'rafik-compare.csv';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Comparateur IA</h1>
        <Link href="/chat" className="link-muted">Chat →</Link>
      </div>

      <div className="card p-4 mt-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} className="input" placeholder='Ex: iPhone 13 entre 4500 et 5200 dh à Casablanca'/>
          <select value={sort} onChange={e=>setSort(e.target.value as any)} className="select">
            <option value="score">Score IA</option>
            <option value="price_asc">Prix ↑</option>
            <option value="price_desc">Prix ↓</option>
          </select>
          <button onClick={exportCSV} className="btn btn-outline">⤓ Export CSV</button>
        </div>

        <div className="mt-3 text-sm">
          <span className="font-medium">Compris :</span>{" "}
          {parsed.product ? <code className="badge">produit: {parsed.product}</code> : null}{" "}
          {parsed.city ? <code className="badge">ville: {parsed.city}</code> : null}{" "}
          {(parsed.budgetMin || parsed.budgetMax) ? <code className="badge">budget: {parsed.budgetMin ?? "—"}–{parsed.budgetMax ?? "—"} dh</code> : null}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-200 dark:border-gray-800">
              <th className="py-2 pr-2">Produit</th>
              <th className="py-2 pr-2">Prix (DH)</th>
              <th className="py-2 pr-2">Ville</th>
              <th className="py-2 pr-2">Vendeur</th>
              <th className="py-2 pr-2">Score</th>
              <th className="py-2 pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {result.map(({o,score}) => (
              <tr key={o.id} className="border-b border-gray-100 dark:border-gray-900">
                <td className="py-2 pr-2">{o.title}</td>
                <td className="py-2 pr-2">{o.price}</td>
                <td className="py-2 pr-2">{o.city}</td>
                <td className="py-2 pr-2">{o.seller}</td>
                <td className="py-2 pr-2 font-semibold">{score}</td>
                <td className="py-2 pr-2 flex gap-2">
                  <button onClick={()=>addFav(o)} className="btn btn-outline">⭐</button>
                  <button onClick={()=>buy(o)} className="btn btn-primary">Acheter</button>
                  <a href={o.url} target="_blank" rel="noreferrer" className="btn btn-outline">Voir</a>
                </td>
              </tr>
            ))}
            {result.length===0 && (
              <tr><td colSpan={6} className="py-4 text-gray-500">Aucun résultat.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
