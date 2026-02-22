"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

type FlashSaleProduct = {
  id: string
  name: string
  price: number
  originalPrice: number | null
  discount: number | null
  image: string | null
  categoryName: string
}

export default function FlashSaleSection({ products }: { products: FlashSaleProduct[] }) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent, product: FlashSaleProduct) => {
    e.preventDefault()
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image })
    toast.success(`${product.name} added to cart`)
  }

  return (
    <section id="flash-sale-section" className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-red-600 text-white text-sm px-4 py-1">Limited Time Offer</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Flash Sale Treasures</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Grab these authentic Egyptian souvenirs at unbeatable prices before time runs out!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group h-full flex flex-col bg-card rounded-2xl overflow-hidden border-2 border-border hover:border-red-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.discount && (
                  <Badge className="absolute top-4 right-4 bg-red-600 text-white font-bold text-lg px-3 py-1">
                    -{product.discount}%
                  </Badge>
                )}
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <p className="text-sm text-muted-foreground mb-2">{product.categoryName}</p>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground group-hover:text-red-600 transition-colors">
                  {product.name}
                </h3>

                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-red-600">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    {product.originalPrice && (
                      <p className="text-sm text-green-600 font-medium">
                        Save ${(product.originalPrice - product.price).toFixed(2)}
                      </p>
                    )}
                  </div>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={(e) => handleAddToCart(e, product)}>
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
