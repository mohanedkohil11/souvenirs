"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

type CategoryItem = {
  id: string
  name: string
  description: string | null
  image: string | null
  productCount: number
}

export default function AnimatedCategories({ categories }: { categories: CategoryItem[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
      <div className="absolute top-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
            Explore{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Categories</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our curated collections of authentic Egyptian souvenirs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories?cat=${category.id}`}>
              <div
                className="group cursor-pointer h-full"
                onMouseEnter={() => setHoveredId(category.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative overflow-hidden rounded-3xl h-80 bg-card border border-border/50 transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transform hover:-translate-y-3">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-125"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <div className="transform transition-transform duration-500 group-hover:translate-y-0 translate-y-4">
                      <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-200 mb-4">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary">{category.productCount} items</span>
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 transform group-hover:scale-110">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent w-0 group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
