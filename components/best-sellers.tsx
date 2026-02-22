"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

type BestSellerProduct = {
  id: string
  name: string
  price: number
  image: string | null
  categoryName: string
  sales: number
}

function formatSales(sales: number): string {
  if (sales >= 1000) return `${(sales / 1000).toFixed(1)}k sold`
  return `${sales} sold`
}

export default function BestSellers({ products }: { products: BestSellerProduct[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-accent/20 text-accent font-semibold text-sm uppercase tracking-wider">
              ⭐ Customer Favorites
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
            Best <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Sellers</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the most loved souvenirs chosen by thousands of travelers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <div
                className="group cursor-pointer h-full"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 transition-all duration-500 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/20 transform hover:-translate-y-2 h-full flex flex-col">
                  <div className="absolute top-4 right-4 z-10 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                    {formatSales(product.sales)}
                  </div>

                  <div className="relative h-64 overflow-hidden bg-muted">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-sm text-accent font-semibold mb-2 uppercase tracking-wider">
                      {product.categoryName}
                    </p>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{product.name}</h3>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-bold text-accent">${product.price.toFixed(2)}</span>
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300 transform group-hover:scale-110">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
