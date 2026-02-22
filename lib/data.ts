import { prisma } from "@/lib/prisma"

export async function getProducts(filters?: {
  category?: string
  sort?: string
  isFeatured?: boolean
  isBestSeller?: boolean
  isFlashSale?: boolean
}) {
  const where: Record<string, unknown> = {}

  if (filters?.category && filters.category !== "All") {
    where.category = { name: filters.category }
  }
  if (filters?.isFeatured) where.isFeatured = true
  if (filters?.isBestSeller) where.isBestSeller = true
  if (filters?.isFlashSale) where.isFlashSale = true

  let orderBy: Record<string, string> = {}
  if (filters?.sort === "price-low") orderBy = { price: "asc" }
  else if (filters?.sort === "price-high") orderBy = { price: "desc" }
  else if (filters?.sort === "rating") orderBy = { rating: "desc" }
  else orderBy = { createdAt: "desc" }

  return prisma.product.findMany({
    where,
    orderBy,
    include: { category: true },
  })
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      specifications: true,
    },
  })
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  })
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
  })
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 3) {
  return prisma.product.findMany({
    where: {
      categoryId,
      id: { not: productId },
    },
    take: limit,
    include: { category: true },
  })
}

export async function getFeaturedProducts(limit = 4) {
  return prisma.product.findMany({
    where: { isFeatured: true },
    take: limit,
    include: { category: true },
  })
}

export async function getBestSellers(limit = 4) {
  return prisma.product.findMany({
    where: { isBestSeller: true },
    orderBy: { sales: "desc" },
    take: limit,
    include: { category: true },
  })
}

export async function getFlashSaleProducts(limit = 6) {
  return prisma.product.findMany({
    where: { isFlashSale: true },
    take: limit,
    include: { category: true },
  })
}

export async function getCategoryNames() {
  const categories = await prisma.category.findMany({
    select: { name: true },
    orderBy: { name: "asc" },
  })
  return ["All", ...categories.map((c) => c.name)]
}

export async function getProductCount() {
  return prisma.product.count()
}

export async function getCategoryCount() {
  return prisma.category.count()
}
