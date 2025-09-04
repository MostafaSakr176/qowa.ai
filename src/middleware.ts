import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default function middleware(req: NextRequest) {
  const url = req.nextUrl

  // redirect / → /en
  if (url.pathname === "/") {
    return NextResponse.redirect(new URL("/en", req.url))
  }

  return NextResponse.next()
}

// ✅ Apply withAuth only on /dashboard
export const config = {
  matcher: ["/", "/dashboard/:path*"],
}

export const auth = withAuth(
  function middleware(req: NextRequest) {
    return NextResponse.next()
  },
  {
    pages: {
      signIn: "/auth/login",
    },
  }
)
