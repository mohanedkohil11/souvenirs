import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-100 dark:text-slate-200 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SS</span>
              </div>
              <span className="font-bold text-lg">Souvenir Stories</span>
            </div>
            <p className="text-slate-300 dark:text-slate-400 text-sm">
              Authentic souvenirs from around the world, bringing memories home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-slate-300 dark:text-slate-400 hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-slate-300 dark:text-slate-400 hover:text-primary transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?sort=new"
                  className="text-slate-300 dark:text-slate-400 hover:text-primary transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-slate-300 dark:text-slate-400 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-300 dark:text-slate-400 hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-300 dark:text-slate-400 hover:text-primary transition-colors">
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
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:hello@souvenirstories.com"
                  className="text-slate-300 dark:text-slate-400 hover:text-primary transition-colors"
                >
                  hello@souvenirstories.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a
                  href="tel:+1234567890"
                  className="text-slate-300 dark:text-slate-400 hover:text-primary transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>123 Travel Lane, Adventure City, AC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400 dark:text-slate-500">
          <p>&copy; 2025 Souvenir Stories. All rights reserved.</p>
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
