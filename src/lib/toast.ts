"use client";
import { create } from "zustand";

export type Toast = {
  id: string;
  text: string;
  title?: string;
  type?: "info" | "success" | "error";
  ms?: number;
};

type ToastStore = {
  list: Toast[];
  show: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
};

export const useToast = create<ToastStore>((set) => ({
  list: [],
  show: (t) => set((s) => ({ list: [...s.list, { id: crypto.randomUUID(), ms: 2500, type: "info", ...t }] })),
  dismiss: (id) => set((s) => ({ list: s.list.filter((x) => x.id !== id) })),
}));
