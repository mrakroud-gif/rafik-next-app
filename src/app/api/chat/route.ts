import { NextResponse } from "next/server";
import { parse } from "@/lib/parse";
import offers from "@/data/offers.json";

const SYS_PROMPT = `Tu es l'assistant d'achat d'une app marocaine (FR/AR dialecte ok).
- Comprends produit, budget (MAD/DH), ville (Agadir/Casa/Rabat/…).
- Réponds court, concret, avec puces si utile.
- Donne 2–4 suggestions adaptées au budget, sans promettre le stock réel.
- Rappelle que les prix sont indicatifs.`;

type HistoryMsg = { role: "user"|"assistant"; text?: string; content?: string };

async function callOllama(prompt: string, history: HistoryMsg[]){
  const host = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL || "llama3.2:3b";
  if (!host || !model) return null;

  // messages au format Ollama
  const messages = [
    { role: "system", content: SYS_PROMPT },
    ...history.slice(-8).map(m => ({ role: m.role, content: (m.text ?? m.content ?? "").toString().slice(0, 4000) })),
    { role: "user", content: prompt.slice(0, 4000) }
  ];

  const res = await fetch(`${host}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Pas de streaming pour rester compatible avec ton front actuel
    body: JSON.stringify({ model, messages, stream: false })
  }).catch(() => null);

  if (!res || !res.ok) return null;
  const data = await res.json().catch(() => ({}));
  const reply = data?.message?.content?.trim();
  return reply || null;
}

async function callOpenAI(prompt: string, history: HistoryMsg[]){
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const messages = [
    { role: "system", content: SYS_PROMPT },
    ...history.slice(-8).map(m => ({ role: m.role, content: (m.text ?? m.content ?? "").toString().slice(0, 4000) })),
    { role: "user", content: prompt.slice(0, 4000) }
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
    body: JSON.stringify({ model, temperature: 0.2, messages })
  }).catch(() => null);

  if (!res || !res.ok) return null;
  const data = await res.json().catch(() => ({}));
  const reply = data?.choices?.[0]?.message?.content?.trim();
  return reply || null;
}

export async function POST(req: Request){
  const body = await req.json().catch(()=>({}));
  const text: string = (body?.text ?? "").toString();
  const history: HistoryMsg[] = Array.isArray(body?.history) ? body.history : [];
  if (!text) return NextResponse.json({ reply: "Dis-moi ce que tu cherches (produit + budget + ville) 😊" });

  // 1) OLLAMA local
  try {
    const r = await callOllama(text, history);
    if (r) return NextResponse.json({ reply: r, provider: "ollama" });
  } catch {}

  // 2) OpenAI (si clé)
  try {
    const r = await callOpenAI(text, history);
    if (r) return NextResponse.json({ reply: r, provider: "openai" });
  } catch {}

  // 3) Fallback heuristique local
  const p = parse(text);
  let reply = "J'ai compris ";
  const parts: string[] = [];
  if (p.product) parts.push(`produit: ${p.product}`);
  if (p.city) parts.push(`ville: ${p.city}`);
  if (p.budgetMin || p.budgetMax) parts.push(`budget: ${p.budgetMin ?? "—"}–${p.budgetMax ?? "—"} dh`);
  reply += parts.join(", ") || "ton intention générale";
  if (p.missing.length) reply += `. Il me manque: ${p.missing.join(", ")}.`;

  try {
    const list = (offers as any[]).filter(o => {
      const okCity = p.city ? o.city.toLowerCase().includes(p.city.toLowerCase()) : true;
      const okBudget = (p.budgetMin ? o.price >= p.budgetMin : true) && (p.budgetMax ? o.price <= p.budgetMax : true);
      const okProd = p.product ? o.title.toLowerCase().includes(p.product.toLowerCase().split(" ")[0]) : true;
      return okCity && okBudget && okProd;
    }).slice(0, 3);
    if (list.length){
      reply += " Exemples: " + list.map(x => `${x.title} (${x.price} DH, ${x.city})`).join(" | ");
    }
  } catch {}

  return NextResponse.json({ reply, provider: "fallback" });
}
