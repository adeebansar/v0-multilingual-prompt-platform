import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const auth = request.headers.get("authorization")
  const username = "aDy" // 🔒 Change this
  const password = "Dbz@040791" // 🔒 Change this

  const validAuth = "Basic " + Buffer.from(`${username}:${password}`).toString("base64")

  if (auth === validAuth) {
    return NextResponse.next()
  }

  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  })
}

// Add a matcher configuration to specify which routes the middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (static image files)
     * - public (public assets)
     * - api routes (API endpoints)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|public|api).*)",
  ],
}
