export default function Loading() {
  return (
    <main className="min-h-[60vh] grid place-items-center text-center">
      <div
        className="h-10 w-10 rounded-full border-4 border-white/40 border-t-white animate-spin"
        aria-label="Chargement…"
      />
      <p className="mt-3 text-sm text-white/80">Chargement…</p>
    </main>
  );
}
