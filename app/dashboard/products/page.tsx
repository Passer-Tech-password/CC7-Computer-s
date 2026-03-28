/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable, DataTableColumn } from "@/components/DataTable";
import { formatNgn } from "@/lib/products";
import { getFirebaseClientAsync } from "@/lib/firebase";
import type { Product, ProductCategory, ProductCondition } from "@/types/product";
import { toast } from "sonner";

type ProductRow = Product & { docId: string };

type ProductDraft = {
  name: string;
  brand: string;
  model: string;
  category: ProductCategory;
  condition: ProductCondition;
  priceNgn: number;
  oldPriceNgn?: number;
  imageUrl: string;
  stockCount: number;
  inStock: boolean;
};

function parseString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function parseNumber(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function parseBoolean(v: unknown): boolean | null {
  return typeof v === "boolean" ? v : null;
}

function parseProduct(docId: string, data: unknown): ProductRow | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  const id = parseString(obj.id) ?? docId;
  const name = parseString(obj.name);
  const brand = parseString(obj.brand);
  const model = parseString(obj.model);
  const category = parseString(obj.category) as ProductCategory | null;
  const condition = parseString(obj.condition) as ProductCondition | null;
  const priceNgn = parseNumber(obj.priceNgn);
  const oldPriceNgn = parseNumber(obj.oldPriceNgn ?? undefined) ?? undefined;
  const imageUrl = parseString(obj.imageUrl);
  const stockCount = parseNumber(obj.stockCount);
  const inStock = parseBoolean(obj.inStock);
  const createdAtMs = parseNumber(obj.createdAtMs) ?? Date.now();
  if (!name || !brand || !model || !category || !condition || priceNgn === null || !imageUrl || stockCount === null || inStock === null) {
    return null;
  }
  return {
    docId,
    id,
    name,
    brand,
    model,
    category,
    condition,
    priceNgn,
    oldPriceNgn,
    imageUrl,
    images: [],
    stockCount,
    inStock,
    createdAtMs
  };
}

function defaultDraft(): ProductDraft {
  return {
    name: "",
    brand: "",
    model: "",
    category: "laptops",
    condition: "new",
    priceNgn: 0,
    oldPriceNgn: undefined,
    imageUrl: "",
    stockCount: 0,
    inStock: false
  };
}

