"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "motion/react"
import { manifesto, manifestoLabel } from "@/content/home-copy"

function Word({
  word,
  progress,
  start,
  end,
  reduced,
}: {
  word: string
  progress: MotionValue<number>
  start: number
  end: number
  reduced: boolean
}) {
  const opacity = useTransform(progress, [start, end], [0.22, 1])
  return (
    <>
      <motion.span
        className="inline-block text-[var(--museum-alabaster)]"
        style={reduced ? { opacity: 1 } : { opacity }}
      >
        {word}
      </motion.span>{" "}
    </>
  )
}

export default function ActManifesto({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  const words = manifesto.split(" ")
  /** Words light across the first three quarters, leaving the sentence whole
      for a beat before the section releases. */
  const span = 0.72 / words.length

  return (
    <section ref={ref} className="relative h-[145vh] bg-[var(--museum-well)]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        <div className="mx-auto w-full max-w-5xl">
          <p className="museum-label mb-10 text-[var(--museum-gold-deep)]">{manifestoLabel}</p>
          <p className="museum-display text-[clamp(1.9rem,5.2vw,4.5rem)] leading-[1.15] text-[var(--muted-foreground)]">
            <span>
              {words.map((word, i) => (
                <Word
                  key={i}
                  word={word}
                  progress={scrollYProgress}
                  start={i * span}
                  end={i * span + span * 2.4}
                  reduced={reduced}
                />
              ))}
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
