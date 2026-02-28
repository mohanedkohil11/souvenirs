import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await prisma.category.findUnique({ where: { id } })

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 })
  }

  return NextResponse.json(category)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description || null,
      image: body.image || null,
      featured: body.featured || [],
    },
  })

  return NextResponse.json(category)
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const productsCount = await prisma.product.count({ where: { categoryId: id } })
  if (productsCount > 0) {
    return NextResponse.json(
      { error: "Cannot delete category with existing products. Remove products first." },
      { status: 400 }
    )
  }

  await prisma.category.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
