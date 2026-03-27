export type RepairStep = {
  key: string;
  label: string;
};

export type RepairStepperVariant = "booking" | "tracking";

function getStepColor(variant: RepairStepperVariant, index: number, activeIndex: number) {
  const isDone = index < activeIndex;
  const isActive = index === activeIndex;

  if (variant === "booking") {
    const colors = ["bg-primary-yellow", "bg-primary-blue", "bg-primary-red", "bg-primary-red"];
    const base = colors[index] ?? "bg-primary-blue";
    if (isActive) return base;
    if (isDone) return "bg-emerald-500";
    return "bg-dark/10 dark:bg-light/10";
  }

  if (isActive) return "bg-primary-blue";
  if (isDone) return "bg-emerald-500";
  return "bg-dark/10 dark:bg-light/10";
}

function getLabelColor(index: number, activeIndex: number) {
  if (index === activeIndex) return "text-dark dark:text-light";
  if (index < activeIndex) return "text-emerald-700 dark:text-emerald-300";
  return "text-dark/60 dark:text-light/60";
}

export function RepairStepper({
  steps,
  activeIndex,
  variant = "tracking"
}: {
  steps: RepairStep[];
  activeIndex: number;
  variant?: RepairStepperVariant;
}) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {steps.map((step, index) => {
          const dotColor = getStepColor(variant, index, activeIndex);
          const labelColor = getLabelColor(index, activeIndex);
          const isDone = index < activeIndex;
          const isActive = index === activeIndex;

          return (
            <div key={step.key} className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className={[
                      "grid h-10 w-10 place-items-center rounded-2xl text-sm font-black",
                      dotColor,
                      isActive || isDone ? "text-white" : "text-dark/60 dark:text-light/60"
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {isDone ? "✓" : index + 1}
                  </div>
                </div>
                <div className={["hidden text-sm font-extrabold sm:block", labelColor].join(" ")}>{step.label}</div>
              </div>
              <div className={["mt-2 text-center text-xs font-extrabold sm:hidden", labelColor].join(" ")}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

