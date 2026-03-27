import Link from "next/link";

export type ServiceCardVariant = "red" | "blue" | "yellow";

const VARIANT_STYLES: Record<
  ServiceCardVariant,
  { bg: string; text: string; accent: string; border: string }
> = {
  red: {
    bg: "bg-primary-red",
    text: "text-white",
    accent: "text-white/90",
    border: "border-white/15"
  },
  blue: {
    bg: "bg-primary-blue",
    text: "text-white",
    accent: "text-white/90",
    border: "border-white/15"
  },
  yellow: {
    bg: "bg-primary-yellow",
    text: "text-dark",
    accent: "text-dark/80",
    border: "border-dark/15"
  }
};

export function ServiceCard({
  title,
  description,
  href,
  variant,
  icon
}: {
  title: string;
  description: string;
  href: string;
  variant: ServiceCardVariant;
  icon?: React.ReactNode;
}) {
  const styles = VARIANT_STYLES[variant];

  return (
    <Link
      href={href}
      className={[
        "group relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        styles.bg,
        styles.text,
        styles.border
      ].join(" ")}
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
      <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-black/10 blur-2xl" />

      <div className="relative flex items-start gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
          {icon ?? (
            <span className="text-xl font-black" aria-hidden="true">
              ✓
            </span>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="text-xl font-black">{title}</h3>
          <p className={["mt-2 text-sm font-semibold leading-relaxed", styles.accent].join(" ")}>
            {description}
          </p>
          <div className={["mt-4 inline-flex items-center gap-2 text-sm font-extrabold", styles.accent].join(" ")}>
            Learn more <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

