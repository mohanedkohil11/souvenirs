import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/login")) {
    const token = request.cookies.get("admin_token")

    if (!token) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
