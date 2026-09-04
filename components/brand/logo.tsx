"use client"

import Image from "next/image"
import { useState } from "react"

/**
 * Brand assets, generated from the artwork in `assets/` by the steps recorded
 * in docs/brand-assets.md:
 *
 *   public/brand/sedra-mark.png      167x320   — the Nefertiti mark
 *   public/brand/sedra-wordmark.png  1068x241  — the SEDRA wordmark
 *
 * Replace either file in place (svg is also accepted) and every usage follows.
 * The fallbacks below only appear if a file goes missing.
 */
const MARK_SOURCES = ["/brand/sedra-mark.png", "/brand/sedra-mark.svg"]
const WORDMARK_SOURCES = ["/brand/sedra-wordmark.png", "/brand/sedra-wordmark.svg"]

/** Native proportions of the supplied artwork, so neither is boxed or squashed. */
const MARK_RATIO = 167 / 320
const WORDMARK_RATIO = 1068 / 241

/**
 * The lotus and sun disc that sit at the foot of the Nefertiti mark: teal
 * petals under a gold outline. The bust itself carries too much line detail to
 * survive at header size, so the lotus stands in for it.
 */
function LotusMark({ size, className = "" }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <g
        fill="var(--brand-teal, #0F4C52)"
        stroke="var(--brand-gold, #C4913C)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      >
        {/* outer petals */}
        <path d="M29 51C20 49 11 43 5 32c11 3 20 11 24 19Z" />
        <path d="M35 51c9-2 18-8 24-19-11 3-20 11-24 19Z" />
        {/* inner petals */}
        <path d="M30 51c-8-6-15-17-17-30 9 8 16 19 17 30Z" />
        <path d="M34 51c8-6 15-17 17-30-9 8-16 19-17 30Z" />
        {/* centre petal */}
        <path d="M32 52c-8-8-10-22 0-42 10 20 8 34 0 42Z" />
      </g>
      <circle cx="32" cy="56" r="6" fill="var(--brand-gold, #C4913C)" />
    </svg>
  )
}

/** The Nefertiti mark. Decorative wherever it sits beside the name. */
export function BrandMark({
  size = 40,
  className = "",
  priority = false,
}: {
  size?: number
  className?: string
  priority?: boolean
}) {
  const [attempt, setAttempt] = useState(0)

  if (attempt >= MARK_SOURCES.length) return <LotusMark size={size} className={className} />

  return (
    <Image
      key={MARK_SOURCES[attempt]}
      src={MARK_SOURCES[attempt]}
      alt=""
      aria-hidden="true"
      width={Math.round(size * MARK_RATIO)}
      height={size}
      priority={priority}
      onError={() => setAttempt((current) => current + 1)}
      className={`shrink-0 object-contain ${className}`}
    />
  )
}

/** The SEDRA wordmark. Carries the accessible name, so it is never decorative. */
export function BrandWordmark({
  width = 150,
  height = Math.round(150 / WORDMARK_RATIO),
  className = "",
  priority = false,
  fallback,
}: {
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fallback: React.ReactNode
}) {
  const [attempt, setAttempt] = useState(0)

  if (attempt >= WORDMARK_SOURCES.length) return <>{fallback}</>

  return (
    <Image
      key={WORDMARK_SOURCES[attempt]}
      src={WORDMARK_SOURCES[attempt]}
      alt="Sedra"
      width={width}
      height={height}
      priority={priority}
      onError={() => setAttempt((current) => current + 1)}
      className={`object-contain ${className}`}
    />
  )
}
