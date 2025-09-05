"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { chatStream } from "@/lib/ai";

export default function ChatPage(){
  const chat = useAppStore(s => s.chat);
  const push = useAppStore(s => s.pushMessage);
  const patch = useAppStore(s => s.updateMessage);
  const clear = useAppStore(s => s.clearChat);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(){
    const t = text.trim(); if (!t || busy) return;
    setBusy(true);
    const userId = crypto.randomUUID();
    const asstId = crypto.randomUUID();
    push({ id: userId, role: "user", text: t, ts: new Date().toISOString() });
    push({ id: asstId, role: "assistant", text: "", ts: new Date().toISOString() });
    setText("");

    let full = "";
    const history = chat.map(m => ({ role: m.role, text: m.text }));
    try{
      await chatStream(t, history, (delta) => {
        full += delta;
        patch(asstId, (prev)=> (prev||"") + delta);
      }, true);
    } catch(e:any){
      const err = "\n[Erreur stream] " + (e?.message||String(e));
      full += err;
      patch(asstId, (prev)=> (prev||"") + err);
    } finally {
      // 🔴 LOG: enregistre l'échange user/assistant
      fetch("/api/log", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ user: t, assistant: full })
      }).catch(()=>{});
      setBusy(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>){
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <main className="container py-6">
      <h1 className="text-2xl font-bold mb-2">Chat IA</h1>

      <div className="card p-4 h-[60vh] overflow-y-auto space-y-3">
        {chat.length===0 && <div className="text-gray-500">Commence une conversation…</div>}
        {chat.map(m => (
          <div key={m.id} className={m.role==="user" ? "text-right" : "text-left"}>
            <div className={"inline-block whitespace-pre-wrap max-w-[80%] px-3 py-2 rounded-2xl " + (m.role==="user" ? "bg-black text-white" : "bg-gray-100 dark:bg-gray-800")}>
              {m.text}
            </div>
            <div className="text-[10px] text-gray-500">{new Date(m.ts).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={e=>setText(e.target.value)}
          onKeyDown={onKey}
          disabled={busy}
          className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3"
          placeholder="Écris ton message…"
        />
        <button onClick={send} disabled={busy} className="rounded-xl bg-black text-white px-5 py-3">
          {busy ? "…" : "➤"}
        </button>
      </div>
    </main>
  );
}
