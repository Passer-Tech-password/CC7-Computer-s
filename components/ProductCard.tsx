import { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  // Format price nicely
  const formattedPrice = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(product.priceNgn);

  return (
    <div className="group flex flex-col bg-white dark:bg-dark border border-dark/10 dark:border-light/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image Placeholder */}
      <div className="relative aspect-square w-full bg-dark/5 dark:bg-light/5 flex items-center justify-center p-6">
        <div className="w-full h-full bg-dark/10 dark:bg-light/10 rounded-xl flex items-center justify-center text-dark/40 dark:text-light/40 font-semibold group-hover:scale-105 transition-transform duration-500">
          {product.imageUrl ? "Image" : "No Image"}
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-primary-blue/10 text-primary-blue text-xs font-bold rounded-md uppercase tracking-wider">
          {product.category}
        </div>
      </div>

      <div className="flex flex-col flex-grow p-5 gap-3">
        <div>
          <h3 className="font-bold text-lg text-dark dark:text-light line-clamp-2 leading-tight">
            {product.name}
          </h3>
          <p className="text-sm text-dark/60 dark:text-light/60 mt-1">
            {product.inStock ? "In Stock" : "Out of Stock"}
          </p>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-xl font-black text-primary-red">
            {formattedPrice}
          </span>
          <button 
            disabled={!product.inStock}
            className="w-10 h-10 rounded-full bg-primary-red/10 text-primary-red flex items-center justify-center hover:bg-primary-red hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-primary-red/10 disabled:hover:text-primary-red"
            aria-label="Add to cart"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
