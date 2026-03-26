import Link from "next/link";

const SERVICES = [
  "Screen replacement",
  "Keyboard/touchpad issues",
  "SSD/RAM upgrade",
  "Charging port repairs",
  "Software installation",
  "Virus cleanup"
];

export default function RepairsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="card">
        <h1 className="text-2xl font-extrabold text-dark dark:text-light">Repairs</h1>
        <p className="mt-2 text-sm font-semibold text-dark/75 dark:text-light/75">
          Book repairs, track status, and chat with support. (Firebase Auth + Firestore setup is included.)
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="text-lg font-extrabold text-dark dark:text-light">Common services</h2>
          <ul className="mt-3 grid gap-2 text-sm font-semibold text-dark/75 dark:text-light/75">
            {SERVICES.map((s) => (
              <li key={s} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-blue" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="text-lg font-extrabold text-dark dark:text-light">Next step</h2>
          <p className="mt-2 text-sm font-semibold text-dark/75 dark:text-light/75">
            Add a repair request form and store requests in Firestore.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="btn-primary">
              Contact support
            </Link>
            <Link href="/" className="btn-ghost">
              Back home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

