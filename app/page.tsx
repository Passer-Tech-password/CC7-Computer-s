import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { RepairProcess } from "@/components/RepairProcess";
import { Product } from "@/types/product";

// Mock data for the homepage
const HOT_DEALS: Product[] = [
  {
    id: "1",
    name: "MacBook Pro M2 2022 (13-inch, 8GB RAM, 256GB SSD)",
    category: "laptops",
    priceNgn: 1250000,
    inStock: true,
    createdAtMs: Date.now(),
  },
  {
    id: "2",
    name: "HP EliteBook 840 G8 (Intel Core i7, 16GB RAM, 512GB SSD)",
    category: "laptops",
    priceNgn: 450000,
    inStock: true,
    createdAtMs: Date.now(),
  },
  {
    id: "3",
    name: "Samsung 1TB T7 Portable SSD",
    category: "accessories",
    priceNgn: 85000,
    inStock: true,
    createdAtMs: Date.now(),
  },
  {
    id: "4",
    name: "Dell XPS 15 9510 (Intel Core i9, 32GB RAM, 1TB SSD)",
    category: "laptops",
    priceNgn: 1100000,
    inStock: false,
    createdAtMs: Date.now(),
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />

      {/* Hot Deals Section */}
      <section className="py-16 bg-light dark:bg-[#0b1220]">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-10">
            <div>
              <div className="inline-block px-3 py-1 mb-3 bg-primary-yellow/20 text-yellow-700 dark:text-primary-yellow font-bold text-sm rounded-full">
                🔥 Hot Deals
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-dark dark:text-light">
                Featured Products
              </h2>
            </div>
            <Link 
              href="/shop" 
              className="text-primary-blue font-bold hover:underline hidden sm:block"
            >
              View All Products &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOT_DEALS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
             <Link 
              href="/shop" 
              className="btn-primary w-full block py-3"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      
      <RepairProcess />
    </div>
  );
}

