export const dynamic = "force-dynamic"

import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getProductById } from "@/lib/data"
import ProductDetailClient from "@/components/product-detail-client"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    return (
      <div className="museum dark min-h-screen">
        <Header variant="overlay" />
        <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
          <p className="museum-label text-[var(--museum-gold)]">Not in the collection</p>
          <h1 className="museum-display mt-6 text-[clamp(2.2rem,6vw,4rem)] text-[var(--museum-alabaster)]">
            This object is no longer here.
          </h1>
          <Link
            href="/#collection"
            className="museum-label mt-12 inline-flex items-center gap-3 border-b border-[var(--museum-gold)]/40 pb-2 text-[var(--museum-gold)] transition-colors hover:border-[var(--museum-gold)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--museum-gold)]"
          >
            Back to the collection
            <span aria-hidden="true">→</span>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <ProductDetailClient
      product={{
        id: product.id,
        name: product.name,
        price: product.price,
        rating: product.rating,
        reviews: product.reviews,
        image: product.image,
        fullDescription: product.fullDescription,
        inStock: product.inStock,
        quantity: product.quantity,
        categoryName: product.category.name,
      }}
    />
  )
}
