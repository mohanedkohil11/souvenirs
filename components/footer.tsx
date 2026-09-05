import Link from "next/link"
import { BrandMark, BrandWordmark } from "@/components/brand/logo"
import { Phone, MessageCircle } from "lucide-react"
import { CONTACT_PHONE, CONTACT_PHONE_DISPLAY, CONTACT_WHATSAPP_URL } from "@/lib/contact"
import SocialLinks from "@/components/social-links"

export default function Footer() {
  return (
    <footer className="bg-[var(--brand-teal-deep)] text-[oklch(0.95_0.008_85)] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <BrandMark size={58} />
              <BrandWordmark
                width={112}
                height={25}
                fallback={
                  <span className="font-display text-xl font-medium tracking-[0.14em] text-[var(--brand-gold)]">
                    SEDRA
                  </span>
                }
              />
            </div>
            <p className="text-[oklch(0.82_0.012_90)] text-sm">
              Authentic souvenirs from around the world, bringing memories home.
            </p>
            <SocialLinks
              className="mt-6"
              linkClassName="h-10 w-10 border-[oklch(0.4_0.04_206)] text-[oklch(0.82_0.012_90)] hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)]"
            />
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-[oklch(0.82_0.012_90)] hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[oklch(0.82_0.012_90)] hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[oklch(0.82_0.012_90)] hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="text-[oklch(0.82_0.012_90)] hover:text-primary transition-colors"
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <a
                  href={CONTACT_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[oklch(0.82_0.012_90)] hover:text-primary transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[oklch(0.4_0.04_206)] pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[oklch(0.75_0.012_90)]">
          <p>&copy; 2025 Sedra. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
