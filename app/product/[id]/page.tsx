import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getProductById, getRelatedProducts } from "@/lib/data"
import ProductDetailClient from "@/components/product-detail-client"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Product not found</h1>
            <Link href="/shop">
              <Button>Back to Shop</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const relatedProducts = await getRelatedProducts(product.id, product.categoryId)

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
        specifications: product.specifications.map((s) => ({
          label: s.label,
          value: s.value,
        })),
      }}
      relatedProducts={relatedProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
      }))}
    />
  )
}
