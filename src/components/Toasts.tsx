"use client";
import { useEffect } from "react";
import { useToast } from "@/lib/toast";

export default function Toasts() {
  const { list, dismiss } = useToast();
  useEffect(() => {
    const timers = list.map((t) =>
      setTimeout(() => dismiss(t.id), t.ms ?? 2500)
    );
    return () => timers.forEach(clearTimeout);
  }, [list, dismiss]);

  return (
    <div className="fixed inset-x-0 bottom-4 z-[100] flex justify-center pointer-events-none">
      <div className="w-full max-w-md px-4 space-y-2">
        {list.map((t) => (
          <div
            key={t.id}
            className={
              "pointer-events-auto rounded-2xl px-4 py-3 shadow-soft border " +
              (t.type === "success"
                ? "bg-green-50 border-green-200 text-green-900 dark:bg-green-900/30 dark:border-green-800 dark:text-green-100"
                : t.type === "error"
                ? "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-100"
                : "bg-white border-gray-200 text-gray-900 dark:bg-[#1b1c21] dark:border-gray-800 dark:text-gray-100")
            }
          >
            {t.title && <div className="font-semibold">{t.title}</div>}
            <div className="text-sm">{t.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
