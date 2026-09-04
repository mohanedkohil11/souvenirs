"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import MuseumShell from "@/components/museum-shell"
import { Star, Share2, ArrowLeft } from "lucide-react"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import { useCart } from "@/lib/cart-context"
import { formatRating } from "@/lib/utils"
import { toast } from "sonner"

type ProductDetail = {
  id: string
  name: string
  price: number
  rating: number
  reviews: number
  image: string | null
  fullDescription: string | null
  inStock: boolean
  quantity: number
  categoryName: string
}

export default function ProductDetailClient({ product }: { product: ProductDetail }) {
  const router = useRouter()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  // The object tilts to the cursor, damped, exactly as it does on the home page.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateY = useSpring(pointerX, { stiffness: 90, damping: 22, mass: 0.6 })
  const rotateX = useSpring(pointerY, { stiffness: 90, damping: 22, mass: 0.6 })

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== "mouse") return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 14)
    pointerY.set((0.5 - (event.clientY - bounds.top) / bounds.height) * 10)
  }

  function resetPointer() {
    pointerX.set(0)
    pointerY.set(0)
  }

  const viewLogged = useRef(false)
  useEffect(() => {
    if (viewLogged.current) return
    viewLogged.current = true

    const VIEWED_KEY = "sedra-viewed"
    try {
      const viewed: string[] = JSON.parse(localStorage.getItem(VIEWED_KEY) || "[]")
      if (viewed.includes(product.id)) return
      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      })
        .then(() => {
          viewed.push(product.id)
          localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed))
        })
        .catch(() => {})
    } catch {
      // localStorage unavailable
    }
  }, [product.id])

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image }, quantity)
    setAddedToCart(true)
    toast.success(`${product.name} added to cart`)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleShare = async () => {
    const url = window.location.href
    const shareData = { title: product.name, text: `Check out ${product.name} on Sedra`, url }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard")
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      toast.error("Could not share this product")
    }
  }

  const reveal = reduced
    ? { initial: false as const, animate: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 26 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
      }

  return (
    <MuseumShell>
      <section className="relative overflow-hidden px-6 pb-24 pt-32 md:pt-40">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(110% 70% at 50% 0%, oklch(0.215 0.022 204) 0%, oklch(0.145 0.016 205) 60%, oklch(0.115 0.014 205) 100%)",
            }}
          />

          <div className="relative mx-auto max-w-6xl">
            <motion.button
              onClick={() => router.back()}
              className="museum-label group mb-14 inline-flex items-center gap-3 text-[var(--muted-foreground)] transition-colors hover:text-[var(--museum-gold)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--museum-gold)]"
              {...reveal}
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              Back
            </motion.button>

            <div
              className="museum-stage grid items-center gap-14 md:grid-cols-2 md:gap-20"
              onPointerMove={handlePointerMove}
              onPointerLeave={resetPointer}
            >
              {/* The object, lit in its vitrine. */}
              <motion.div
                className="museum-plane relative"
                {...(reduced
                  ? { initial: false as const, animate: { opacity: 1 } }
                  : {
                      initial: { opacity: 0, y: 40, filter: "blur(14px)" },
                      animate: { opacity: 1, y: 0, filter: "blur(0px)" },
                      transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] as const },
                    })}
                style={reduced ? { rotateY: 0, rotateX: 0 } : { rotateY, rotateX }}
              >
                {/* Square box and object-contain: the product photos are square,
                    so cover was cropping them and the buyer lost the edges. */}
                <div className="relative mx-auto aspect-square w-full max-w-[480px]">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 85vw, 480px"
                    className="museum-feather-wide object-contain"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="museum-vitrine-light pointer-events-none absolute bottom-2 left-1/2 h-[5vh] w-[58%] -translate-x-1/2 rounded-[50%] opacity-70"
                />
              </motion.div>

              {/* The wall label, and the part that sells it. */}
              <motion.div {...reveal} transition={{ ...(reveal.transition ?? {}), delay: 0.15 }}>
                <p className="museum-label text-[var(--museum-gold)]">{product.categoryName}</p>

                <h1 className="museum-display mt-6 text-[clamp(2.4rem,6vw,4.5rem)] text-[var(--museum-alabaster)]">
                  {product.name}
                </h1>

                {product.reviews > 0 && (
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex items-center gap-1" aria-hidden="true">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-[var(--museum-gold)] text-[var(--museum-gold)]"
                              : "text-[var(--border)]"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-[var(--muted-foreground)]">
                      {formatRating(product.rating)} · {product.reviews} reviews
                    </span>
                  </div>
                )}

                {product.fullDescription && (
                  <p className="mt-8 max-w-md text-pretty text-base font-light leading-relaxed text-[var(--muted-foreground)]">
                    {product.fullDescription}
                  </p>
                )}

                <div className="mt-10 flex items-baseline gap-4">
                  <span className="museum-display text-[clamp(2rem,4vw,3rem)] text-[var(--museum-gold)]">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="museum-label text-[var(--muted-foreground)]">
                    {product.inStock ? `${product.quantity} available` : "Not available"}
                  </span>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <div className="flex items-center border border-[var(--border)]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-5 py-3 text-[var(--muted-foreground)] transition-colors hover:text-[var(--museum-gold)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--museum-gold)]"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-[3rem] px-2 py-3 text-center font-mono text-sm text-[var(--museum-alabaster)]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-5 py-3 text-[var(--muted-foreground)] transition-colors hover:text-[var(--museum-gold)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--museum-gold)]"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="museum-label flex-1 bg-[var(--museum-gold)] px-10 py-4 text-[var(--museum-ground)] transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--museum-gold)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {addedToCart ? "Added" : product.inStock ? "Add to cart" : "Sold out"}
                  </button>

                  <button
                    onClick={handleShare}
                    aria-label="Share this object"
                    className="border border-[var(--border)] p-4 text-[var(--muted-foreground)] transition-colors hover:border-[var(--museum-gold)] hover:text-[var(--museum-gold)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--museum-gold)]"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
      </section>
    </MuseumShell>
  )
}
