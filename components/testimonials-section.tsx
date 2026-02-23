import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    text: "The quality of these souvenirs is exceptional! Each piece feels authentic and brings back wonderful memories of my travels.",
    image: "https://pjxkbmcvaajjyyggotof.supabase.co/storage/v1/object/public/images/woman-portrait.png",
  },
  {
    name: "Marco Rossi",
    location: "Milan, Italy",
    rating: 5,
    text: "I've purchased from Souvenir Stories multiple times. The attention to detail and customer service is outstanding.",
    image: "https://pjxkbmcvaajjyyggotof.supabase.co/storage/v1/object/public/images/thoughtful-man-portrait.png",
  },
  {
    name: "Yuki Tanaka",
    location: "Tokyo, Japan",
    rating: 5,
    text: "These souvenirs make perfect gifts! My friends loved the items I brought back. Highly recommended!",
    image: "https://pjxkbmcvaajjyyggotof.supabase.co/storage/v1/object/public/images/asian-woman-portrait.png",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Loved by Travelers</h2>
          <p className="text-lg text-muted-foreground text-balance">
            See what our customers say about their souvenir experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 flex flex-col">
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-foreground mb-6 flex-grow italic">"{testimonial.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
