export type MuseumObject = {
  id: string
  name: string
  image: string | null
  /** Category label, shown as the object's accession classification. */
  categoryName: string
}

/** Every object image falls back to this — `image` is nullable in the schema. */
export const OBJECT_FALLBACK_IMAGE = "/placeholder.svg"

/** Stands in for the opening object when the catalogue is empty. */
export const HERITAGE_IMAGE =
  "https://pjxkbmcvaajjyyggotof.supabase.co/storage/v1/object/public/images/egyptian-traditional-crafts.jpg"

export const MAKING_IMAGE =
  "https://pjxkbmcvaajjyyggotof.supabase.co/storage/v1/object/public/images/egyptian-spice-market.jpg"
