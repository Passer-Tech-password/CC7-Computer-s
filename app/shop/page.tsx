import Link from "next/link";

export default function ShopPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="card">
        <h1 className="text-2xl font-extrabold text-dark dark:text-light">Shop</h1>
        <p className="mt-2 text-sm font-semibold text-dark/75 dark:text-light/75">
          Product listings will live here (Firestore + Storage ready).
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-ghost">
            Back home
          </Link>
          <Link href="/contact" className="btn-primary">
            Ask for a product
          </Link>
        </div>
      </div>
    </div>
  );
}