export default function DashboardProductsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [draft, setDraft] = useState<ProductDraft>(defaultDraft());

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const { db } = await getFirebaseClientAsync();
      const { collection, getDocs, limit, orderBy, query } = await import("firebase/firestore");
      const snap = await getDocs(query(collection(db, "products"), orderBy("createdAtMs", "desc"), limit(500)));
      const parsed = snap.docs.map((d) => parseProduct(d.id, d.data())).filter((v): v is ProductRow => Boolean(v));
      setRows(parsed);
    } catch (e) {
      console.error(e);
      setError("Failed to load products. Check Firestore rules and network.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function openNew() {
    setEditing(null);
    setDraft(defaultDraft());
    setModalOpen(true);
  }

  function openEdit(p: ProductRow) {
    setEditing(p);
    setDraft({
      name: p.name,
      brand: p.brand,
      model: p.model,
      category: p.category,
      condition: p.condition,
      priceNgn: p.priceNgn,
      oldPriceNgn: p.oldPriceNgn,
      imageUrl: p.imageUrl,
      stockCount: p.stockCount,
      inStock: p.inStock
    });
    setModalOpen(true);
  }

  async function save() {
    if (!draft.name.trim() || !draft.brand.trim() || !draft.model.trim() || !draft.imageUrl.trim()) return;
    setSaving(true);
    try {
      const { db } = await getFirebaseClientAsync();
      const { addDoc, collection, doc, serverTimestamp, updateDoc } = await import("firebase/firestore");
      const payload = {
        id: editing?.id ?? undefined,
        name: draft.name.trim(),
        brand: draft.brand.trim(),
        model: draft.model.trim(),
        category: draft.category,
        condition: draft.condition,
        priceNgn: Number(draft.priceNgn) || 0,
        oldPriceNgn: draft.oldPriceNgn ? Number(draft.oldPriceNgn) : undefined,
        imageUrl: draft.imageUrl.trim(),
        stockCount: Number(draft.stockCount) || 0,
        inStock: Boolean(draft.stockCount && draft.stockCount > 0),
        createdAtMs: editing ? editing.createdAtMs : Date.now()
      };

      if (editing) {
        await updateDoc(doc(db, "products", editing.docId), { ...payload, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "products"), { ...payload, createdAt: serverTimestamp() });
      }

      setModalOpen(false);
      await refresh();
    } catch (e) {
      console.error(e);
      toast.error("Save failed", { description: "Failed to save product." });
    } finally {
      setSaving(false);
    }
  }

  async function removeProduct(p: ProductRow) {
    const ok = window.confirm(`Delete "${p.name}"?`);
    if (!ok) return;
    try {
      const { db } = await getFirebaseClientAsync();
      const { deleteDoc, doc } = await import("firebase/firestore");
      await deleteDoc(doc(db, "products", p.docId));
      await refresh();
    } catch (e) {
      console.error(e);
      toast.error("Delete failed", { description: "Failed to delete product." });
    }
  }

  const columns = useMemo<Array<DataTableColumn<ProductRow>>>(
    () => [
      {
        key: "image",
        header: "Image",
        cell: (p) => (
          <div className="h-12 w-16 overflow-hidden rounded-xl bg-dark/5 dark:bg-light/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
          </div>
        )
      },
      {
        key: "name",
        header: "Name",
        cell: (p) => (
          <div className="min-w-0">
            <div className="truncate font-extrabold text-dark dark:text-light">{p.name}</div>
            <div className="mt-0.5 text-xs font-bold text-dark/60 dark:text-light/60">
              {p.brand} • {p.model}
            </div>
          </div>
        ),
        className: "min-w-[260px]"
      },
      { key: "price", header: "Price", cell: (p) => <span className="font-black text-primary-red">{formatNgn(p.priceNgn)}</span> },
      {
        key: "stock",
        header: "Stock",
        cell: (p) => (
          <span
            className={[
              "rounded-full px-3 py-1 text-xs font-extrabold",
              p.stockCount <= 0
                ? "bg-primary-red/15 text-primary-red"
                : p.stockCount <= 5
                  ? "bg-primary-yellow/25 text-yellow-800 dark:text-primary-yellow"
                  : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
            ].join(" ")}
          >
            {p.stockCount}
          </span>
        )
      },
      { key: "condition", header: "Condition", cell: (p) => <span className="text-xs font-bold">{p.condition}</span> },
      {
        key: "actions",
        header: "Actions",
        cell: (p) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openEdit(p)}
              className="rounded-xl bg-primary-blue px-3 py-2 text-xs font-extrabold text-white hover:brightness-110"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => removeProduct(p)}
              className="rounded-xl bg-primary-red px-3 py-2 text-xs font-extrabold text-white hover:brightness-110"
            >
              Delete
            </button>
          </div>
        )
      }
    ],
    []
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center rounded-full bg-primary-blue/15 px-3 py-1 text-sm font-extrabold text-primary-blue">
            Products
          </div>
          <h1 className="mt-3 text-3xl font-black text-dark dark:text-light">Products Management</h1>
          <p className="mt-2 text-sm font-semibold text-dark/70 dark:text-light/70">Create, edit, and control inventory.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refresh}
            className="btn inline-flex rounded-xl bg-primary-yellow px-4 py-2.5 font-extrabold text-dark hover:brightness-95"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={openNew}
            className="btn inline-flex rounded-xl bg-primary-blue px-4 py-2.5 font-extrabold text-white hover:brightness-110"
          >
            Add New Product
          </button>
        </div>
      </div>

      {error ? (
        <div className="card border border-primary-red/25">
          <div className="text-sm font-extrabold text-primary-red">Error</div>
          <div className="mt-1 text-sm font-semibold text-dark/70 dark:text-light/70">{error}</div>
        </div>
      ) : null}

      <DataTable rows={rows} columns={columns} emptyLabel={loading ? "Loading…" : "No products yet."} loading={loading} />

      {modalOpen ? (
        <div className="fixed inset-0 z-50 bg-black/60 p-4" role="dialog" aria-modal="true">
          <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0b1220]">
            <div className="flex items-center justify-between border-b border-dark/10 p-4 dark:border-light/10">
              <div className="text-lg font-extrabold text-dark dark:text-light">
                {editing ? "Edit Product" : "Add New Product"}
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn-ghost h-10 w-10 rounded-full p-0"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Name</label>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                />
              </div>
              <div>
                <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Brand</label>
                <input
                  value={draft.brand}
                  onChange={(e) => setDraft((p) => ({ ...p, brand: e.target.value }))}
                  className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                />
              </div>
              <div>
                <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Model</label>
                <input
                  value={draft.model}
                  onChange={(e) => setDraft((p) => ({ ...p, model: e.target.value }))}
                  className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                />
              </div>
              <div>
                <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Category</label>
                <select
                  value={draft.category}
                  onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value as ProductCategory }))}
                  className="w-full rounded-xl border border-dark/15 bg-white px-3 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                >
                  <option value="laptops">Laptops</option>
                  <option value="desktops">Desktops</option>
                  <option value="accessories">Accessories</option>
                  <option value="phones">Phones</option>
                  <option value="printers">Printers</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Condition</label>
                <select
                  value={draft.condition}
                  onChange={(e) => setDraft((p) => ({ ...p, condition: e.target.value as ProductCondition }))}
                  className="w-full rounded-xl border border-dark/15 bg-white px-3 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                >
                  <option value="new">New</option>
                  <option value="fairly_used">Fairly Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Price (₦)</label>
                <input
                  type="number"
                  value={draft.priceNgn}
                  onChange={(e) => setDraft((p) => ({ ...p, priceNgn: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                />
              </div>
              <div>
                <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Old price (₦)</label>
                <input
                  type="number"
                  value={draft.oldPriceNgn ?? ""}
                  onChange={(e) => setDraft((p) => ({ ...p, oldPriceNgn: e.target.value ? Number(e.target.value) : undefined }))}
                  className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Image URL</label>
                <input
                  value={draft.imageUrl}
                  onChange={(e) => setDraft((p) => ({ ...p, imageUrl: e.target.value }))}
                  className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                />
              </div>
              <div>
                <label className="block text-sm font-extrabold text-dark dark:text-light mb-1">Stock count</label>
                <input
                  type="number"
                  value={draft.stockCount}
                  onChange={(e) => setDraft((p) => ({ ...p, stockCount: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-semibold text-dark outline-none focus:ring-2 focus:ring-primary-blue dark:border-light/15 dark:bg-[#0b1220] dark:text-light"
                />
              </div>
              <div className="flex items-end">
                <div className="rounded-xl bg-primary-yellow/20 px-4 py-3 text-xs font-bold text-dark">
                  In-stock auto updates when stockCount &gt; 0
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-dark/10 p-4 dark:border-light/10">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn inline-flex rounded-xl bg-primary-yellow px-5 py-3 font-extrabold text-dark hover:brightness-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="btn inline-flex rounded-xl bg-primary-blue px-6 py-3 font-extrabold text-white hover:brightness-110"
              >
                {saving ? "Saving…" : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
