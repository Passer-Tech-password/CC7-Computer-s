import { ShieldCheckIcon, TruckIcon, WrenchScrewdriverIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

const FEATURES = [
  {
    title: "Expert Repairs",
    description: "Certified technicians for both hardware and software issues.",
    icon: WrenchScrewdriverIcon,
    color: "bg-primary-blue/10 text-primary-blue",
  },
  {
    title: "Quality Guaranteed",
    description: "All our new and Tokunbo laptops are thoroughly tested.",
    icon: ShieldCheckIcon,
    color: "bg-primary-red/10 text-primary-red",
  },
  {
    title: "Best Prices",
    description: "Competitive pricing on all products in Awka & Onitsha.",
    icon: CurrencyDollarIcon,
    color: "bg-primary-yellow/20 text-yellow-600",
  },
  {
    title: "Fast Delivery",
    description: "Quick and reliable delivery across Anambra and beyond.",
    icon: TruckIcon,
    color: "bg-green-500/10 text-green-600",
  }
];

export function WhyChooseUs() {
  return (
    <section className="py-16 bg-white dark:bg-dark/50">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-dark dark:text-light">
            Why Choose CC7?
          </h2>
          <p className="mt-4 text-dark/70 dark:text-light/70 font-medium">
            We are your trusted tech partner, offering premium devices and reliable repair services to keep you connected.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, idx) => (
            <div 
              key={idx} 
              className="p-6 rounded-2xl border border-dark/5 dark:border-light/5 bg-light/50 dark:bg-dark hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-dark dark:text-light mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-dark/70 dark:text-light/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}