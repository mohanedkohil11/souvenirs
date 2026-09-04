"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X, ShoppingBag, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useCart } from "@/lib/cart-context"
import { BrandMark, BrandWordmark } from "@/components/brand/logo"

/**
 * `solid` is the site header. `overlay` is the home page's: it sits over the
 * opening act with no background, then condenses into a slim bar once you
 * scroll past it.
 */
type HeaderVariant = "solid" | "overlay"

export default function Header({ variant = "solid" }: { variant?: HeaderVariant }) {
  const [isOpen, setIsOpen] = useState(false)
  const [condensed, setCondensed] = useState(false)
  const { isDark, toggleTheme, mounted } = useTheme()
  const { totalItems } = useCart()

  const overlay = variant === "overlay"

  useEffect(() => {
    if (!overlay) return
    const onScroll = () => setCondensed(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [overlay])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  const shell = overlay
    ? `fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,border-color,padding] duration-500 ${
        condensed
          ? "border-b border-[var(--border)] bg-[var(--museum-ground)]/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`
    : "sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"

  const inner = overlay
    ? `max-w-7xl mx-auto px-6 flex items-center justify-between transition-[padding] duration-500 ${
        condensed ? "py-3" : "py-6"
      }`
    : "max-w-7xl mx-auto px-4 py-4 flex items-center justify-between"

  return (
    <header className={shell}>
      <div className={inner}>
        <Link href="/" className="flex items-center gap-3" aria-label="Sedra, home">
          <BrandMark size={overlay ? 46 : 52} priority />
          <BrandWordmark
            width={overlay ? 98 : 110}
            height={overlay ? 22 : 25}
            className={overlay ? "" : "hidden sm:block"}
            priority
            fallback={
              <span
                className={
                  overlay
                    ? "museum-label text-base tracking-[0.42em] text-[var(--museum-gold)]"
                    : "hidden font-display text-2xl font-medium tracking-[0.14em] text-[var(--brand-gold-deep)] sm:inline"
                }
              >
                SEDRA
              </span>
            }
          />
        </Link>

        <nav className={overlay ? "hidden md:flex items-center gap-10" : "hidden md:flex items-center gap-8"}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                overlay
                  ? "text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--museum-gold)]"
                  : "text-sm font-medium hover:text-primary transition-colors"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* The home page is always the museum palette, so the toggle would do
              nothing there. It stays on every other page. */}
          {!overlay && mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          )}

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav
          className={
            overlay
              ? "md:hidden border-t border-[var(--border)] bg-[var(--museum-ground)]/95 backdrop-blur-md"
              : "md:hidden border-t border-border bg-background"
          }
        >
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  overlay
                    ? "block py-2 text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--museum-gold)]"
                    : "block text-sm font-medium hover:text-primary transition-colors py-2"
                }
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
