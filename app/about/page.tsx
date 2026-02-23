import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Heart, Zap } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Globe,
      title: "Egyptian Heritage",
      description:
        "We partner with local Egyptian artisans and craftspeople to bring authentic souvenirs directly to you.",
    },
    {
      icon: Heart,
      title: "Quality & Authenticity",
      description:
        "Every item is carefully selected and verified for authenticity, ensuring you get genuine Egyptian cultural treasures.",
    },
    {
      icon: Zap,
      title: "Fast & Reliable",
      description:
        "We handle shipping with care and provide tracking so you can follow your souvenirs every step of the way.",
    },
  ]

  const team = [
    {
      name: "Sarah Chen",
      role: "Founder & CEO",
      image: "https://pjxkbmcvaajjyyggotof.supabase.co/storage/v1/object/public/images/woman-portrait.png",
      bio: "Travel enthusiast with 10+ years of experience in Egyptian trade.",
    },
    {
      name: "Marco Rossi",
      role: "Head of Sourcing",
      image: "https://pjxkbmcvaajjyyggotof.supabase.co/storage/v1/object/public/images/thoughtful-man-portrait.png",
      bio: "Expert in connecting with Egyptian artisans and ensuring product authenticity.",
    },
    {
      name: "Yuki Tanaka",
      role: "Customer Experience",
      image: "https://pjxkbmcvaajjyyggotof.supabase.co/storage/v1/object/public/images/asian-woman-portrait.png",
      bio: "Dedicated to making every customer journey memorable and smooth.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Our Story</h1>
            <p className="text-xl text-muted-foreground text-balance">
              Souvenir Stories was born from a passion for Egypt and a desire to preserve the memories and rich cultural
              heritage of this ancient land.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  We believe that every journey to Egypt deserves a memory. Our mission is to connect travelers with
                  authentic, high-quality Egyptian souvenirs that tell the stories of this magnificent country.
                </p>
                <p className="text-lg text-muted-foreground">
                  By supporting local Egyptian artisans and craftspeople, we help preserve cultural traditions while
                  giving you meaningful pieces to treasure forever.
                </p>
              </div>
              <div className="h-96 bg-muted rounded-2xl overflow-hidden">
                <img
                  src="https://pjxkbmcvaajjyyggotof.supabase.co/storage/v1/object/public/images/travel-souvenirs-collection-display.jpg"
                  alt="Our collection"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, idx) => {
                const Icon = value.icon
                return (
                  <Card key={idx} className="p-8 text-center">
                    <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, idx) => (
                <Card key={idx} className="overflow-hidden text-center">
                  <div className="h-64 bg-muted overflow-hidden">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary font-semibold mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.bio}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Explore?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start your journey through our collection of authentic Egyptian souvenirs.
            </p>
            <Link href="/shop">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Shop Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
