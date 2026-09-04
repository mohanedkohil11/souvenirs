"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import MuseumShell, { MuseumHeading } from "@/components/museum-shell"
import { useCart } from "@/lib/cart-context"
import { shippingFor } from "@/lib/pricing"
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

/** Hairline underline fields, to match the page rather than a boxed form. */
const FIELD =
  "w-full border-b border-[var(--border)] bg-transparent py-3 text-[var(--museum-alabaster)] outline-none transition-colors placeholder:text-[var(--muted-foreground)]/50 focus:border-[var(--museum-gold)]"

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="museum-label text-[var(--muted-foreground)]">{label}</span>
      <div className="mt-3">{children}</div>
    </label>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, totalItems, clearCart } = useCart()
  const shipping = shippingFor(totalItems)
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
      <MuseumShell>
        <section className="px-6 pb-32 pt-32 md:pt-40">
          <div className="mx-auto max-w-6xl">
            <MuseumHeading eyebrow="Checkout" title="Nothing selected yet" />
            <p className="mt-8 max-w-md text-base font-light leading-relaxed text-[var(--muted-foreground)]">
              Choose something before checking out.
            </p>
            <Link
              href="/#collection"
              className="museum-label mt-10 inline-flex items-center gap-3 border-b border-[var(--museum-gold)]/40 pb-2 text-[var(--museum-gold)] transition-colors hover:border-[var(--museum-gold)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--museum-gold)]"
            >
              Enter the collection
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </MuseumShell>
    )
  }

  return (
    <MuseumShell>
      <section className="px-6 pb-32 pt-32 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <MuseumHeading eyebrow="Checkout" title="Where it should go" />

          <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_320px] lg:gap-24">
            <form onSubmit={handleSubmit} className="space-y-14">
              <fieldset className="border-t border-[var(--border)] pt-10">
                <legend className="sr-only">Contact information</legend>
                <p className="museum-label mb-10 text-[var(--museum-gold)]">Who you are</p>
                <div className="grid gap-10 md:grid-cols-2">
                  <Field label="First name">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      autoComplete="given-name"
                      placeholder="Ahmed"
                      className={FIELD}
                    />
                  </Field>
                  <Field label="Last name">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      autoComplete="family-name"
                      placeholder="Mohamed"
                      className={FIELD}
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      placeholder="ahmed@example.com"
                      className={FIELD}
                    />
                  </Field>
                  <Field label="Phone">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      autoComplete="tel"
                      placeholder="+20 100 000 0000"
                      className={FIELD}
                    />
                  </Field>
                </div>
              </fieldset>

              <fieldset className="border-t border-[var(--border)] pt-10">
                <legend className="sr-only">Delivery details</legend>
                <p className="museum-label mb-10 text-[var(--museum-gold)]">Where to bring it</p>
                <div className="grid gap-10">
                  <Field label="Address">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      autoComplete="street-address"
                      placeholder="123 El Nasr Street, Downtown"
                      className={FIELD}
                    />
                  </Field>
                  <div className="grid gap-10 md:grid-cols-2">
                    <Field label="City">
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        autoComplete="address-level2"
                        className={FIELD}
                      >
                        {EGYPT_CITIES.map((city) => (
                          <option key={city} value={city} className="bg-[var(--museum-plinth)]">
                            {city}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Preferred delivery time">
                      <select
                        name="deliveryPeriod"
                        value={formData.deliveryPeriod}
                        onChange={handleChange}
                        required
                        className={FIELD}
                      >
                        {DELIVERY_PERIODS.map((period) => (
                          <option key={period.value} value={period.value} className="bg-[var(--museum-plinth)]">
                            {period.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>
              </fieldset>

              <div className="border-t border-[var(--border)] pt-10">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="museum-label w-full bg-[var(--museum-gold)] px-8 py-4 text-[var(--museum-ground)] transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--museum-gold)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isLoading ? "Placing order" : "Place order"}
                </button>
                <p className="mt-6 text-center text-sm font-light text-[var(--muted-foreground)]">
                  No payment now. We contact you to arrange payment once the order is confirmed.
                </p>
              </div>
            </form>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="museum-label text-[var(--museum-gold)]">Summary</p>

              <ul className="mt-8 space-y-4 border-b border-[var(--border)] pb-6">
                {items.map((item) => (
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
                  <dd className="font-mono text-sm text-[var(--museum-alabaster)]">${subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="museum-label text-[var(--muted-foreground)]">Delivery</dt>
                  <dd className="font-mono text-sm text-[var(--museum-alabaster)]">${shipping.toFixed(2)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-[var(--border)] pt-5">
                  <dt className="museum-label text-[var(--museum-alabaster)]">Total</dt>
                  <dd className="museum-display text-2xl text-[var(--museum-gold)]">${total.toFixed(2)}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>
    </MuseumShell>
  )
}
