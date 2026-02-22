import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/travel-souvenirs-collection-display.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-background/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="mb-6 inline-block">
          <span className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full">
            Authentic Travel Treasures
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight">
          Every Journey Deserves a <span className="text-primary">Memory</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
          Discover authentic souvenirs from around the world. Each piece tells a story of adventure, culture, and
          connection.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
              Start Shopping
            </Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
              Learn Our Story
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
