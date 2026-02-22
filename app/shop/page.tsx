import { getProducts, getCategoryNames } from "@/lib/data"
import ShopClient from "@/components/shop-client"

export default async function ShopPage() {
  const [products, categoryNames] = await Promise.all([
    getProducts(),
    getCategoryNames(),
  ])

  const serializedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    rating: p.rating,
    reviews: p.reviews,
    image: p.image,
    category: { name: p.category.name },
  }))

  return <ShopClient products={serializedProducts} categoryNames={categoryNames} />
}
