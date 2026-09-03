import "dotenv/config"
import { readFileSync } from "fs"
import { join } from "path"
import { Pool } from "pg"
import { PrismaClient } from "../lib/generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"
import { createClient } from "@supabase/supabase-js"

const file = process.argv[2] ?? "nile-valley-woven-rug.jpg"
const slug = file.replace(/\.jpg$/, "")

async function main() {
  const buffer = readFileSync(join(process.cwd(), "public", "products", file))
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase.storage.from("images").upload(`products/${file}`, buffer, {
    contentType: "image/jpeg",
    upsert: true,
  })
  if (error) throw error

  const imageUrl = `${supabase.storage.from("images").getPublicUrl(`products/${file}`).data.publicUrl}?v=${Date.now()}`

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })
  const updated = await prisma.product.updateMany({
    where: { image: { contains: slug } },
    data: { image: imageUrl },
  })

  console.log(`Updated ${updated.count} product: ${imageUrl}`)
  await prisma.$disconnect()
  await pool.end()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
