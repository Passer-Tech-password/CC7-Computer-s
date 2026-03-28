export type StatCardVariant = "red" | "blue" | "yellow" | "neutral";

const STYLES: Record<StatCardVariant, { bg: string; text: string; sub: string; border: string }> = {
  red: { bg: "bg-primary-red", text: "text-white", sub: "text-white/90", border: "border-white/15" },
  blue: { bg: "bg-primary-blue", text: "text-white", sub: "text-white/90", border: "border-white/15" },
  yellow: { bg: "bg-primary-yellow", text: "text-dark", sub: "text-dark/80", border: "border-dark/15" },
  neutral: { bg: "bg-white dark:bg-dark", text: "text-dark dark:text-light", sub: "text-dark/70 dark:text-light/70", border: "border-dark/10 dark:border-light/10" }
};

export function StatCard({
  title,
  value,
  subtitle,
  variant = "neutral"
}: {
  title: string;
  value: string;
  subtitle?: string;
  variant?: StatCardVariant;
}) {
  const styles = STYLES[variant];
  return (
    <div className={["relative overflow-hidden rounded-2xl border p-5 shadow-sm", styles.bg, styles.border].join(" ")}>
      <div className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
      <div className="relative">
        <div className={["text-xs font-extrabold uppercase tracking-wider", styles.sub].join(" ")}>{title}</div>
        <div className={["mt-2 text-3xl font-black", styles.text].join(" ")}>{value}</div>
        {subtitle ? <div className={["mt-2 text-sm font-semibold", styles.sub].join(" ")}>{subtitle}</div> : null}
      </div>
    </div>
  );
}

