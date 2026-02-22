"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Package, Mail } from "lucide-react"

const DELIVERY_PERIOD_LABELS: Record<string, string> = {
  morning: "Morning (9:00 AM - 12:00 PM)",
  afternoon: "Afternoon (12:00 PM - 4:00 PM)",
  evening: "Evening (4:00 PM - 8:00 PM)",
  night: "Night (8:00 PM - 11:00 PM)",
}

type OrderData = {
  id: string
  orderNumber: string
  status: string
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  deliveryPeriod: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  items: { id: string; name: string; price: number; quantity: number }[]
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading order details...</p>
        </main>
        <Footer />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading order details...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Order not found</h1>
          <Link href="/shop"><Button>Continue Shopping</Button></Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-xl text-muted-foreground mb-2">Thank you for your purchase</p>
          <p className="text-muted-foreground">Order #{order.orderNumber}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Confirmation Email</h3>
            <p className="text-sm text-muted-foreground">
              A confirmation will be sent to <span className="font-semibold">{order.email}</span>
            </p>
          </Card>

          <Card className="p-6 text-center">
            <Package className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Shipping</h3>
            <p className="text-sm text-muted-foreground">
              We&apos;ll contact you within 24 hours to arrange payment and shipping
            </p>
          </Card>

          <Card className="p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground">Contact our support team at hello@souvenirstories.com</p>
          </Card>
        </div>

        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6 pb-6 border-b border-border">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-semibold">${order.shipping.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-bold text-lg">Total</span>
              <span className="text-3xl font-bold text-primary">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>
          <div className="text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">{order.firstName} {order.lastName}</p>
            <p>{order.address}</p>
            <p>{order.city}, Egypt</p>
            <p className="mt-3 font-medium text-foreground">
              Preferred Delivery Time: {DELIVERY_PERIOD_LABELS[order.deliveryPeriod] || order.deliveryPeriod}
            </p>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop">
            <Button size="lg" variant="outline">Continue Shopping</Button>
          </Link>
          <Link href="/">
            <Button size="lg" className="bg-primary hover:bg-primary/90">Back to Home</Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
