import "dotenv/config"
import { copyFileSync, existsSync, mkdirSync } from "fs"
import { join } from "path"
import { Pool } from "pg"
import { PrismaClient } from "../lib/generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"
import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"

const ASSETS_DIR = join(process.cwd(), "assets")

const PRODUCTS = [
  {
    file: "c__Users_mohak_AppData_Roaming_Cursor_User_workspaceStorage_8ee823321e7dc004114458f628b64bb0_images_5-897323b6-ca27-49fd-9c6e-818abaa66cfb.jpg",
    slug: "egyptian-vanity-mirror-comb-set",
    name: "Egyptian Vanity Mirror & Comb Set",
    category: "Pharaonic Artifacts",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    description:
      "Ornate hand mirror and winged scarab hair comb with gold-tone metal, enamel inlays, and gemstone accents.",
    fullDescription:
      "Bring ancient Egyptian elegance to your vanity with this matching mirror and comb set. Each piece features a Nefertiti-inspired portrait, winged scarab motifs, hieroglyphic detailing, and rich blue, turquoise, and carnelian enamel work. A luxurious gift inspired by museum-quality Egyptian revival design.",
    isFeatured: true,
    isBestSeller: true,
    specifications: [
      { label: "Material", value: "Gold-tone metal with enamel inlay" },
      { label: "Pieces", value: "Hand mirror + decorative comb" },
      { label: "Style", value: "Egyptian Revival" },
      { label: "Handmade", value: "Yes" },
    ],
  },
  {
    file: "c__Users_mohak_AppData_Roaming_Cursor_User_workspaceStorage_8ee823321e7dc004114458f628b64bb0_images_7-ab2d0252-ca5b-42d5-a7a1-fe1c4782eca6.jpg",
    slug: "tutankhamun-mask-papyrus-art",
    name: "Tutankhamun Mask Papyrus Art",
    category: "Home Décor",
    price: 55.99,
    description:
      "Hand-painted golden burial mask of King Tut on authentic-style papyrus with hieroglyphic background.",
    fullDescription:
      "This striking papyrus artwork captures the iconic golden funerary mask of Tutankhamun in brilliant gold and lapis blue tones. Framed by hieroglyphic columns on textured papyrus, it makes a bold statement piece for any wall.",
    isFeatured: true,
    specifications: [
      { label: "Medium", value: "Papyrus" },
      { label: "Subject", value: "King Tutankhamun" },
      { label: "Style", value: "Hand-painted replica" },
    ],
  },
  {
    file: "c__Users_mohak_AppData_Roaming_Cursor_User_workspaceStorage_8ee823321e7dc004114458f628b64bb0_images_8-97b8309f-67b6-47a6-bbe0-06d7629fc180.jpg",
    slug: "ornate-egyptian-ankh",
    name: "Ornate Egyptian Ankh",
    category: "Pharaonic Artifacts",
    price: 64.99,
    description:
      "Large decorative Ankh of Life with winged scarab, Eye of Horus, and hieroglyphic engravings.",
    fullDescription:
      "A centerpiece Ankh symbol crafted in antiqued gold with colorful stone inlays, a winged scarab at the center, Eye of Horus detailing, and dense hieroglyphic patterns. Perfect as display art or a meaningful keepsake.",
    isFeatured: true,
    specifications: [
      { label: "Symbol", value: "Ankh (Symbol of Life)" },
      { label: "Finish", value: "Antiqued gold" },
      { label: "Inlays", value: "Turquoise, lapis, carnelian" },
    ],
  },
  {
    file: "c__Users_mohak_AppData_Roaming_Cursor_User_workspaceStorage_8ee823321e7dc004114458f628b64bb0_images_3-bc5cdd27-a57e-45b7-a59d-7f5f14fbe6d4.jpg",
    slug: "eye-of-horus-phone-charm",
    name: "Eye of Horus Phone Charm",
    category: "Jewelry & Accessories",
    price: 18.99,
    description:
      "Gold-tone Eye of Horus dust plug charm with turquoise stone for smartphone charging ports.",
    fullDescription:
      "Protect your phone in style with this miniature Wedjat eye charm. Finished in polished gold with blue enamel and a turquoise center stone, it plugs into your charging port and doubles as a lucky amulet.",
    isFlashSale: true,
    specifications: [
      { label: "Type", value: "Phone dust plug charm" },
      { label: "Material", value: "Gold-tone alloy" },
      { label: "Stone", value: "Turquoise accent" },
    ],
  },
  {
    file: "c__Users_mohak_AppData_Roaming_Cursor_User_workspaceStorage_8ee823321e7dc004114458f628b64bb0_images_4-8a02d8bc-f16b-471a-aeff-1ab597538fbb.jpg",
    slug: "egyptian-apple-watch-charm-set",
    name: "Egyptian Apple Watch Charm Set",
    category: "Jewelry & Accessories",
    price: 34.99,
    description:
      "Sliding charm collection for watch bands featuring scarabs, ankh, Eye of Horus, and hieroglyphs.",
    fullDescription:
      "Customize your Apple Watch band with this curated set of Egyptian charms. Includes winged scarab slides, ankh and Eye of Horus rings, gemstone bar accents, hieroglyphic bands, and decorative pins.",
    isFeatured: true,
    specifications: [
      { label: "Compatibility", value: "Apple Watch sport bands" },
      { label: "Pieces", value: "8 charms" },
      { label: "Finish", value: "Gold-tone" },
    ],
  },
  {
    file: "c__Users_mohak_AppData_Roaming_Cursor_User_workspaceStorage_8ee823321e7dc004114458f628b64bb0_images_9-99b424c3-f12c-44a1-862a-c5d95ccc2422.jpg",
    slug: "pharaoh-scarf",
    name: "Pharaoh Scarf",
    category: "Nile Valley Textiles",
    price: 39.99,
    originalPrice: 59.99,
    discount: 33,
    description:
      "Woven scarf with twin pharaoh portraits, hieroglyphs, winged scarab, and navy fringe.",
    fullDescription:
      "Wrap yourself in royal Egyptian style. This richly patterned scarf features mirrored pharaoh profiles, hieroglyphic borders, a winged scarab motif, and long navy fringe on soft woven fabric.",
    isFeatured: true,
    isFlashSale: true,
    specifications: [
      { label: "Material", value: "Woven textile blend" },
      { label: "Pattern", value: "Pharaoh & hieroglyphic" },
      { label: "Finish", value: "Fringed ends" },
    ],
  },
  {
    file: "c__Users_mohak_AppData_Roaming_Cursor_User_workspaceStorage_8ee823321e7dc004114458f628b64bb0_images_6-d89bb1c1-d053-44b7-a287-27b8447dea30.jpg",
    slug: "nefertiti-profile-papyrus-art",
    name: "Nefertiti Profile Papyrus Art",
    category: "Home Décor",
    price: 49.99,
    description:
      "Sepia-toned Nefertiti bust profile on textured papyrus with hieroglyphic background.",
    fullDescription:
      "An elegant side-profile portrait of Queen Nefertiti rendered on authentic-style papyrus. Detailed crown, broad collar, and surrounding hieroglyphs create a timeless museum-quality wall piece.",
    isBestSeller: true,
    specifications: [
      { label: "Medium", value: "Papyrus" },
      { label: "Subject", value: "Queen Nefertiti" },
      { label: "Tone", value: "Sepia & gold" },
    ],
  },
  {
    file: "c__Users_mohak_AppData_Roaming_Cursor_User_workspaceStorage_8ee823321e7dc004114458f628b64bb0_images_10-5fe9792b-d4f6-44b9-a3ca-fccfa1d86023.jpg",
    slug: "pyramid-trinket-box-set",
    name: "Pyramid Trinket Box Set",
    category: "Cairo Crafts",
    price: 89.99,
    description:
      "Set of three pyramid keepsake boxes in bronze, gold, and silver with deity reliefs.",
    fullDescription:
      "Store treasures in style with this trio of pyramid trinket boxes. Each metal-finish pyramid features a different deity relief — Anubis, an Egyptian queen, and Bastet — surrounded by hieroglyphic etchings and gemstone accents.",
    isFeatured: true,
    isBestSeller: true,
    specifications: [
      { label: "Pieces", value: "3 pyramid boxes" },
      { label: "Finishes", value: "Bronze, gold, silver" },
      { label: "Motifs", value: "Anubis, Queen, Bastet" },
    ],
  },
  {
    file: "c__Users_mohak_AppData_Roaming_Cursor_User_workspaceStorage_8ee823321e7dc004114458f628b64bb0_images_2-dadef991-2f2c-4d95-978a-0540071972d2.jpg",
    slug: "winged-scarab-jewelry-set",
    name: "Winged Scarab Jewelry Set",
    category: "Jewelry & Accessories",
    price: 119.99,
    originalPrice: 149.99,
    discount: 20,
    description:
      "Statement collar necklace, winged scarab cuff, and beaded bangles with lapis and turquoise.",
    fullDescription:
      "A complete Egyptian jewelry collection featuring a wide scarab collar necklace, matching winged scarab cuff bracelet, and stacked beaded bangles with Eye of Horus accents. Rich gold tones with lapis, turquoise, and carnelian stones.",
    isFeatured: true,
    isBestSeller: true,
    specifications: [
      { label: "Pieces", value: "Necklace, cuff, 3 bangles" },
      { label: "Stones", value: "Lapis, turquoise, carnelian" },
      { label: "Finish", value: "Gold-tone" },
    ],
  },
  {
    file: "c__Users_mohak_AppData_Roaming_Cursor_User_workspaceStorage_8ee823321e7dc004114458f628b64bb0_images_1-7214099b-1b96-4abe-a14d-4160dc1c72c8.jpg",
    slug: "pharaoh-hieroglyph-bookmark",
    name: "Pharaoh Hieroglyph Bookmark",
    category: "Cairo Crafts",
    price: 24.99,
    description:
      "Gold-tone metal bookmark with pharaoh relief, hieroglyphs, and winged scarab tassel.",
    fullDescription:
      "Mark your place with this ornate Egyptian bookmark featuring a Tutankhamun-style pharaoh portrait, embossed hieroglyph columns, winged scarab motifs, and a beaded blue tassel with scarab charm.",
    specifications: [
      { label: "Material", value: "Gold-tone metal" },
      { label: "Includes", value: "Beaded tassel charm" },
      { label: "Style", value: "Hieroglyphic" },
    ],
  },
  {
    file: "c__Users_mohak_AppData_Roaming_Cursor_User_workspaceStorage_8ee823321e7dc004114458f628b64bb0_images_11-3c51cde1-ad7b-4beb-a2c9-c0fee23431c8.jpg",
    slug: "nile-valley-woven-rug",
    name: "Nile Valley Woven Rug",
    category: "Nile Valley Textiles",
    price: 149.99,
    description:
      "Handwoven multicolor rag rug with vibrant stripes and cream fringe.",
    fullDescription:
      "Add warmth and color to any room with this richly woven rug in bold stripes of magenta, teal, gold, and navy. Finished with cream woven borders and long twisted fringe — a true Nile Valley textile treasure.",
    isBestSeller: true,
    specifications: [
      { label: "Weave", value: "Handwoven rag rug" },
      { label: "Colors", value: "Multicolor stripe" },
      { label: "Finish", value: "Fringed edges" },
    ],
  },
] as const

