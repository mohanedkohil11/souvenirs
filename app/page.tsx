export const dynamic = "force-dynamic"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Hero3D from "@/components/hero-3d"
import AnimatedFeaturedProducts from "@/components/animated-featured-products"
import { getProducts } from "@/lib/data"

export default async function Home() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="h-[calc(100vh-4rem)]">
        <Hero3D />
      </div>
      <main>
        <AnimatedFeaturedProducts
          products={products.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            categoryName: p.category.name,
          }))}
        />

      </main>
      <Footer />
    </div>
  )
}
