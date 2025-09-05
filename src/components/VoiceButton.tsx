"use client";
import { useMemo, useRef, useState } from "react";

export default function VoiceButton({ onTranscript }:{ onTranscript:(t:string)=>void }){
  const [active, setActive] = useState(false);
  const recRef = useRef<any>(null);

  const SR = useMemo(()=>{
    if (typeof window === "undefined") return null;
    // @ts-ignore
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  },[]);

  function start(){
    if (!SR) { alert("Le micro n''est pas supporté par ce navigateur.\nUtilise Chrome/Edge, et https ou localhost."); return; }
    // @ts-ignore
    const rec = new SR();
    recRef.current = rec;
    rec.lang = "fr-FR";
    rec.interimResults = true;
    let finalText = "";
    rec.onresult = (e:any)=>{
      let buff = "";
      for (let i=e.resultIndex; i<e.results.length; i++){
        buff += e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript + " ";
      }
      // Affiche aussi le partiel
      onTranscript(buff);
    };
    rec.onerror = ()=> setActive(false);
    rec.onend = ()=> {
      setActive(false);
      if (finalText.trim()) onTranscript(" " + finalText.trim());
    };
    setActive(true);
    try{ rec.start(); }catch{}
  }
  function stop(){
    try{ recRef.current?.stop(); }catch{}
    setActive(false);
  }

  return (
    <button className={"btn " + (active ? "btn-primary" : "btn-outline")} onClick={()=> active?stop():start()} title="Parler au micro">
      ?? {active ? "En cours…" : "Parler"}
    </button>
  );
}
