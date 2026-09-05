import type { ComponentType } from "react"
import { Facebook, Instagram } from "lucide-react"
import { SOCIAL_LINKS, type SocialPlatform } from "@/lib/social"
import { cn } from "@/lib/utils"

/**
 * lucide ships Instagram and Facebook but no TikTok, so that one is drawn
 * here. It is filled rather than stroked, which is how the mark is meant to
 * read, and sized to sit level with its stroked neighbours.
 */
function TikTok({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .77-5.06V9.69a5.67 5.67 0 0 0-.77-.05A5.66 5.66 0 1 0 15.54 15.3V8.99a7.35 7.35 0 0 0 4.3 1.38V7.28a4.29 4.29 0 0 1-3.24-1.46Z" />
    </svg>
  )
}

const ICONS: Record<SocialPlatform, ComponentType<{ className?: string }>> = {
  instagram: ({ className }) => <Instagram className={className} />,
  facebook: ({ className }) => <Facebook className={className} />,
  tiktok: TikTok,
}

export function SocialIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  const Icon = ICONS[platform]
  return <Icon className={className} />
}

/**
 * The social row. `iconClassName` and `linkClassName` let each surface keep its
 * own palette — the footer sits on the deep teal, the contact page on the light
 * ground.
 */
export default function SocialLinks({
  className,
  linkClassName,
  iconClassName = "w-5 h-5",
}: {
  className?: string
  linkClassName?: string
  iconClassName?: string
}) {
  return (
    <ul className={cn("flex items-center gap-3", className)}>
      {SOCIAL_LINKS.map((link) => (
        <li key={link.platform}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer me"
            aria-label={`${link.label}, ${link.handle}`}
            title={link.label}
            className={cn(
              "inline-flex items-center justify-center rounded-full border transition-colors",
              linkClassName,
            )}
          >
            <SocialIcon platform={link.platform} className={iconClassName} />
          </a>
        </li>
      ))}
    </ul>
  )
}
