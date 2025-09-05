"use client";
import { useEffect, useState } from "react";

export default function PWAInstallButton() {
  const [promptEvt, setPromptEvt] = useState<any>(null);

  useEffect(() => {
    function onBeforeInstall(e: any) {
      e.preventDefault();
      setPromptEvt(e);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  if (!promptEvt) return null;

  async function install() {
    promptEvt.prompt();
    const { outcome } = await promptEvt.userChoice;
    setPromptEvt(null);
    // outcome: 'accepted' | 'dismissed'
  }

  return (
    <button onClick={install} className="btn btn-outline">
      📲 Installer
    </button>
  );
}
