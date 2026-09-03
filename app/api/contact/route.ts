import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isAdminAuthenticated } from "@/lib/auth"

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(messages)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const name = body.name?.trim()
    const email = body.email?.trim()
    const subject = body.subject?.trim()
    const message = body.message?.trim()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const contactMessage = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    })

    return NextResponse.json(contactMessage, { status: 201 })
  } catch (error) {
    console.error("[POST /api/contact]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send message" },
      { status: 500 }
    )
  }
}
