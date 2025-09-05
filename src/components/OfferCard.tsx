"use client";
import type { Offer } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

const ICON: Record<string, string> = {
  mode: "??",
  smartphone: "??",
  informatique: "??",
  electro: "??",
  mobilite: "??",
  auto: "??",
};

export default function OfferCard({ offer }: { offer: Offer }) {
  const addFav = useAppStore((s) => s.addFavorite);
  const buy = useAppStore((s) => s.addPurchase);
  const { show } = useToast();
  const ic = ICON[(offer.category || "").toLowerCase()] || "???";

  return (
    <div className="card p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl">{ic}</span>
          <h3 className="text-lg font-semibold leading-snug">{offer.title}</h3>
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-black dark:text-white">{offer.price} DH</span>{" "}
          • {offer.city} • {offer.seller}
        </div>
        {offer.category ? (
          <div className="mt-1 text-xs badge">Catégorie: {offer.category}</div>
        ) : null}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => { addFav(offer); show({ type: "success", text: "Ajouté aux favoris." }); }}
          className="btn btn-outline"
        >
          ? Favori
        </button>
        <button
          onClick={() => { buy(offer); show({ type: "success", text: "Ajouté à l’historique d’achats." }); }}
          className="btn btn-primary"
        >
          Acheter
        </button>
        <a href={offer.url} target="_blank" rel="noreferrer" className="btn btn-outline">
          Voir
        </a>
      </div>
    </div>
  );
}
