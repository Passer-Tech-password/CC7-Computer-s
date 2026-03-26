export type ProductCategory = "laptops" | "accessories" | "phones" | "parts" | "other";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  priceNgn: number;
  imageUrl?: string;
  inStock: boolean;
  createdAtMs: number;
};

