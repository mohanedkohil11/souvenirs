"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

const EGYPT_CITIES = [
  "Hurghada",
  "Cairo",
  "Alexandria",
  "Giza",
  "Sharm El Sheikh",
  "Luxor",
  "Aswan",
  "Port Said",
  "Suez",
  "Mansoura",
  "Tanta",
  "Ismailia",
  "Faiyum",
  "Zagazig",
  "Damietta",
  "Minya",
  "Sohag",
  "Beni Suef",
  "Qena",
  "Marsa Alam",
  "El Gouna",
  "Dahab",
  "Safaga",
]

const DELIVERY_PERIODS = [
  { value: "morning", label: "Morning (9:00 AM - 12:00 PM)" },
  { value: "afternoon", label: "Afternoon (12:00 PM - 4:00 PM)" },
  { value: "evening", label: "Evening (4:00 PM - 8:00 PM)" },
  { value: "night", label: "Night (8:00 PM - 11:00 PM)" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, totalItems, clearCart } = useCart()
  const shipping = totalItems > 0 ? 10 : 0
  const total = subtotal + shipping

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "Hurghada",
    deliveryPeriod: "morning",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        }),
      })

      if (res.ok) {
        const order = await res.json()
        clearCart()
        router.push(`/order-confirmation?id=${order.id}`)
      } else {
        toast.error("Failed to place order. Please try again.")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some items before checking out.</p>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">First Name</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ahmed" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Last Name</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Mohamed" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="ahmed@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="+20 100 000 0000" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-8">
                  <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="123 El Nasr Street, Downtown" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">City</label>
                      <select name="city" value={formData.city} onChange={handleChange} required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                        {EGYPT_CITIES.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Preferred Delivery Time</label>
                      <select name="deliveryPeriod" value={formData.deliveryPeriod} onChange={handleChange} required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                        {DELIVERY_PERIODS.map((period) => (
                          <option key={period.value} value={period.value}>{period.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-8">
                  <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg">
                    {isLoading ? "Processing..." : "Complete Order"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    No payment required. We&apos;ll contact you to arrange payment after order confirmation.
                  </p>
                </div>
              </form>
            </Card>
          </div>

          <div>
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold">${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
