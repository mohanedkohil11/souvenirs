import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        _count: { select: { views: true } },
      },
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error("[GET /api/products]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const product = await prisma.product.create({
    data: {
      name: body.name,
      price: parseFloat(body.price),
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
      discount: body.discount ? parseInt(body.discount) : null,
      description: body.description || null,
      fullDescription: body.fullDescription || null,
      image: body.image || null,
      rating: parseFloat(body.rating) || 0,
      reviews: parseInt(body.reviews) || 0,
      inStock: body.inStock ?? true,
      quantity: parseInt(body.quantity) || 0,
      sales: parseInt(body.sales) || 0,
      isFeatured: body.isFeatured ?? false,
      isBestSeller: body.isBestSeller ?? false,
      isFlashSale: body.isFlashSale ?? false,
      categoryId: body.categoryId,
      specifications: {
        create: (body.specifications || []).map((spec: { label: string; value: string }) => ({
          label: spec.label,
          value: spec.value,
        })),
      },
    },
    include: { category: true, specifications: true },
  })

  return NextResponse.json(product, { status: 201 })
}
