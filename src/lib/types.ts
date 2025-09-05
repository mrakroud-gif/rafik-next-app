export type Offer = {
  id: string;
  title: string;
  price: number;
  city: string;
  seller: string;
  url: string;
  category?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  ts: string; // ISO date
};

export type User = {
  id: string;
  email: string;
  name: string;
};
