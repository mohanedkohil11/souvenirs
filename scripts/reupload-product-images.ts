import "dotenv/config"
import { readdirSync, readFileSync } from "fs"
import { join } from "path"
import { Pool } from "pg"
import { PrismaClient } from "../lib/generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"
import { createClient } from "@supabase/supabase-js"

const PRODUCTS_DIR = join(process.cwd(), "public", "products")
const BUCKET = "images"
const CACHE_VERSION = Date.now().toString()

async function main() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

  const files = readdirSync(PRODUCTS_DIR).filter((file) => file.endsWith(".jpg"))
  console.log(`Re-uploading ${files.length} processed images...\n`)

  for (const file of files) {
    const buffer = readFileSync(join(PRODUCTS_DIR, file))
    const storagePath = `products/${file}`
    const slug = file.replace(/\.jpg$/, "")

    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
      contentType: "image/jpeg",
      upsert: true,
    })

    if (error) {
      throw new Error(`Failed to upload ${file}: ${error.message}`)
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
    const imageUrl = `${data.publicUrl}?v=${CACHE_VERSION}`

    const updated = await prisma.product.updateMany({
      where: { image: { contains: slug } },
      data: { image: imageUrl },
    })

    console.log(`  ${file} (${updated.count} product${updated.count === 1 ? "" : "s"})`)
  }

  console.log("\nUpload complete.")
  await prisma.$disconnect()
  await pool.end()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
