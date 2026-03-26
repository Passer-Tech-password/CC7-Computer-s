import Link from "next/link";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-primary-blue to-primary-red py-20 lg:py-32">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-yellow/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-primary-blue/30 rounded-full blur-3xl" />
      </div>

      <div className="container-page relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-md">
            Quality Laptops, Fast Repairs & <span className="text-primary-yellow">Best Prices</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/90 font-medium max-w-2xl mx-auto lg:mx-0 drop-shadow-sm">
            New • Tokunbo • Accessories • Expert Repairs in Awka & Onitsha
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center lg:justify-start">
            <Link 
              href="/shop" 
              className="px-8 py-4 bg-primary-red hover:bg-red-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-center text-lg"
            >
              Shop Now
            </Link>
            <Link 
              href="/repairs" 
              className="px-8 py-4 bg-white hover:bg-gray-50 text-primary-blue font-bold rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-center text-lg"
            >
              Book a Repair
            </Link>
          </div>
        </div>

        <div className="relative hidden lg:block h-[400px] w-full">
          {/* Conceptual Floating Elements since we don't have real images yet */}
          <div className="absolute right-0 top-0 w-[350px] h-[250px] bg-white rounded-2xl shadow-2xl rotate-3 transform transition-transform hover:rotate-0 duration-500 flex items-center justify-center p-4 border-4 border-primary-yellow/50">
            <div className="w-full h-full bg-dark/5 rounded-lg border border-dark/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-dark/30">Laptop Mockup</span>
            </div>
          </div>
          <div className="absolute left-10 bottom-0 w-[150px] h-[300px] bg-white rounded-3xl shadow-2xl -rotate-6 transform transition-transform hover:rotate-0 duration-500 flex items-center justify-center p-2 border-4 border-primary-yellow/50">
            <div className="w-full h-full bg-dark/5 rounded-2xl border border-dark/10 flex items-center justify-center">
               <span className="text-lg font-bold text-dark/30 text-center">Phone<br/>Mockup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