function resolveAssetPath(filename: string): string {
  const path = join(ASSETS_DIR, filename)
  if (!existsSync(path)) throw new Error(`Asset not found: ${path}`)
  return path
}

async function uploadImage(
  supabase: ReturnType<typeof createClient>,
  localPath: string,
  storageName: string
): Promise<string> {
  const buffer = readFileSync(localPath)
  const { error } = await supabase.storage.from("images").upload(storageName, buffer, {
    contentType: "image/jpeg",
    upsert: true,
  })
  if (error) throw new Error(`Upload failed for ${storageName}: ${error.message}`)
  const { data } = supabase.storage.from("images").getPublicUrl(storageName)
  return data.publicUrl
}

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const publicProductsDir = join(process.cwd(), "public", "products")
  mkdirSync(publicProductsDir, { recursive: true })

  console.log("=== Seeding store products ===\n")

  const categories = await prisma.category.findMany()
  const categoryByName = new Map(categories.map((c) => [c.name, c.id]))

  // Clear existing catalog data
  await prisma.productView.deleteMany()
  await prisma.productSpecification.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.product.deleteMany()
  console.log("Cleared existing products\n")

  for (const product of PRODUCTS) {
    const assetPath = resolveAssetPath(product.file)
    const filename = `${product.slug}.jpg`
    const publicPath = join(publicProductsDir, filename)
    copyFileSync(assetPath, publicPath)

    process.stdout.write(`Uploading ${product.name}...`)
    const imageUrl = await uploadImage(supabase, publicPath, `products/${filename}`)
    console.log(" done")

    const categoryId = categoryByName.get(product.category)
    if (!categoryId) {
      throw new Error(`Category not found: ${product.category}`)
    }

    await prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        originalPrice: "originalPrice" in product ? product.originalPrice : null,
        discount: "discount" in product ? product.discount : null,
        description: product.description,
        fullDescription: product.fullDescription,
        image: imageUrl,
        rating: Math.round((4.7 + Math.random() * 0.3) * 10) / 10,
        reviews: Math.floor(40 + Math.random() * 120),
        inStock: true,
        quantity: 20,
        sales: Math.floor(100 + Math.random() * 500),
        isFeatured: "isFeatured" in product ? product.isFeatured : false,
        isBestSeller: "isBestSeller" in product ? product.isBestSeller : false,
        isFlashSale: "isFlashSale" in product ? product.isFlashSale : false,
        categoryId,
        specifications: {
          create: [...product.specifications],
        },
      },
    })
    console.log(`  Created: ${product.name}`)
  }

  const count = await prisma.product.count()
  console.log(`\n=== Done: ${count} products in store ===`)

  await prisma.$disconnect()
  await pool.end()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
