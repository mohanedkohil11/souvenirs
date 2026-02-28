"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Travel Enthusiast",
    content:
      "The quality and authenticity of these souvenirs are exceptional. Each piece tells a story of Egypt's rich heritage.",
    image: "https://pjxkbmcvaajjyyggotof.supabase.co/storage/v1/object/public/images/woman-avatar.png",
    rating: 5,
  },
  {
    id: 2,
    name: "Evelyn Flores",
    role: "Cultural Collector",
    content:
      "I've purchased from many souvenir shops, but Sedra stands out for their commitment to authenticity and craftsmanship.",
    image: "https://pjxkbmcvaajjyyggotof.supabase.co/storage/v1/object/public/images/man-avatar.png",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma Wilson",
    role: "Gift Buyer",
    content:
      "Perfect gifts for friends and family. The packaging is beautiful and the items arrived in perfect condition.",
    image: "https://pjxkbmcvaajjyyggotof.supabase.co/storage/v1/object/public/images/woman-avatar-2.png",
    rating: 5,
  },
]

export default function AnimatedTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="my-24 px-4 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
            What Our{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Customers Say</span>
          </h2>
        </div>

        {/* Testimonials carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl bg-card border border-border/50 p-12 md:p-16 min-h-96 flex flex-col justify-center">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 p-12 md:p-16 flex flex-col justify-center transition-all duration-700 ${index === activeIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                  }`}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-primary fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                <p className="text-2xl md:text-3xl font-light mb-8 text-foreground leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex ? "bg-primary w-8" : "bg-border hover:bg-primary/50"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
