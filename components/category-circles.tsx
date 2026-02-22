"use client"

import Link from "next/link"
import Image from "next/image"

type CategoryCircle = {
  id: string
  name: string
  image: string | null
}

export default function CategoryCircles({ categories }: { categories: CategoryCircle[] }) {
  return (
    <section className="h-40 md:h-44 px-4 bg-background border-t border-border/50 flex items-center">
      <div className="w-full max-w-7xl mx-auto">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-6 md:gap-8 min-w-max px-4 py-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories?cat=${category.id}`}
                className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-110 flex-shrink-0"
              >
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors duration-300 shadow-md group-hover:shadow-lg group-hover:shadow-primary/20">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300 whitespace-nowrap">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
