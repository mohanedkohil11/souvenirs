"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Heart, Share2, ChevronLeft } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

type ProductDetail = {
  id: string
  name: string
  price: number
  rating: number
  reviews: number
  image: string | null
  fullDescription: string | null
  inStock: boolean
  quantity: number
  categoryName: string
  specifications: { label: string; value: string }[]
}

type RelatedProduct = {
  id: string
  name: string
  price: number
  image: string | null
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: ProductDetail
  relatedProducts: RelatedProduct[]
}) {
  const router = useRouter()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image }, quantity)
    setAddedToCart(true)
    toast.success(`${product.name} added to cart`)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square bg-muted rounded-2xl overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-4">
              <span className="inline-block bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                {product.categoryName}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted"}`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <p className="text-lg text-muted-foreground mb-8">{product.fullDescription}</p>

            <div className="mb-8">
              <span className="text-5xl font-bold text-primary">${product.price.toFixed(2)}</span>
              {product.inStock && (
                <p className="text-sm text-green-600 font-semibold mt-2">In Stock ({product.quantity} available)</p>
              )}
            </div>

            <div className="flex items-center gap-4 mb-8">
              <label className="font-semibold">Quantity:</label>
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-muted transition-colors"
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-muted transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleAddToCart}
              >
                {addedToCart ? "Added to Cart!" : "Add to Cart"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-6 bg-transparent"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button size="lg" variant="outline" className="px-6 bg-transparent">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            <div className="border-t border-border pt-8">
              <h3 className="font-bold text-lg mb-4">Specifications</h3>
              <div className="space-y-3">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((relProduct) => (
              <Link key={relProduct.id} href={`/product/${relProduct.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="h-48 bg-muted overflow-hidden">
                    <img
                      src={relProduct.image || "/placeholder.svg"}
                      alt={relProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{relProduct.name}</h3>
                    <p className="text-2xl font-bold text-primary">${relProduct.price.toFixed(2)}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
