import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Hero3D from "@/components/hero-3d"
import AnimatedFeaturedProducts from "@/components/animated-featured-products"
import AnimatedCategories from "@/components/animated-categories"
import AnimatedTestimonials from "@/components/animated-testimonials"
import BestSellers from "@/components/best-sellers"
import CategoryCircles from "@/components/category-circles"
import FlashSaleBanner from "@/components/flash-sale-banner"
import FlashSaleSection from "@/components/flash-sale-section"
import { getFeaturedProducts, getBestSellers, getFlashSaleProducts, getCategories } from "@/lib/data"

export default async function Home() {
  const [featuredProducts, bestSellers, flashSaleProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getBestSellers(),
    getFlashSaleProducts(),
    getCategories(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FlashSaleBanner />
      <div className="h-[calc(100vh-4rem)]">
        <Hero3D />
        <CategoryCircles
          categories={categories.map((c) => ({
            id: c.id,
            name: c.name,
            image: c.image,
          }))}
        />
      </div>
      <main>
        <AnimatedFeaturedProducts
          products={featuredProducts.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            categoryName: p.category.name,
          }))}
        />

        <BestSellers
          products={bestSellers.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            categoryName: p.category.name,
            sales: p.sales,
          }))}
        />

        <FlashSaleSection
          products={flashSaleProducts.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            originalPrice: p.originalPrice,
            discount: p.discount,
            image: p.image,
            categoryName: p.category.name,
          }))}
        />

        <AnimatedCategories
          categories={categories.map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            image: c.image,
            productCount: c.productCount,
          }))}
        />

        <AnimatedTestimonials />

        <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Bring Home a Memory</h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Every souvenir tells a story. Explore our curated collection of authentic Egyptian treasures.
            </p>
            <Link href="/shop">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Shop Souvenirs
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
