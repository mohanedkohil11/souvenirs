import "dotenv/config"
import { readFileSync, readdirSync, statSync } from "fs"
import { join, extname } from "path"
import { Pool } from "pg"
import { PrismaClient } from "../lib/generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"
import { createClient } from "@supabase/supabase-js"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BUCKET = "images"
const PUBLIC_DIR = join(process.cwd(), "public")

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"])

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
}

async function uploadFile(filename: string): Promise<string | null> {
  const filepath = join(PUBLIC_DIR, filename)
  const ext = extname(filename).toLowerCase()

  if (!IMAGE_EXTENSIONS.has(ext)) return null

  try {
    const fileBuffer = readFileSync(filepath)
    const contentType = MIME_TYPES[ext] || "application/octet-stream"

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filename, fileBuffer, {
        contentType,
        upsert: true,
      })

    if (error) {
      console.error(`  Failed to upload ${filename}:`, error.message)
      return null
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename)
    return data.publicUrl
  } catch (err: any) {
    console.error(`  Error reading/uploading ${filename}:`, err.message)
    return null
  }
}

async function main() {
  console.log("=== Image Migration to Supabase Storage ===\n")

  // Step 1: Upload all image files from public/
  const files = readdirSync(PUBLIC_DIR).filter((f) => {
    const ext = extname(f).toLowerCase()
    return IMAGE_EXTENSIONS.has(ext) && statSync(join(PUBLIC_DIR, f)).isFile()
  })

  console.log(`Found ${files.length} image files in public/\n`)

  const urlMap = new Map<string, string>()

  for (const file of files) {
    process.stdout.write(`  Uploading ${file}...`)
    const url = await uploadFile(file)
    if (url) {
      urlMap.set(`/${file}`, url)
      console.log(` done`)
    } else {
      console.log(` FAILED`)
    }
  }

  console.log(`\nUploaded ${urlMap.size}/${files.length} files\n`)

  // Step 2: Update Category images
  const categories = await prisma.category.findMany()
  let categoryUpdates = 0
  for (const cat of categories) {
    if (cat.image && urlMap.has(cat.image)) {
      await prisma.category.update({
        where: { id: cat.id },
        data: { image: urlMap.get(cat.image) },
      })
      categoryUpdates++
      console.log(`  Category "${cat.name}": ${cat.image} -> Supabase URL`)
    }
  }
  console.log(`Updated ${categoryUpdates} categories\n`)

  // Step 3: Update Product images
  const products = await prisma.product.findMany()
  let productUpdates = 0
  for (const prod of products) {
    if (prod.image && urlMap.has(prod.image)) {
      await prisma.product.update({
        where: { id: prod.id },
        data: { image: urlMap.get(prod.image) },
      })
      productUpdates++
      console.log(`  Product "${prod.name}": ${prod.image} -> Supabase URL`)
    }
  }
  console.log(`Updated ${productUpdates} products\n`)

  // Step 4: Update OrderItem images
  const orderItems = await prisma.orderItem.findMany()
  let orderItemUpdates = 0
  for (const item of orderItems) {
    if (item.image && urlMap.has(item.image)) {
      await prisma.orderItem.update({
        where: { id: item.id },
        data: { image: urlMap.get(item.image) },
      })
      orderItemUpdates++
      console.log(`  OrderItem "${item.name}": ${item.image} -> Supabase URL`)
    }
  }
  console.log(`Updated ${orderItemUpdates} order items\n`)

  console.log("=== Migration Complete ===")
  console.log(`  Files uploaded: ${urlMap.size}`)
  console.log(`  Categories updated: ${categoryUpdates}`)
  console.log(`  Products updated: ${productUpdates}`)
  console.log(`  Order items updated: ${orderItemUpdates}`)
}

main()
  .catch((e) => {
    console.error("Migration failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
