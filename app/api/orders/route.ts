import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  })
  return NextResponse.json(orders)
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const orderNumber = `SS-${Date.now().toString(36).toUpperCase()}`

  const subtotal = (body.items as { price: number; quantity: number }[]).reduce(
    (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
    0
  )
  const shipping = 10
  const total = subtotal + shipping

  const order = await prisma.order.create({
    data: {
      orderNumber,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
      deliveryPeriod: body.deliveryPeriod,
      subtotal,
      shipping,
      tax: 0,
      total,
      items: {
        create: body.items.map((item: { productId: string; name: string; price: number; quantity: number; image: string | null }) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      },
    },
    include: { items: true },
  })

  return NextResponse.json(order, { status: 201 })
}
