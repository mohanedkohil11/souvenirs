export const dynamic = "force-dynamic"

import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { getCategories } from "@/lib/data"

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-4">Explore Egyptian Categories</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our curated collections of authentic Egyptian souvenirs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {categories.map((category) => (
            <Link key={category.id} href={`/shop?category=${category.name}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col group">
                <div className="relative h-64 overflow-hidden bg-muted">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-3xl font-bold mb-2">{category.name}</h2>
                  <p className="text-muted-foreground mb-4 flex-grow">{category.description}</p>

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-muted-foreground mb-2">Featured Items:</p>
                    <div className="flex flex-wrap gap-2">
                      {category.featured.map((item, idx) => (
                        <span key={idx} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm font-medium text-muted-foreground">{category.productCount} products</span>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2">
                      Explore <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
