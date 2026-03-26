import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card mx-auto max-w-xl text-center">
      <h1 className="text-2xl font-extrabold text-dark dark:text-light">Page not found</h1>
      <p className="mt-2 text-sm font-semibold text-dark/75 dark:text-light/75">
        The page you’re looking for doesn’t exist.
      </p>
      <div className="mt-5">
        <Link href="/" className="btn-primary">
          Go home
        </Link>
      </div>
    </div>
  );
}

