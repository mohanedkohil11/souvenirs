"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"
import { makingCopy } from "@/content/home-copy"
import { MAKING_IMAGE } from "./types"

export default function ActMaking({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // The image is uncovered rather than faded in: a wipe from a narrow slot.
  const clipPath = useTransform(scrollYProgress, [0.05, 0.55], [24, 0], { clamp: true })
  const clip = useTransform(clipPath, (v) => `inset(${v}% ${v * 0.9}% ${v}% ${v * 0.9}%)`)
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"])

  return (
    <section ref={ref} className="relative overflow-hidden bg-[var(--museum-well)] py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <p className="museum-label text-[var(--museum-gold)]">{makingCopy.label}</p>
        <h2 className="museum-display mt-8 max-w-3xl text-[clamp(2.4rem,7vw,5.5rem)] text-[var(--museum-alabaster)]">
          {makingCopy.heading}
        </h2>
      </div>

      <motion.div
        className="relative mx-auto mt-16 h-[46vh] w-full max-w-[1400px] overflow-hidden md:h-[70vh]"
        style={reduced ? { clipPath: "none" } : { clipPath: clip }}
      >
        <motion.div className="absolute inset-[-8%]" style={reduced ? { y: 0 } : { y: imageY }}>
          <Image
            src={MAKING_IMAGE}
            alt="An Egyptian market stall stacked with handmade goods"
            fill
            sizes="100vw"
            className="object-cover brightness-[0.62] saturate-[0.85] contrast-[1.05]"
          />
        </motion.div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.115 0.015 205 / 0.85), oklch(0.115 0.015 205 / 0.35) 45%, oklch(0.115 0.015 205 / 0.92))",
          }}
        />
      </motion.div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-8 px-6 md:grid-cols-2 md:gap-16">
        {makingCopy.paragraphs.map((paragraph, i) => (
          <motion.p
            key={i}
            className="text-pretty text-base font-light leading-relaxed text-[var(--muted-foreground)]"
            {...(reduced
              ? { initial: false as const, animate: { opacity: 1, y: 0 } }
              : {
                  initial: { opacity: 0, y: 22 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-20% 0px" },
                  transition: { duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
                })}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </section>
  )
}
