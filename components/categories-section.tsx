import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

type CategorySectionItem = {
  id: string
  name: string
  description: string | null
  image: string | null
  featured: string[]
}

export default function CategoriesSection({ categories }: { categories: CategorySectionItem[] }) {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Shop by Category</h2>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Explore our curated Egyptian souvenir categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {categories.map((category) => (
            <Link key={category.id} href={`/shop?category=${category.name}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col group">
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground mb-4 flex-grow text-sm">{category.description}</p>

                  <div className="mb-6">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Featured Items:</p>
                    <div className="flex flex-wrap gap-2">
                      {category.featured.map((item, idx) => (
                        <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-4 border-t border-border">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2">
                      Explore <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/categories">
            <Button size="lg" variant="outline">
              View All Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
