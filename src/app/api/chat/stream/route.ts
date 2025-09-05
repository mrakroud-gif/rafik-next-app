import type { NextRequest } from "next/server";
import { searchWeb, summarizeHits, needsWeb } from "@/lib/search";

const SYS_PROMPT = `Tu t'appelles **Rafik**, assistant shopping marocain (FR/AR ok).
Règles:
- Toujours poli et utile.
- Si l'utilisateur ne donne qu'un salut (hi/bonjour/salam…), réponds UNE SEULE FOIS avec un accueil + 3 exemples concrets, puis attends sa demande. Ne répète pas le même message aux tours suivants.
- Si 1–2 infos manquent (produit/budget/ville), pose UNE question ciblée (pas "donne tout"), ET propose 2–3 pistes plausibles avec fourchettes de prix (DH) et rappels: prix indicatifs.
- Pas de paiement ni collecte d’infos sensibles; redirige vers vendeurs fiables quand pertinent.
- Quand tu utilises des résultats web, cite 2–3 sources (titres courts).`;

type HistoryMsg = { role: "user" | "assistant"; text?: string; content?: string };

function isGreeting(t: string) {
  const s = t.trim().toLowerCase();
  if (!s) return false;
  const oneOrTwoWords = s.split(/\s+/).length <= 2;
  return oneOrTwoWords && /(hi|hello|hey|salut|bonjour|bonsoir|salam|slm|salam aleyk|salam alik)/i.test(s);
}

function alreadyWelcomed(history: HistoryMsg[]) {
  const lastAsst = [...history].reverse().find(m => m.role === "assistant");
  const txt = (lastAsst?.text ?? lastAsst?.content ?? "").toLowerCase();
  return /exemples:|produit.*budget.*ville|salut, je suis rafik/i.test(txt);
}

async function streamOllama(messages: any[], ctrl: ReadableStreamDefaultController, enc: TextEncoder) {
  const host = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL || "llama3.2:3b";
  const res = await fetch(`${host}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: true, options: { temperature: 0.2 } }),
  }).catch(() => null);
  if (!res || !res.ok || !res.body) return false;
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 1);
      if (!line) continue;
      try {
        const j = JSON.parse(line);
        const chunk = j?.message?.content;
        if (chunk) ctrl.enqueue(enc.encode(chunk));
        if (j?.done) return true;
      } catch {}
    }
  }
  return true;
}

async function streamOpenAI(messages: any[], ctrl: ReadableStreamDefaultController, enc: TextEncoder) {
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  if (!key) return false;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, temperature: 0.2, stream: true, messages }),
  }).catch(() => null);
  if (!res || !res.ok || !res.body) return false;
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n"); buf = lines.pop() || "";
    for (const l of lines) {
      const line = l.trim();
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") return true;
      try {
        const j = JSON.parse(payload);
        const delta = j?.choices?.[0]?.delta?.content;
        if (delta) ctrl.enqueue(enc.encode(delta));
      } catch {}
    }
  }
  return true;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const text: string = (body?.text || "").toString();
  const history: HistoryMsg[] = Array.isArray(body?.history) ? body.history : [];
  const webFlag: boolean = !!body?.web;

  const t = text.trim();
  if (!t) return new Response("Écris ce que tu cherches (produit + budget + ville) 😊", { status: 200 });

  // Réponse spéciale "salutation / trop court" (une seule fois)
  if ((isGreeting(t) || t.split(/\s+/).length <= 2) && !alreadyWelcomed(history)) {
    const msg =
`Salam 👋 Je suis **Rafik**.
Dis-moi:
• **Produit** (ex: smartphone Redmi)
• **Budget** (ex: 3000 DH)
• **Ville** (ex: Agadir)

**Exemples rapides**:
- TV 55" **5000 DH** **Agadir**
- Laptop **4000 DH** **Rabat**
- Frigo **3000 DH** **Casablanca**

Astuce: active 🌐 pour élargir la recherche web.`;
    return new Response(msg, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  // Option: recherche web
  let contextWeb = "";
  if (webFlag || needsWeb(t)) {
    const web = await searchWeb(t);
    if (web.hits?.length) {
      contextWeb = `RÉSULTATS WEB (résumés):
${summarizeHits(web.hits)}
— Fin des résultats web —`;
    }
  }

  const enc = new TextEncoder();
  const messages: any[] = [
    { role: "system", content: SYS_PROMPT },
    ...(contextWeb ? [{ role: "system", content: contextWeb }] : []),
    ...history.slice(-8).map((m) => ({ role: m.role, content: (m.text ?? m.content ?? "").toString().slice(0, 4000) })),
    { role: "user", content: t.slice(0, 4000) },
  ];

  const stream = new ReadableStream({
    start: async (controller) => {
      try {
        if (await streamOllama(messages, controller, enc)) { controller.close(); return; }
        if (await streamOpenAI(messages, controller, enc)) { controller.close(); return; }
        controller.enqueue(enc.encode("Je n'ai pas pu joindre le modèle. Essaie plus tard ou vérifie la config."));
      } catch (e: any) {
        controller.enqueue(enc.encode("[Erreur] " + (e?.message || String(e))));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
