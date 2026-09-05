/**
 * The shop's social accounts. Add or remove an entry here and every surface
 * that renders `<SocialLinks />` follows, along with the `sameAs` list in the
 * Organization structured data.
 */
export type SocialPlatform = "instagram" | "tiktok" | "facebook"

export type SocialLink = {
  platform: SocialPlatform
  label: string
  /** Shown next to the icon where the layout has room for it. */
  handle: string
  url: string
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "instagram",
    label: "Instagram",
    handle: "@sedra_souvenirs",
    url: "https://www.instagram.com/sedra_souvenirs/",
  },
  {
    platform: "tiktok",
    label: "TikTok",
    handle: "@sedra_souvenirs",
    url: "https://www.tiktok.com/@sedra_souvenirs",
  },
  {
    platform: "facebook",
    label: "Facebook",
    handle: "Sedra Souvenirs",
    url: "https://www.facebook.com/share/197Pgyf6vo/",
  },
]

export const SOCIAL_URLS = SOCIAL_LINKS.map((link) => link.url)
