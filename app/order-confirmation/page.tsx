"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import MuseumShell, { MuseumHeading } from "@/components/museum-shell"
import { CONTACT_PHONE, CONTACT_PHONE_DISPLAY, CONTACT_WHATSAPP_URL } from "@/lib/contact"

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

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <MuseumShell>
      <section className="px-6 pb-32 pt-32 md:pt-40">
        <div className="mx-auto max-w-4xl">{children}</div>
      </section>
    </MuseumShell>
  )
}

function CollectionLink({ label = "Enter the collection" }: { label?: string }) {
  return (
    <Link
      href="/#collection"
      className="museum-label inline-flex items-center gap-3 border-b border-[var(--museum-gold)]/40 pb-2 text-[var(--museum-gold)] transition-colors hover:border-[var(--museum-gold)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--museum-gold)]"
    >
      {label}
      <span aria-hidden="true">→</span>
    </Link>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <Shell>
          <p className="museum-label text-[var(--muted-foreground)]">Loading your order</p>
        </Shell>
      }
    >
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
      <Shell>
        <p className="museum-label text-[var(--muted-foreground)]">Loading your order</p>
      </Shell>
    )
  }

  if (!order) {
    return (
      <Shell>
        <MuseumHeading eyebrow="Order" title="We cannot find that order." />
        <p className="mt-8 max-w-md text-base font-light leading-relaxed text-[var(--muted-foreground)]">
          The link may be incomplete. If you placed an order, get in touch and we will find it.
        </p>
        <div className="mt-10">
          <CollectionLink />
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <MuseumHeading eyebrow={`Order ${order.orderNumber}`} title="It's yours." />

      <p className="mt-8 max-w-lg text-base font-light leading-relaxed text-[var(--muted-foreground)]">
        Nothing has been charged. We will contact you on the number you gave us to arrange payment and
        delivery, usually within a day.
      </p>

      {/* What actually happens next. No email is sent, so this does not promise one. */}
      <dl className="mt-16 grid gap-x-16 border-t border-[var(--border)] sm:grid-cols-2">
        <div className="border-b border-[var(--border)] py-6">
          <dt className="museum-label text-[var(--museum-gold-deep)]">Placed under</dt>
          <dd className="mt-3 text-sm font-light text-[var(--museum-alabaster)]">{order.email}</dd>
        </div>
        <div className="border-b border-[var(--border)] py-6">
          <dt className="museum-label text-[var(--museum-gold-deep)]">Any questions</dt>
          <dd className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm font-light">
            <a
              href={CONTACT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--museum-gold)] underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--museum-gold)]"
            >
              WhatsApp
            </a>
            <a
              href={`tel:${CONTACT_PHONE}`}
              className="text-[var(--museum-alabaster)] underline-offset-4 transition-colors hover:text-[var(--museum-gold)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--museum-gold)]"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
          </dd>
        </div>
      </dl>

      <div className="mt-20 grid gap-16 md:grid-cols-2 md:gap-24">
        <div>
          <p className="museum-label text-[var(--museum-gold)]">What you chose</p>
          <ul className="mt-8 space-y-4 border-b border-[var(--border)] pb-6">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-baseline justify-between gap-4">
                <span className="min-w-0 text-sm font-light text-[var(--museum-alabaster)]">
                  {item.name}
                  <span className="text-[var(--muted-foreground)]"> × {item.quantity}</span>
                </span>
                <span className="shrink-0 font-mono text-sm text-[var(--museum-alabaster)]">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-4">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="museum-label text-[var(--muted-foreground)]">Subtotal</dt>
              <dd className="font-mono text-sm text-[var(--museum-alabaster)]">${order.subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="museum-label text-[var(--muted-foreground)]">Delivery</dt>
              <dd className="font-mono text-sm text-[var(--museum-alabaster)]">${order.shipping.toFixed(2)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-[var(--border)] pt-5">
              <dt className="museum-label text-[var(--museum-alabaster)]">Total</dt>
              <dd className="museum-display text-2xl text-[var(--museum-gold)]">${order.total.toFixed(2)}</dd>
            </div>
          </dl>
        </div>

        <div>
          <p className="museum-label text-[var(--museum-gold)]">Where it goes</p>
          <div className="mt-8 space-y-2 text-sm font-light leading-relaxed text-[var(--muted-foreground)]">
            <p className="text-[var(--museum-alabaster)]">
              {order.firstName} {order.lastName}
            </p>
            <p>{order.address}</p>
            <p>{order.city}, Egypt</p>
          </div>
          <p className="museum-label mt-8 text-[var(--museum-gold-deep)]">Preferred time</p>
          <p className="mt-3 text-sm font-light text-[var(--museum-alabaster)]">
            {DELIVERY_PERIOD_LABELS[order.deliveryPeriod] || order.deliveryPeriod}
          </p>
        </div>
      </div>

      <div className="mt-20 flex flex-wrap items-center gap-10 border-t border-[var(--border)] pt-10">
        <CollectionLink label="Keep looking" />
        <Link
          href="/"
          className="museum-label text-[var(--muted-foreground)] transition-colors hover:text-[var(--museum-gold)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--museum-gold)]"
        >
          Back to home
        </Link>
      </div>
    </Shell>
  )
}
