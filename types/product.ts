export type ProductCategory =
  | "laptops"
  | "desktops"
  | "accessories"
  | "phones"
  | "printers"
  | "parts"
  | "other";

export type ProductCondition = "new" | "fairly_used" | "refurbished";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type Product = {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: ProductCategory;
  condition: ProductCondition;
  priceNgn: number;
  oldPriceNgn?: number;
  imageUrl: string;
  images?: string[];
  stockCount: number;
  inStock: boolean;
  description?: string;
  specs?: Record<string, string>;
  createdAtMs: number;
};
