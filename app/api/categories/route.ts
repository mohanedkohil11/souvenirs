import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error("[GET /api/categories]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const category = await prisma.category.create({
    data: {
      name: body.name,
      description: body.description || null,
      image: body.image || null,
      featured: body.featured || [],
    },
  })

  return NextResponse.json(category, { status: 201 })
}
