export default function ContactPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="card">
        <h1 className="text-2xl font-extrabold text-dark dark:text-light">Contact</h1>
        <p className="mt-2 text-sm font-semibold text-dark/75 dark:text-light/75">
          Update this page with your shop address, phone numbers, and opening hours.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card md:col-span-2">
          <h2 className="text-lg font-extrabold text-dark dark:text-light">Business info</h2>
          <div className="mt-3 grid gap-2 text-sm font-semibold text-dark/75 dark:text-light/75">
            <div>
              <span className="font-extrabold text-dark dark:text-light">WhatsApp:</span>{" "}
              <span>{process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2340000000000"}</span>
            </div>
            <div>
              <span className="font-extrabold text-dark dark:text-light">Email:</span> <span>support@cc7computers.com</span>
            </div>
            <div>
              <span className="font-extrabold text-dark dark:text-light">Location:</span> <span>Nigeria</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-extrabold text-dark dark:text-light">Quick note</h2>
          <p className="mt-2 text-sm font-semibold text-dark/75 dark:text-light/75">
            For forms, store messages in Firestore and notify admins.
          </p>
        </div>
      </div>
    </div>
  );
}

