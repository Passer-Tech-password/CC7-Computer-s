import { Product, ProductCategory, ProductCondition, StockStatus } from "@/types/product";

export const PRODUCT_CATEGORIES: Array<{ value: ProductCategory; label: string }> = [
  { value: "laptops", label: "Laptops" },
  { value: "desktops", label: "Desktops" },
  { value: "accessories", label: "Accessories" },
  { value: "phones", label: "Phones" },
  { value: "printers", label: "Printers" }
];

export const PRODUCT_CONDITIONS: Array<{ value: ProductCondition; label: string }> = [
  { value: "new", label: "New" },
  { value: "fairly_used", label: "Fairly Used" },
  { value: "refurbished", label: "Refurbished" }
];

export function getStockStatus(stockCount: number): StockStatus {
  if (stockCount <= 0) return "out_of_stock";
  if (stockCount <= 5) return "low_stock";
  return "in_stock";
}

export function formatNgn(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(value);
}

export const PRODUCTS: Product[] = [
  {
    id: "mbp-m2-13-2022",
    name: "MacBook Pro (13-inch, M2, 2022)",
    brand: "Apple",
    model: "M2 / 8GB / 256GB",
    category: "laptops",
    condition: "new",
    priceNgn: 1250000,
    oldPriceNgn: 1390000,
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1400&q=80"
    ],
    stockCount: 12,
    inStock: true,
    description:
      "Powerful, silent, and portable. Perfect for creators, developers, and everyday power users.",
    specs: {
      Processor: "Apple M2",
      Memory: "8GB Unified Memory",
      Storage: "256GB SSD",
      Display: "13.3-inch Retina",
      Graphics: "Integrated Apple GPU",
      Battery: "Up to 20 hours",
      Ports: "2x Thunderbolt / USB 4",
      Warranty: "1 Year"
    },
    createdAtMs: 1735689600000
  },
  {
    id: "hp-elitebook-840-g8",
    name: "HP EliteBook 840 G8",
    brand: "HP",
    model: "Core i7 / 16GB / 512GB",
    category: "laptops",
    condition: "refurbished",
    priceNgn: 450000,
    oldPriceNgn: 520000,
    imageUrl:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1400&q=80"
    ],
    stockCount: 4,
    inStock: true,
    description: "Premium business laptop with strong performance and excellent keyboard.",
    specs: {
      Processor: "Intel Core i7 (11th Gen)",
      Memory: "16GB DDR4",
      Storage: "512GB SSD",
      Display: "14-inch FHD",
      Graphics: "Intel Iris Xe",
      OS: "Windows 11 Pro",
      Warranty: "3 Months"
    },
    createdAtMs: 1738454400000
  },
  {
    id: "dell-xps-15-9510",
    name: "Dell XPS 15 9510",
    brand: "Dell",
    model: "Core i9 / 32GB / 1TB",
    category: "laptops",
    condition: "fairly_used",
    priceNgn: 1100000,
    oldPriceNgn: 1250000,
    imageUrl:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?auto=format&fit=crop&w=1400&q=80"
    ],
    stockCount: 0,
    inStock: false,
    description: "Ultra-premium creator laptop with stunning display and serious horsepower.",
    specs: {
      Processor: "Intel Core i9",
      Memory: "32GB DDR4",
      Storage: "1TB SSD",
      Display: "15.6-inch",
      Graphics: "NVIDIA (Model varies)",
      Warranty: "1 Month"
    },
    createdAtMs: 1740787200000
  },
  {
    id: "lenovo-thinkcentre-m720",
    name: "Lenovo ThinkCentre M720 SFF",
    brand: "Lenovo",
    model: "Core i5 / 8GB / 256GB",
    category: "desktops",
    condition: "refurbished",
    priceNgn: 280000,
    oldPriceNgn: 320000,
    imageUrl:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1400&q=80"
    ],
    stockCount: 8,
    inStock: true,
    description: "Compact desktop for office setups, POS, and everyday productivity.",
    specs: {
      Processor: "Intel Core i5",
      Memory: "8GB DDR4",
      Storage: "256GB SSD",
      FormFactor: "Small Form Factor",
      OS: "Windows 11",
      Warranty: "3 Months"
    },
    createdAtMs: 1741737600000
  },
  {
    id: "hp-laserjet-m404dn",
    name: "HP LaserJet Pro M404dn",
    brand: "HP",
    model: "Duplex / Network",
    category: "printers",
    condition: "new",
    priceNgn: 245000,
    oldPriceNgn: 275000,
    imageUrl:
      "https://images.unsplash.com/photo-1587019158091-1a103c5dd2f6?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1587019158091-1a103c5dd2f6?auto=format&fit=crop&w=1400&q=80"
    ],
    stockCount: 3,
    inStock: true,
    description: "Fast mono laser printer for offices. Crisp text, duplex printing, and Ethernet.",
    specs: {
      Type: "Laser (Mono)",
      Duplex: "Yes",
      Connectivity: "USB + Ethernet",
      Speed: "Up to 38 ppm",
      Warranty: "1 Year"
    },
    createdAtMs: 1742179200000
  },
  {
    id: "iphone-13-pro-256",
    name: "iPhone 13 Pro",
    brand: "Apple",
    model: "256GB",
    category: "phones",
    condition: "fairly_used",
    priceNgn: 720000,
    oldPriceNgn: 780000,
    imageUrl:
      "https://images.unsplash.com/photo-1633113215889-9a0b8d4a0dff?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1633113215889-9a0b8d4a0dff?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1604671368394-2240d0b1bb6c?auto=format&fit=crop&w=1400&q=80"
    ],
    stockCount: 6,
    inStock: true,
    description: "Pro camera system, smooth 120Hz display, and premium build.",
    specs: {
      Display: "6.1-inch Super Retina XDR",
      Storage: "256GB",
      Camera: "Triple 12MP + LiDAR",
      Battery: "All-day",
      Network: "5G",
      Warranty: "1 Month"
    },
    createdAtMs: 1742600800000
  },
  {
    id: "dell-monitor-24",
    name: "Dell 24-inch IPS Monitor",
    brand: "Dell",
    model: "FHD / 75Hz",
    category: "accessories",
    condition: "new",
    priceNgn: 155000,
    oldPriceNgn: 175000,
    imageUrl:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1400&q=80"
    ],
    stockCount: 15,
    inStock: true,
    description: "Sharp IPS panel with vibrant colors for work, gaming, and design.",
    specs: {
      Size: "24-inch",
      Resolution: "1920 x 1080",
      Panel: "IPS",
      RefreshRate: "75Hz",
      Ports: "HDMI / DisplayPort",
      Warranty: "1 Year"
    },
    createdAtMs: 1742773600000
  },
  {
    id: "logitech-mx-master-3s",
    name: "Logitech MX Master 3S",
    brand: "Logitech",
    model: "Wireless Mouse",
    category: "accessories",
    condition: "new",
    priceNgn: 65000,
    oldPriceNgn: 79000,
    imageUrl:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1400&q=80"
    ],
    stockCount: 2,
    inStock: true,
    description: "Ergonomic productivity mouse with ultra-fast scroll and quiet clicks.",
    specs: {
      Connectivity: "Bluetooth / USB Receiver",
      Battery: "Up to 70 days",
      DPI: "Up to 8000",
      Warranty: "6 Months"
    },
    createdAtMs: 1742946400000
  }
];

export const BRANDS = Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort((a, b) =>
  a.localeCompare(b)
);

export function getProductById(id: string): Product | null {
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

export function getRelatedProducts(product: Product, max = 4): Product[] {
  const byCategory = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category);
  const byBrand = PRODUCTS.filter((p) => p.id !== product.id && p.brand === product.brand);
  const combined = [...byCategory, ...byBrand];
  const unique = Array.from(new Map(combined.map((p) => [p.id, p])).values());
  return unique.slice(0, max);
}

