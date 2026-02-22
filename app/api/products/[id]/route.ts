import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, specifications: true },
  })

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json(product)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  // Delete existing specifications and recreate
  await prisma.productSpecification.deleteMany({ where: { productId: id } })

  const product = await prisma.product.update({
    where: { id },
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

  return NextResponse.json(product)
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
