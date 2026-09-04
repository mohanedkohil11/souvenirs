"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2, Minus, Plus } from "lucide-react"
import MuseumShell, { MuseumHeading } from "@/components/museum-shell"
import { useCart } from "@/lib/cart-context"
import { shippingFor } from "@/lib/pricing"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart()
  const shipping = shippingFor(totalItems)
  const total = subtotal + shipping

  return (
    <MuseumShell>
      <section className="px-6 pb-32 pt-32 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <MuseumHeading eyebrow="Your selection" title={items.length > 0 ? "The cart" : "Nothing selected yet"} />

          {items.length === 0 ? (
            <div className="mt-14 max-w-md">
              <p className="text-base font-light leading-relaxed text-[var(--muted-foreground)]">
                Objects you choose are held here until you are ready.
              </p>
              <Link
                href="/#collection"
                className="museum-label mt-10 inline-flex items-center gap-3 border-b border-[var(--museum-gold)]/40 pb-2 text-[var(--museum-gold)] transition-colors hover:border-[var(--museum-gold)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--museum-gold)]"
              >
                Enter the collection
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : (
            <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_320px] lg:gap-24">
              <ul className="border-t border-[var(--border)]">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-6 border-b border-[var(--border)] py-8">
                    <Link
                      href={`/product/${item.id}`}
                      className="relative aspect-square w-24 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--museum-gold)] md:w-28"
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        sizes="112px"
                        className="museum-feather-wide object-contain"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <Link
                            href={`/product/${item.id}`}
                            className="museum-display block text-xl text-[var(--museum-alabaster)] transition-colors hover:text-[var(--museum-gold)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--museum-gold)] md:text-2xl"
                          >
                            {item.name}
                          </Link>
                          <p className="museum-label mt-2 text-[var(--muted-foreground)]">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="shrink-0 p-2 text-[var(--muted-foreground)] transition-colors hover:text-[var(--destructive)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--museum-gold)]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center border border-[var(--border)]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="px-3 py-2 text-[var(--muted-foreground)] transition-colors hover:text-[var(--museum-gold)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--museum-gold)]"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-[2.5rem] px-1 text-center font-mono text-sm text-[var(--museum-alabaster)]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="px-3 py-2 text-[var(--muted-foreground)] transition-colors hover:text-[var(--museum-gold)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--museum-gold)]"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="museum-display text-xl text-[var(--museum-gold)]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <aside className="lg:sticky lg:top-28 lg:self-start">
                <p className="museum-label text-[var(--museum-gold)]">Summary</p>

                <dl className="mt-8 space-y-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="museum-label text-[var(--muted-foreground)]">
                      Subtotal · {totalItems} {totalItems === 1 ? "item" : "items"}
                    </dt>
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

                <Link
                  href="/checkout"
                  className="museum-label mt-10 block bg-[var(--museum-gold)] px-8 py-4 text-center text-[var(--museum-ground)] transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--museum-gold)]"
                >
                  Checkout
                </Link>

                <Link
                  href="/#collection"
                  className="museum-label mt-6 block text-center text-[var(--muted-foreground)] transition-colors hover:text-[var(--museum-gold)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--museum-gold)]"
                >
                  Keep looking
                </Link>
              </aside>
            </div>
          )}
        </div>
      </section>
    </MuseumShell>
  )
}
