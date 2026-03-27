import Link from "next/link";
import { ServiceCard } from "@/components/ServiceCard";

function WrenchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <path
        d="M14.7 6.3a4.5 4.5 0 0 0-6.1 6.1L3 18l3 3 5.6-5.6a4.5 4.5 0 0 0 6.1-6.1l-2.4 2.4-2.6-2.6 2.0-2.8Z"
        fill="currentColor"
        opacity="0.92"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <path
        d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm0 3v14h8V5H8Zm4 15.5a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Z"
        fill="currentColor"
        opacity="0.92"
      />
    </svg>
  );
}

function UpgradeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <path
        d="M12 2 2 7l10 5 10-5-10-5Zm0 8L2 5v14l10 5V10Zm10-5-10 5v14l10-5V5Z"
        fill="currentColor"
        opacity="0.92"
      />
    </svg>
  );
}

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-primary-blue">
        <div className="container-page py-14 sm:py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-extrabold text-white/95">
              CC7 Repairs & Services
            </div>
            <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">
              Expert Computer & Laptop Repairs
            </h1>
            <p className="mt-4 text-base font-semibold leading-relaxed text-white/90">
              Fast diagnosis, clean repairs, and solid upgrades. From laptops to phones, CC7 gets you back online with
              confidence.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/repair/book"
                className="btn inline-flex rounded-2xl bg-primary-red px-6 py-4 text-base font-black text-white hover:brightness-110"
              >
                Book a Repair
              </Link>
              <Link
                href="/repair/track"
                className="btn inline-flex rounded-2xl bg-primary-yellow px-6 py-4 text-base font-black text-dark hover:brightness-95"
              >
                Track Repair
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-black text-dark dark:text-light">Services we offer</h2>
            <p className="mt-2 text-sm font-semibold text-dark/70 dark:text-light/70">
              Pick a category to book quickly or learn what we can fix.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/repair/book" className="text-sm font-bold text-primary-blue hover:underline">
              Start repair request →
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <ServiceCard
            title="Laptop & Desktop Repair"
            description="Overheating, no power, blue screen, keyboard, screen replacement, OS install, performance tune-up."
            href="/repair/book"
            variant="red"
            icon={<WrenchIcon />}
          />
          <ServiceCard
            title="Phone & Tablet Repair"
            description="Screen replacement, battery issues, charging ports, software fixes, and clean diagnostics."
            href="/repair/book"
            variant="blue"
            icon={<PhoneIcon />}
          />
          <ServiceCard
            title="Accessories & Upgrades"
            description="SSD upgrades, RAM upgrades, laptop batteries, chargers, keyboards, mice, and setup assistance."
            href="/repair/book"
            variant="yellow"
            icon={<UpgradeIcon />}
          />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="card">
            <h3 className="text-lg font-extrabold text-dark dark:text-light">Walk-in or Pickup</h3>
            <p className="mt-2 text-sm font-semibold text-dark/70 dark:text-light/70">
              Book ahead for faster processing. We can arrange pickup for qualifying jobs in Awka & Onitsha.
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-extrabold text-dark dark:text-light">Transparent Updates</h3>
            <p className="mt-2 text-sm font-semibold text-dark/70 dark:text-light/70">
              Track job progress from diagnosis to ready. You’ll know what’s happening at every step.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

