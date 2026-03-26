import Link from "next/link";

export default function CartPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="card">
        <h1 className="text-2xl font-extrabold text-dark dark:text-light">Cart</h1>
        <p className="mt-2 text-sm font-semibold text-dark/75 dark:text-light/75">
          Cart functionality can be implemented with local state first, then persisted to Firestore for signed-in users.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link href="/shop" className="btn-primary">
            Continue shopping
          </Link>
          <Link href="/" className="btn-ghost">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}

