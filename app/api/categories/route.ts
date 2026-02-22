import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  })
  return NextResponse.json(categories)
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const category = await prisma.category.create({
    data: {
      name: body.name,
      description: body.description || null,
      image: body.image || null,
      productCount: body.productCount || 0,
      featured: body.featured || [],
    },
  })

  return NextResponse.json(category, { status: 201 })
}
