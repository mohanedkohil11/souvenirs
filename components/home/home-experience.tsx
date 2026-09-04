"use client"

import { useEffect, useState } from "react"
import Lenis from "lenis"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ActOpen from "./act-open"
import ActManifesto from "./act-manifesto"
import ObjectVitrine from "./object-vitrine"
import ActMaking from "./act-making"
import { objectStories } from "@/content/home-copy"
import { HERITAGE_IMAGE, OBJECT_FALLBACK_IMAGE, type MuseumObject } from "./types"

const MUSEUM_GROUND = "oklch(0.145 0.018 205)"

/**
 * Smooth-scroll feel. `lerp` is how much of the remaining distance the page
 * covers each frame: higher is snappier, lower is floatier. Lenis defaults to
 * 0.1, which measured as ~960ms to settle a single wheel notch and read as
 * sluggish. Set SMOOTH_SCROLL to false to drop Lenis entirely and use the
 * browser's native scrolling.
 */
const SMOOTH_SCROLL = true
const SCROLL_FEEL = { lerp: 0.17, wheelMultiplier: 1.2, touchMultiplier: 1.6 }

/** Per-object copy: an explicit line wins, then the category, then the pool. */
function storyFor(object: MuseumObject, index: number) {
  return (
    objectStories.byId[object.id] ||
    objectStories.byCategory[object.categoryName.trim().toLowerCase()] ||
    objectStories.fallback[index % objectStories.fallback.length]
  )
}

export default function HomeExperience({ vitrineObjects }: { vitrineObjects: MuseumObject[] }) {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  // Smooth scrolling belongs to this page only; every other route keeps the
  // browser's native scroll.
  useEffect(() => {
    if (reduced || !SMOOTH_SCROLL) return
    const lenis = new Lenis(SCROLL_FEEL)
    let frame = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    })
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [reduced])

  // The tokens below only cover this subtree, so pin the document ground too —
  // otherwise overscroll rubber-banding flashes the site's light background.
  useEffect(() => {
    const root = document.documentElement
    const previous = root.style.backgroundColor
    root.style.backgroundColor = MUSEUM_GROUND
    return () => {
      root.style.backgroundColor = previous
    }
  }, [])

  const openingImage = vitrineObjects[0]?.image || HERITAGE_IMAGE
  const openingAlt = vitrineObjects[0]?.name || "A handmade Egyptian object"

  return (
    <div className="museum dark min-h-screen">
      <Header variant="overlay" />
      <main>
        <ActOpen image={openingImage || OBJECT_FALLBACK_IMAGE} alt={openingAlt} reduced={reduced} />
        <ActManifesto reduced={reduced} />
        {vitrineObjects.map((object, index) => (
          <ObjectVitrine
            key={object.id}
            object={object}
            index={index}
            total={vitrineObjects.length}
            story={storyFor(object, index)}
            align={index % 2 === 0 ? "left" : "right"}
            reduced={reduced}
            /* Six other pages link to /#collection; the first object carries it. */
            anchorId={index === 0 ? "collection" : undefined}
          />
        ))}
        <ActMaking reduced={reduced} />
      </main>
      <Footer />
    </div>
  )
}
