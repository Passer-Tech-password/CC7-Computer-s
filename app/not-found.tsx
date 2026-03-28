import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-dark/10 bg-white shadow-xl dark:border-light/10 dark:bg-dark">
        <div className="bg-primary-blue p-8 text-white">
          <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-extrabold text-white/95">
            CC7 Computers
          </div>
          <div className="mt-4 text-6xl font-black tracking-tight sm:text-7xl">
            404<span className="text-primary-yellow">.</span>
          </div>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">Page not found</h1>
          <p className="mt-2 text-sm font-semibold text-white/90">
            That link doesn’t exist. Let’s get you back to something useful.
          </p>
        </div>

        <div className="p-8">
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/" className="btn inline-flex rounded-2xl bg-primary-red px-6 py-4 text-base font-black text-white hover:brightness-110">
              Go Home
            </Link>
            <Link href="/shop" className="btn inline-flex rounded-2xl bg-primary-yellow px-6 py-4 text-base font-black text-dark hover:brightness-95">
              Browse Shop
            </Link>
          </div>
          <Link href="/repair/track" className="mt-4 inline-flex text-sm font-bold text-primary-blue hover:underline">
            Track a repair →
          </Link>
        </div>
      </div>
    </div>
  );
}
