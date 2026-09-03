"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Star, Share2, ChevronLeft } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatRating } from "@/lib/utils"
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
}

export default function ProductDetailClient({ product }: { product: ProductDetail }) {  const router = useRouter()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const viewLogged = useRef(false)
  useEffect(() => {
    if (viewLogged.current) return
    viewLogged.current = true

    const VIEWED_KEY = "sedra-viewed"
    try {
      const viewed: string[] = JSON.parse(localStorage.getItem(VIEWED_KEY) || "[]")
      if (viewed.includes(product.id)) return
      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      })
        .then(() => {
          viewed.push(product.id)
          localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed))
        })
        .catch(() => {})
    } catch {
      // localStorage unavailable
    }
  }, [product.id])

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image }, quantity)
    setAddedToCart(true)
    toast.success(`${product.name} added to cart`)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleShare = async () => {
    const url = window.location.href
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Souvenir Stories`,
      url,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }

      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard")
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      toast.error("Could not share this product")
    }
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
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
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
              <span className="text-lg font-semibold">{formatRating(product.rating)}</span>
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
                onClick={handleShare}
                aria-label="Share product"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
