export const dynamic = "force-dynamic"

import HomeExperience from "@/components/home/home-experience"
import type { MuseumObject } from "@/components/home/types"
import { getProducts } from "@/lib/data"

export default async function Home() {
  const products = await getProducts()

  const toObject = (product: (typeof products)[number]): MuseumObject => ({
    id: product.id,
    name: product.name,
    image: product.image,
    categoryName: product.category.name,
  })

  // Every product gets its own staged act, featured ones first so the
  // catalogue opens on its strongest pieces.
  const vitrineObjects = [
    ...products.filter((product) => product.isFeatured),
    ...products.filter((product) => !product.isFeatured),
  ].map(toObject)

  return <HomeExperience vitrineObjects={vitrineObjects} />
}
