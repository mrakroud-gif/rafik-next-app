export default function NotFound() {
  return (
    <main className="container mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-2">Page introuvable</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Désolé, cette page n’existe pas.
      </p>
      <a href="/" className="btn btn-primary">Revenir à l’accueil</a>
    </main>
  );
}
