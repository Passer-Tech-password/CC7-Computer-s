import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRODUCTS, getProductById, getRelatedProducts } from "@/lib/products";
import { ProductDetailClient } from "@/components/ProductDetailClient";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const product = getProductById(params.id);
  if (!product) return {};
  return {
    title: `${product.brand} ${product.name}`,
    description: product.description ?? `${product.brand} ${product.model} available at CC7 Computers.`
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  const related = getRelatedProducts(product, 4);

  return (
    <div className="container-page py-8">
      <ProductDetailClient product={product} related={related} />
    </div>
  );
}
