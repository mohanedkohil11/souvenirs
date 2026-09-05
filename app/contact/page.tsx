"use client"

import type React from "react"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, MessageCircle } from "lucide-react"
import { CONTACT_PHONE, CONTACT_PHONE_DISPLAY, CONTACT_WHATSAPP_URL } from "@/lib/contact"
import { SOCIAL_LINKS } from "@/lib/social"
import { SocialIcon } from "@/components/social-links"
import { toast } from "sonner"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to send message")
      }

      setIsSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })

      setTimeout(() => {
        setIsSubmitted(false)
      }, 3000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto mb-16">
          <Card className="p-8 text-center">
            <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Phone</h3>
            <a href={`tel:${CONTACT_PHONE}`} className="text-primary hover:underline">
              {CONTACT_PHONE_DISPLAY}
            </a>
          </Card>

          <Card className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
            <a
              href={CONTACT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
          </Card>
        </div>

        {/* Social */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-6">Follow Sedra</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer me"
                className="group"
              >
                <Card className="p-6 text-center transition-colors group-hover:border-primary">
                  <SocialIcon platform={link.platform} className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-bold">{link.label}</h3>
                  <p className="text-sm text-muted-foreground">{link.handle}</p>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-xl mx-auto">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-green-600">✓</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Thank you!</h3>
                <p className="text-muted-foreground">We've received your message and will get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 py-2">
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
