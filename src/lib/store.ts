import { create } from "zustand";

export type ChatMsg = { id: string; role: "user"|"assistant"; text: string; ts: string };
export type Offer = any;

type AppState = {
  user: { name: string; email: string } | null;
  login: (email: string, name: string) => void;
  logout: () => void;

  chat: ChatMsg[];
  pushMessage: (m: ChatMsg) => void;
  updateMessage: (id: string, updater: (prev: string) => string) => void;
  clearChat: () => void;

  favorites: Offer[];
  addFavorite: (offer: Offer) => void;
  removeFavorite: (predicate: (o: Offer) => boolean) => void;

  purchases: Offer[];
  addPurchase: (offer: Offer) => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  login: (email, name) => set({ user: { email, name } }),
  logout: () => set({ user: null }),

  chat: [],
  pushMessage: (m) => set({ chat: [...get().chat, m] }),
  updateMessage: (id, updater) =>
    set({ chat: get().chat.map(m => m.id===id ? { ...m, text: updater(m.text||"") } : m ) }),
  clearChat: () => set({ chat: [] }),

  favorites: [],
  addFavorite: (offer) => {
    if (get().favorites.some((o:any)=>o?.id===offer?.id)) return;
    set({ favorites: [...get().favorites, offer] });
  },
  removeFavorite: (predicate) => set({ favorites: get().favorites.filter(o=>!predicate(o)) }),

  purchases: [],
  addPurchase: (offer) => set({ purchases: [...get().purchases, offer] }),
}));
