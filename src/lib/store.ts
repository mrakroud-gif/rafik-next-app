import { create } from "zustand";

export type ChatMsg = { id: string; role: "user"|"assistant"; text: string; ts: string };
export type Offer = { id?: string; title?: string } & Record<string, any>;
type User = { name: string; email: string } | null;

type AppState = {
  user: User;
  login: (email: string, name: string) => void;
  logout: () => void;
  setUser: (u: User) => void;

  chat: ChatMsg[];
  pushMessage: (m: ChatMsg) => void;
  updateMessage: (id: string, updater: (prev: string) => string) => void;
  setChat: (c: ChatMsg[]) => void;

  favorites: Offer[];
  addFavorite: (offer: Offer) => void;
  removeFavorite: (predicate: (o: Offer)=>boolean) => void;

  purchases: Offer[];
  addPurchase: (offer: Offer) => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  login: (email,name)=> set({ user: { email, name } }),
  logout: ()=> set({ user: null }),
  setUser: (u)=> set({ user: u }),

  chat: [],
  pushMessage: (m)=> set({ chat: [...get().chat, m] }),
  updateMessage: (id, updater)=> set({ chat: get().chat.map(m => m.id===id ? {...m, text: updater(m.text) } : m) }),
  setChat: (c)=> set({ chat: Array.isArray(c) ? c : [] }),

  favorites: [],
  addFavorite: (offer)=> { const f = get().favorites; if (!offer) return; if (offer.id && f.some(o=>o?.id===offer.id)) return; set({ favorites: [...f, offer] }); },
  removeFavorite: (predicate)=> set({ favorites: get().favorites.filter(o => !predicate(o)) }),

  purchases: [],
  addPurchase: (offer)=> set({ purchases: [...get().purchases, offer] }),
}));
