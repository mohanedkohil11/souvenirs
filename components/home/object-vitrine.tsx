"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react"
import { accessionNumber } from "@/content/home-copy"
import { OBJECT_FALLBACK_IMAGE, type MuseumObject } from "./types"

/**
 * One object, staged for the length of a full viewport.
 *
 * The numbering is not decoration: a museum catalogue is numbered, so each
 * object carries an accession number and a classification the way a wall label
 * would.
 */
export default function ObjectVitrine({
  object,
  index,
  total,
  story,
  align,
  reduced,
  anchorId,
}: {
  object: MuseumObject
  index: number
  total: number
  story: string
  align: "left" | "right"
  reduced: boolean
  anchorId?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Scroll choreography.
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [140, 0, 0, -110])
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3, 1], [0.86, 1, 1.08])
  const blurAmount = useTransform(scrollYProgress, [0, 0.22, 0.8, 1], [18, 0, 0, 14])
  const filter = useTransform(blurAmount, (v) => `blur(${v}px)`)
  const facing = align === "left" ? 1 : -1
  const scrollRotateY = useTransform(scrollYProgress, [0, 1], [-16 * facing, 12 * facing])
  const spineOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0])
  const lightScale = useTransform(scrollYProgress, [0.2, 0.6], [0.7, 1])

  // Cursor influence, damped so it reads as weight rather than jitter.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 90, damping: 22, mass: 0.6 })
  const springY = useSpring(pointerY, { stiffness: 90, damping: 22, mass: 0.6 })

  const rotateY = useTransform([scrollRotateY, springX], ([a, b]) => (a as number) + (b as number))
  const rotateX = springY

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

  const textReveal = reduced
    ? { initial: false as const, animate: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 26 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-25% 0px -25% 0px" },
      }

  return (
    <section id={anchorId} ref={ref} className="relative h-[120vh]">
      <div
        className="sticky top-0 flex h-screen items-center overflow-hidden"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
        <motion.div
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 flex-col items-center gap-5 lg:flex ${
            align === "left" ? "right-10" : "left-10"
          }`}
          style={reduced ? { opacity: 1 } : { opacity: spineOpacity }}
        >
          <span className="h-20 w-px bg-[var(--museum-gold)]/25" />
          <span className="museum-label [writing-mode:vertical-rl] text-[var(--museum-gold)]/70">
            {accessionNumber(index)} / {accessionNumber(total - 1)}
          </span>
          <span className="h-20 w-px bg-[var(--museum-gold)]/25" />
        </motion.div>

        <div className="museum-stage relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:gap-16">
          <motion.div
            className={`museum-plane relative ${align === "right" ? "md:order-2" : ""}`}
            style={
              reduced
                ? { y: 0, opacity: 1, scale: 1, filter: "none", rotateY: 0, rotateX: 0 }
                : { y, opacity, scale, filter, rotateY, rotateX }
            }
          >
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[400px]">
              <Image
                src={object.image || OBJECT_FALLBACK_IMAGE}
                alt={object.name}
                fill
                sizes="(max-width: 768px) 80vw, 440px"
                className="museum-feather object-cover"
              />
            </div>
            <motion.div
              aria-hidden="true"
              className="museum-vitrine-light pointer-events-none absolute bottom-2 left-1/2 h-[5vh] w-[58%] -translate-x-1/2 rounded-[50%] opacity-70"
              style={reduced ? { scaleX: 1 } : { scaleX: lightScale }}
            />
          </motion.div>

          <motion.div className={align === "right" ? "md:order-1" : ""} {...textReveal}>
            <p className="museum-label text-[var(--museum-gold)]">
              Acc. {accessionNumber(index)} · {object.categoryName}
            </p>
            <h2 className="museum-display mt-6 text-[clamp(2.4rem,6vw,4.75rem)] text-[var(--museum-alabaster)]">
              {object.name}
            </h2>
            <p className="mt-6 max-w-md text-pretty text-base font-light leading-relaxed text-[var(--muted-foreground)]">
              {story}
            </p>
            <Link
              href={`/product/${object.id}`}
              className="group mt-10 inline-flex items-center gap-3 border-b border-[var(--museum-gold)]/35 pb-2 text-sm tracking-wide text-[var(--museum-gold)] transition-colors hover:border-[var(--museum-gold)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--museum-gold)]"
            >
              View object
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
