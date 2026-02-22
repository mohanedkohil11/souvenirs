import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const { productId } = await request.json()

  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 })
  }

  await prisma.productView.create({
    data: { productId, deviceId: "anonymous" },
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const { productId } = await request.json()

  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 })
  }

  await prisma.productView.deleteMany({ where: { productId } })

  return NextResponse.json({ success: true })
}
