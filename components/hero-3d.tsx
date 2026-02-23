"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function Hero3D() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroImages = [
    "https://pjxkbmcvaajjyyggotof.supabase.co/storage/v1/object/public/images/travel-souvenirs-collection-display.jpg",
    "https://pjxkbmcvaajjyyggotof.supabase.co/storage/v1/object/public/images/egyptian-traditional-crafts.jpg",
    "https://pjxkbmcvaajjyyggotof.supabase.co/storage/v1/object/public/images/egyptian-spice-market.jpg",
    "https://pjxkbmcvaajjyyggotof.supabase.co/storage/v1/object/public/images/egyptian-jewelry-collection.jpg",
    "https://pjxkbmcvaajjyyggotof.supabase.co/storage/v1/object/public/images/egyptian-home-decor.jpg",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <div className="relative w-full h-[calc(100%-8rem)] bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`Egyptian souvenirs ${index + 1}`}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-8 md:px-16">
        <div className="max-w-2xl text-center">
          <div className="mb-4 inline-block">
            <span className="text-sm font-semibold text-primary tracking-widest uppercase">
              Welcome to Souvenir Stories
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance leading-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Authentic Egyptian
            </span>
            <br />
            <span className="text-foreground">Treasures Await</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-xl leading-relaxed mx-auto">
            Discover handcrafted souvenirs that capture the essence of Egypt's rich heritage and timeless beauty.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/categories">
              <button className="px-6 py-3 md:px-8 md:py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 transform hover:scale-105">
                Explore Collection
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
