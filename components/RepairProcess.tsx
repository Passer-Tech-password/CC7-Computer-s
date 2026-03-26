export function RepairProcess() {
  const steps = [
    { num: "01", title: "Diagnosis", desc: "We identify the core issue quickly.", color: "bg-primary-yellow text-dark" },
    { num: "02", title: "Repair", desc: "Expert fixing with quality parts.", color: "bg-primary-blue text-white" },
    { num: "03", title: "Testing", desc: "Rigorous checks to ensure perfection.", color: "bg-primary-red text-white" },
    { num: "04", title: "Pickup", desc: "Ready for you, good as new.", color: "bg-green-500 text-white" },
  ];

  return (
    <section className="py-16 bg-light dark:bg-[#0b1220]">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-dark dark:text-light">
            Our Repair Process
          </h2>
          <p className="mt-4 text-dark/70 dark:text-light/70 font-medium">
            Transparent, fast, and reliable. We keep you updated every step of the way.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (hidden on mobile) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-dark/10 dark:bg-light/10 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-black shadow-lg mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:ring-4 ring-offset-4 ring-offset-light dark:ring-offset-[#0b1220] ring-dark/20 dark:ring-light/20 ${step.color}`}>
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-dark dark:text-light mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-dark/70 dark:text-light/70">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}