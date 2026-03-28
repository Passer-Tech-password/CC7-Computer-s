import type { Product } from "@/types/product";
import type { RepairJobStatus } from "@/types/repairJob";

export type SeedRepairJob = {
  jobNumber: string;
  userUid: string | null;
  customerName: string;
  customerPhone: string;
  deviceType: string;
  brand: string;
  model: string;
  status: RepairJobStatus;
  technicianName: string;
  beforeNotes: string;
  afterNotes: string;
  createdAtMs: number;
  estimatedCompletionISO?: string;
};

export const SEED_PRODUCTS: Product[] = [
  {
    id: "hp-elitebook-840g8-ng",
    name: "HP EliteBook 840 G8",
    brand: "HP",
    model: "Core i7 / 16GB / 512GB SSD",
    category: "laptops",
    condition: "refurbished",
    priceNgn: 485000,
    oldPriceNgn: 530000,
    imageUrl: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80",
    images: [],
    stockCount: 6,
    inStock: true,
    description: "Clean business laptop. Strong battery and performance for office + school.",
    specs: {
      CPU: "Intel Core i7 (11th Gen)",
      RAM: "16GB",
      Storage: "512GB SSD",
      Display: "14-inch FHD",
      OS: "Windows 11 Pro"
    },
    createdAtMs: 1743200000000
  },
  {
    id: "dell-latitude-7420-ng",
    name: "Dell Latitude 7420",
    brand: "Dell",
    model: "Core i5 / 8GB / 256GB SSD",
    category: "laptops",
    condition: "fairly_used",
    priceNgn: 320000,
    oldPriceNgn: 360000,
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80",
    images: [],
    stockCount: 3,
    inStock: true,
    description: "Solid work laptop for students and business. Light, fast, reliable.",
    specs: {
      CPU: "Intel Core i5",
      RAM: "8GB",
      Storage: "256GB SSD",
      Display: "14-inch",
      OS: "Windows 11"
    },
    createdAtMs: 1743210000000
  },
  {
    id: "lenovo-thinkpad-t14-ng",
    name: "Lenovo ThinkPad T14",
    brand: "Lenovo",
    model: "Ryzen 5 / 16GB / 512GB SSD",
    category: "laptops",
    condition: "refurbished",
    priceNgn: 410000,
    oldPriceNgn: 460000,
    imageUrl: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=1200&q=80",
    images: [],
    stockCount: 2,
    inStock: true,
    description: "ThinkPad durability with Ryzen performance. Great keyboard and multitasking.",
    specs: {
      CPU: "AMD Ryzen 5",
      RAM: "16GB",
      Storage: "512GB SSD",
      Display: "14-inch FHD"
    },
    createdAtMs: 1743220000000
  },
  {
    id: "ssd-kingston-1tb-ng",
    name: "Kingston NVMe SSD",
    brand: "Kingston",
    model: "1TB NVMe",
    category: "accessories",
    condition: "new",
    priceNgn: 85000,
    oldPriceNgn: 99000,
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80",
    images: [],
    stockCount: 14,
    inStock: true,
    description: "Upgrade your laptop/desktop speed instantly. Perfect for Windows + apps.",
    specs: {
      Type: "NVMe",
      Capacity: "1TB",
      Warranty: "1 year"
    },
    createdAtMs: 1743230000000
  }
];

export const SEED_REPAIR_JOBS: SeedRepairJob[] = [
  {
    jobNumber: "CC7-2026-086-1201",
    userUid: null,
    customerName: "Chinedu O.",
    customerPhone: "+2347012345678",
    deviceType: "Laptop",
    brand: "HP",
    model: "EliteBook 840 G8",
    status: "diagnosis",
    technicianName: "Tech. Mary",
    beforeNotes: "Client reports random shutdown and keyboard issues. Needs full diagnosis + cleaning.",
    afterNotes: "",
    createdAtMs: 1743200000000,
    estimatedCompletionISO: "2026-04-05"
  },
  {
    jobNumber: "CC7-2026-086-1202",
    userUid: null,
    customerName: "Adaeze N.",
    customerPhone: "+2348098765432",
    deviceType: "Phone",
    brand: "Apple",
    model: "iPhone 13 Pro",
    status: "repairing",
    technicianName: "Tech. Chuks",
    beforeNotes: "Battery drain + charging port cleaning requested. Confirmed battery health is low.",
    afterNotes: "",
    createdAtMs: 1743205000000,
    estimatedCompletionISO: "2026-04-02"
  }
];

export async function seedFirestore({
  db,
  userUidForRepairs
}: {
  db: import("firebase/firestore").Firestore;
  userUidForRepairs?: string;
}): Promise<void> {
  const firestore = await import("firebase/firestore");
  const { collection, doc, serverTimestamp, setDoc, addDoc } = firestore;

  const productsCol = collection(db, "products");
  for (const product of SEED_PRODUCTS) {
    await addDoc(productsCol, { ...product, createdAt: serverTimestamp() });
  }

  const repairsCol = collection(db, "repair_jobs");
  for (const job of SEED_REPAIR_JOBS) {
    await addDoc(repairsCol, {
      ...job,
      userUid: userUidForRepairs ?? job.userUid,
      createdAt: serverTimestamp()
    });
  }

  if (userUidForRepairs) {
    await setDoc(
      doc(db, "users", userUidForRepairs),
      { uid: userUidForRepairs, updatedAt: serverTimestamp() },
      { merge: true }
    );
  }
}
