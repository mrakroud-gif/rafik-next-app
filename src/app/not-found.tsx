import Link from "next/link";
export default function NotFound(){
  return (
    <main className="container py-10">
      <div className="card p-8 text-center space-y-3">
        <div className="text-3xl">🔎</div>
        <h1 className="text-xl font-semibold">Page introuvable</h1>
        <p className="text-gray-600 dark:text-gray-300">La page demandée n'existe pas.</p>
        <div><Link href="/" className="btn btn-primary">Retour à l'accueil</Link></div>
      </div>
    </main>
  );
}
