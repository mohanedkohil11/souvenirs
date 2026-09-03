import "dotenv/config"
import { Pool } from "pg"
import { PrismaClient } from "../lib/generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"
import { normalizeRating } from "../lib/utils.js"

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

  const products = await prisma.product.findMany({ select: { id: true, name: true, rating: true } })

  for (const product of products) {
    const rating = normalizeRating(product.rating)
    if (rating !== product.rating) {
      await prisma.product.update({
        where: { id: product.id },
        data: { rating },
      })
      console.log(`${product.name}: ${product.rating} -> ${rating}`)
    }
  }

  await prisma.$disconnect()
  await pool.end()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
