import Link from "next/link";

export default function HomePage(){
  return (
    <section className="container mt-8">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            Votre assistant shopping <span className="text-cyan-400">intelligent</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
            Des suggestions concrètes, adaptées à votre budget et votre ville — en FR/AR.
          </p>
          <div className="flex gap-2">
            <Link href="/chat" className="btn btn-primary">Commencer</Link>
            <Link href="/favoris" className="btn btn-outline">Mes favoris</Link>
          </div>
        </div>
        <div className="card p-5">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">Exemples</div>
          <ul className="grid gap-2">
            <li className="btn btn-outline justify-start">TV 55&quot; • 5000 DH • Agadir</li>
            <li className="btn btn-outline justify-start">Smartphone • 3000 DH • Casa</li>
            <li className="btn btn-outline justify-start">Laptop • 3500 DH • Rabat</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
