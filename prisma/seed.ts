import "dotenv/config"
import { Pool } from "pg"
import { PrismaClient } from "../lib/generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  // Clear existing data
  await prisma.productSpecification.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // Create categories
  const pharaonic = await prisma.category.create({
    data: {
      name: "Pharaonic Artifacts",
      description: "Ancient Egyptian-inspired pieces featuring pharaohs, hieroglyphics, and timeless designs",
      image: "/egyptian-pyramids-cairo.jpg",
      featured: ["Pharaoh Mug", "Papyrus Art", "Scarab Amulet"],
    },
  })

  const cairoCrafts = await prisma.category.create({
    data: {
      name: "Cairo Crafts",
      description: "Handmade treasures from Cairo's bustling markets and local artisans",
      image: "/cairo-pyramid-keychain.jpg",
      featured: ["Cairo Keychain", "Brass Lantern", "Leather Goods"],
    },
  })

  const nileTextiles = await prisma.category.create({
    data: {
      name: "Nile Valley Textiles",
      description: "Beautiful fabrics, scarves, and woven goods inspired by the Nile Valley",
      image: "/traditional-silk-scarf-pattern.jpg",
      featured: ["Silk Scarf", "Cotton Tapestry", "Embroidered Cloth"],
    },
  })

  const spiceFragrance = await prisma.category.create({
    data: {
      name: "Spice & Fragrance",
      description: "Authentic Egyptian spices, perfumes, and aromatic treasures",
      image: "/egyptian-spice-market.jpg",
      featured: ["Oud Perfume", "Spice Mix", "Incense Set"],
    },
  })

  const jewelry = await prisma.category.create({
    data: {
      name: "Jewelry & Accessories",
      description: "Elegant Egyptian-inspired jewelry, amulets, and decorative pieces",
      image: "/egyptian-jewelry-collection.jpg",
      featured: ["Gold Scarab", "Ankh Necklace", "Cartouche Bracelet"],
    },
  })

  const homeDecor = await prisma.category.create({
    data: {
      name: "Home Décor",
      description: "Beautiful home accessories and décor inspired by Egyptian heritage",
      image: "/egyptian-home-decor.jpg",
      featured: ["Papyrus Wall Art", "Ceramic Vase", "Decorative Mirror"],
    },
  })

  console.log("Categories created.")

  // Create products
  const pharaohMug = await prisma.product.create({
    data: {
      name: "Pharaoh Mug",
      price: 24.99,
      originalPrice: 49.99,
      discount: 50,
      description: "Handcrafted ceramic mug featuring authentic Egyptian pharaoh design",
      fullDescription:
        "This exquisite ceramic mug brings the majesty of ancient Egypt to your daily coffee ritual. Handcrafted by skilled artisans in Cairo, each mug features an authentic pharaoh design inspired by historical artifacts. The premium ceramic material ensures durability and heat retention, making it perfect for both hot and cold beverages.",
      image: "/egyptian-pharaoh-ceramic-mug.jpg",
      rating: 4.8,
      reviews: 124,
      inStock: true,
      quantity: 15,
      sales: 850,
      isFeatured: true,
      isBestSeller: false,
      isFlashSale: true,
      categoryId: pharaonic.id,
      specifications: {
        create: [
          { label: "Material", value: "Premium Ceramic" },
          { label: "Capacity", value: "350ml" },
          { label: "Height", value: "10cm" },
          { label: "Handmade", value: "Yes" },
          { label: "Dishwasher Safe", value: "Yes" },
        ],
      },
    },
  })

  const cairoKeychain = await prisma.product.create({
    data: {
      name: "Cairo Keychain",
      price: 12.99,
      originalPrice: 14.99,
      discount: 50,
      description: "Miniature pyramid keychain with Cairo skyline details",
      fullDescription:
        "A perfect pocket-sized souvenir featuring a miniature pyramid with intricate Cairo skyline details. This lightweight keychain is crafted from durable metal alloy and makes an ideal gift for any travel enthusiast.",
      image: "/cairo-pyramid-keychain.jpg",
      rating: 4.9,
      reviews: 89,
      inStock: true,
      quantity: 42,
      sales: 1200,
      isFeatured: true,
      isBestSeller: false,
      isFlashSale: true,
      categoryId: cairoCrafts.id,
      specifications: {
        create: [
          { label: "Material", value: "Metal Alloy" },
          { label: "Size", value: "5cm" },
          { label: "Weight", value: "25g" },
          { label: "Keyring Included", value: "Yes" },
        ],
      },
    },
  })

  const silkScarf = await prisma.product.create({
    data: {
      name: "Silk Scarf",
      price: 34.99,
      originalPrice: 59.99,
      discount: 50,
      description: "Premium silk scarf with traditional Egyptian patterns",
      fullDescription:
        "Elevate your style with this luxurious silk scarf featuring traditional Asian patterns. Hand-dyed using natural pigments and woven by master craftspeople, this scarf is both a fashion statement and a cultural treasure.",
      image: "/traditional-silk-scarf-pattern.jpg",
      rating: 4.7,
      reviews: 156,
      inStock: true,
      quantity: 8,
      sales: 600,
      isFeatured: true,
      isBestSeller: false,
      isFlashSale: true,
      categoryId: nileTextiles.id,
      specifications: {
        create: [
          { label: "Material", value: "100% Silk" },
          { label: "Size", value: "90cm x 90cm" },
          { label: "Weight", value: "80g" },
          { label: "Hand-dyed", value: "Yes" },
          { label: "Care", value: "Dry Clean Only" },
        ],
      },
    },
  })

  const oudPerfume = await prisma.product.create({
    data: {
      name: "Oud Perfume",
      price: 45.99,
      description: "Authentic Egyptian oud perfume with traditional scent",
      fullDescription:
        "Experience the timeless fragrance of authentic Egyptian oud. This premium perfume is distilled from the finest agarwood, following centuries-old techniques passed down through generations of Egyptian perfumers.",
      image: "/egyptian-oud-perfume.jpg",
      rating: 4.9,
      reviews: 67,
      inStock: true,
      quantity: 20,
      sales: 450,
      isFeatured: true,
      isBestSeller: false,
      isFlashSale: false,
      categoryId: spiceFragrance.id,
      specifications: {
        create: [
          { label: "Volume", value: "50ml" },
          { label: "Type", value: "Eau de Parfum" },
          { label: "Scent Family", value: "Woody Oriental" },
          { label: "Longevity", value: "8-12 hours" },
        ],
      },
    },
  })

  const goldScarab = await prisma.product.create({
    data: {
      name: "Gold Scarab Brooch",
      price: 89.99,
      originalPrice: 69.99,
      description: "Exquisite gold-plated scarab brooch with intricate detailing",
      fullDescription:
        "This stunning gold-plated scarab brooch features intricate detailing inspired by ancient Egyptian jewelry. A timeless piece that adds elegance to any outfit.",
      image: "/egyptian-gold-scarab.jpg",
      rating: 5.0,
      reviews: 42,
      inStock: true,
      quantity: 10,
      sales: 2500,
      isFeatured: false,
      isBestSeller: true,
      isFlashSale: true,
      categoryId: jewelry.id,
      specifications: {
        create: [
          { label: "Material", value: "Gold-plated brass" },
          { label: "Size", value: "4cm x 3cm" },
          { label: "Weight", value: "15g" },
          { label: "Closure", value: "Pin clasp" },
        ],
      },
    },
  })

  const papyrusArt = await prisma.product.create({
    data: {
      name: "Papyrus Wall Art",
      price: 55.99,
      originalPrice: 39.99,
      description: "Authentic hand-painted papyrus artwork with hieroglyphic designs",
      fullDescription:
        "Bring the artistry of ancient Egypt into your home with this authentic hand-painted papyrus artwork. Each piece is meticulously created on genuine papyrus using traditional techniques.",
      image: "/egyptian-papyrus-art.jpg",
      rating: 4.8,
      reviews: 78,
      inStock: true,
      quantity: 12,
      sales: 1800,
      isFeatured: false,
      isBestSeller: true,
      isFlashSale: true,
      categoryId: homeDecor.id,
      specifications: {
        create: [
          { label: "Material", value: "Genuine Papyrus" },
          { label: "Size", value: "30cm x 40cm" },
          { label: "Frame", value: "Not included" },
          { label: "Hand-painted", value: "Yes" },
        ],
      },
    },
  })

  const ankhNecklace = await prisma.product.create({
    data: {
      name: "Ankh Necklace",
      price: 39.99,
      description: "Sterling silver Ankh pendant necklace with chain",
      fullDescription:
        "A beautiful sterling silver Ankh pendant symbolizing eternal life. This elegant necklace comes with a delicate chain and makes a meaningful gift.",
      image: "/egyptian-ankh-necklace.jpg",
      rating: 4.6,
      reviews: 95,
      inStock: true,
      quantity: 25,
      sales: 2100,
      isFeatured: false,
      isBestSeller: true,
      isFlashSale: false,
      categoryId: jewelry.id,
      specifications: {
        create: [
          { label: "Material", value: "Sterling Silver" },
          { label: "Chain Length", value: "45cm" },
          { label: "Pendant Size", value: "2.5cm" },
          { label: "Weight", value: "8g" },
        ],
      },
    },
  })

  const spiceMix = await prisma.product.create({
    data: {
      name: "Egyptian Spice Mix",
      price: 49.99,
      originalPrice: 24.99,
      discount: 50,
      description: "Authentic blend of Egyptian spices for cooking",
      fullDescription:
        "A carefully curated blend of authentic Egyptian spices, perfect for adding exotic flavors to your cooking. Sourced directly from Egypt's famous spice markets.",
      image: "/egyptian-spice-mix.jpg",
      rating: 4.7,
      reviews: 112,
      inStock: true,
      quantity: 50,
      sales: 3200,
      isFeatured: false,
      isBestSeller: true,
      isFlashSale: true,
      categoryId: spiceFragrance.id,
      specifications: {
        create: [
          { label: "Weight", value: "200g" },
          { label: "Ingredients", value: "Cumin, Coriander, Cardamom, and more" },
          { label: "Shelf Life", value: "12 months" },
          { label: "Origin", value: "Egypt" },
        ],
      },
    },
  })

  console.log("Products created.")
  console.log("Seed complete!")
  console.log(`  Categories: 6`)
  console.log(`  Products: 8`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
