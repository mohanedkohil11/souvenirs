"use client"

import { useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"

/** The museum ground, matching the home page's `.museum` token. */
const MUSEUM_GROUND = "oklch(0.145 0.018 205)"

/**
 * The dark museum page frame: overlay header, footer, and the document ground
 * pinned while mounted.
 *
 * That last part matters — the `.museum` class only re-scopes tokens for its
 * own subtree, so without pinning `<html>` the browser paints the site's light
 * background behind overscroll and the page flashes white at the edges. It is
 * reverted on unmount so every other route keeps its own theme.
 */
export default function MuseumShell({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  useEffect(() => {
    const root = document.documentElement
    const previous = root.style.backgroundColor
    root.style.backgroundColor = MUSEUM_GROUND
    return () => {
      root.style.backgroundColor = previous
    }
  }, [])

  return (
    <div className="museum dark min-h-screen">
      <Header variant="overlay" />
      <main className={`relative ${className}`}>{children}</main>
      <Footer />
    </div>
  )
}

/** Shared page heading: mono eyebrow over an oversized serif title. */
export function MuseumHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="museum-label text-[var(--museum-gold)]">{eyebrow}</p>
      <h1 className="museum-display mt-6 text-[clamp(2.4rem,6vw,4.5rem)] text-[var(--museum-alabaster)]">
        {title}
      </h1>
    </div>
  )
}
