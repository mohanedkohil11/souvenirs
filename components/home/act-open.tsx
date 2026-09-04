"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"
import { openingCopy } from "@/content/home-copy"
import { BrandWordmark } from "@/components/brand/logo"

/**
 * Gold dust, generated from an integer LCG so the server and the client agree
 * exactly — floating-point trig does not survive hydration comparison. Values
 * are pre-formatted as CSS strings for the same reason. Pure CSS keyframes
 * once rendered; nothing runs per frame.
 */
const DUST = (() => {
  let seed = 20260904
  const next = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
  const round = (value: number, places = 3) => {
    const factor = 10 ** places
    return Math.round(value * factor) / factor
  }
  return Array.from({ length: 26 }, () => ({
    left: `${round(next() * 100)}%`,
    top: `${round(52 + next() * 48)}%`,
    size: `${round(1 + next() * 2.2)}px`,
    duration: `${round(12 + next() * 16)}s`,
    delay: `${round(-next() * 22)}s`,
    drift: `${round((next() - 0.5) * 90)}px`,
    opacity: `${round(0.16 + next() * 0.38)}`,
  }))
})()

export default function ActOpen({
  image,
  alt,
  reduced,
}: {
  image: string
  alt: string
  reduced: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const objectScale = useTransform(scrollYProgress, [0, 1], [1, 1.22])
  const objectY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const objectTilt = useTransform(scrollYProgress, [0, 1], [6, -4])
  const objectOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const wordTracking = useTransform(scrollYProgress, [0, 0.8], ["0.06em", "0.5em"])
  const wordOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const lightScale = useTransform(scrollYProgress, [0, 1], [1, 1.5])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])

  const letters = openingCopy.wordmark.split("")

  return (
    <section ref={ref} className="relative h-[130vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* The room: brand teal taken to near-black, lit from above and behind. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 18%, oklch(0.215 0.022 204) 0%, oklch(0.145 0.016 205) 55%, oklch(0.1 0.014 205) 100%)",
          }}
        />

        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {DUST.map((mote, i) => (
            <span
              key={i}
              className="museum-dust absolute rounded-full bg-[var(--museum-gold)]"
              style={
                {
                  left: mote.left,
                  top: mote.top,
                  width: mote.size,
                  height: mote.size,
                  "--dust-duration": mote.duration,
                  "--dust-delay": mote.delay,
                  "--dust-drift": mote.drift,
                  "--dust-opacity": mote.opacity,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <div className="museum-stage relative z-10 flex h-full flex-col items-center justify-center px-6 pb-10 pt-20">
          {/* The object, standing in its pool of light. */}
          <div className="museum-plane relative flex min-h-0 flex-1 items-center justify-center py-4">
            <motion.div
              className="relative aspect-square h-full max-h-[400px] w-auto min-w-[200px]"
              style={
                reduced
                  ? { scale: 1, y: 0, rotateX: 0, opacity: 1 }
                  : {
                      scale: objectScale,
                      y: objectY,
                      rotateX: objectTilt,
                      opacity: objectOpacity,
                    }
              }
              initial={reduced ? false : { opacity: 0, y: 40, filter: "blur(16px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={image}
                alt={alt}
                fill
                priority
                sizes="(max-width: 640px) 70vw, 400px"
                className="museum-feather object-cover"
              />
            </motion.div>

            <motion.div
              aria-hidden="true"
              className="museum-vitrine-light pointer-events-none absolute bottom-0 left-1/2 h-[7vh] w-[70vw] max-w-[520px] -translate-x-1/2 rounded-[50%]"
              style={reduced ? { scaleX: 1 } : { scaleX: lightScale }}
            />
          </div>

          <div className="relative z-20 w-full shrink-0 text-center">
            <motion.h1
              className="museum-display text-[clamp(3rem,15vw,11rem)] text-[var(--museum-gold)]"
              style={reduced ? { opacity: 1 } : { opacity: wordOpacity }}
            >
              {/* The real wordmark once it is dropped into public/brand/.
                  Until then, the letters below animate in one at a time. */}
              <BrandWordmark
                width={1068}
                height={241}
                priority
                className="mx-auto h-auto w-[min(74vw,660px)]"
                fallback={
                  <motion.span
                    aria-label={openingCopy.wordmark}
                    className="inline-block"
                    style={reduced ? { letterSpacing: "0.06em" } : { letterSpacing: wordTracking }}
                  >
                    {letters.map((letter, i) => (
                      <motion.span
                        key={i}
                        aria-hidden="true"
                        className="inline-block"
                        initial={reduced ? false : { opacity: 0, y: "0.35em" }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1, delay: 0.25 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </motion.span>
                }
              />
            </motion.h1>

            <motion.p
              className="mt-5 text-balance text-sm font-light tracking-wide text-[var(--muted-foreground)] sm:text-base"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              {openingCopy.line}
            </motion.p>

            <motion.p
              className="museum-label mt-8 text-[var(--muted-foreground)]"
              style={reduced ? { opacity: 1 } : { opacity: cueOpacity }}
            >
              {openingCopy.scrollCue}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}
