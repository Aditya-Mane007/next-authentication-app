import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isToken = request.cookies.get("token")?.value || ""

  const isPublicPath =
    path === "/sign-in" ||
    path === "/sign-up" ||
    path === "/verifyemail" ||
    path === "/foregetPassword"

  if (isPublicPath && isToken) {
    return NextResponse.redirect(new URL("/profile", request.nextUrl))
  }

  if (!isPublicPath && !isToken) {
    return NextResponse.redirect(new URL("/sign-in", request.nextUrl))
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/sign-in", "/sign-up", "/profile/:path*", "/verifyemail"]
}
