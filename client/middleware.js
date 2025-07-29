import { NextResponse } from "next/server"

// Define protected routes that require authentication
const protectedRoutes = [
  "/playground",
  "/compile",
  "/chat",
  "/community",
  "/myProfile",
  "/addChat",
  "/notifications",
  "/settings",
]

// Define public routes that should redirect authenticated users
const publicRoutes = ["/login", "/register"]

// Define admin routes that require special permissions
const adminRoutes = ["/admin"]

export function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value
  const userRole = request.cookies.get("userRole")?.value

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Check if the current path is an admin route
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  // Handle protected routes
  if (isProtectedRoute) {
    if (!token) {
      // Redirect to login with return URL
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("returnUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verify token format (basic validation)
    if (!isValidTokenFormat(token)) {
      // Clear invalid token and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("token")
      response.cookies.delete("userRole")
      return response
    }
  }

  // Handle admin routes
  if (isAdminRoute) {
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("returnUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (userRole !== "admin") {
      // Redirect non-admin users to home page
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Handle public routes (redirect authenticated users)
  if (isPublicRoute && token) {
    const returnUrl = request.nextUrl.searchParams.get("returnUrl")
    if (returnUrl && isValidReturnUrl(returnUrl)) {
      return NextResponse.redirect(new URL(returnUrl, request.url))
    }
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Add security headers
  const response = NextResponse.next()

  // Security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // Add user info to headers for API routes
  if (token && pathname.startsWith("/api/")) {
    response.headers.set("X-User-Token", token)
    if (userRole) {
      response.headers.set("X-User-Role", userRole)
    }
  }

  return response
}

// Helper function to validate token format
function isValidTokenFormat(token) {
  if (!token || typeof token !== "string") return false

  // Basic JWT format validation (header.payload.signature)
  const parts = token.split(".")
  if (parts.length !== 3) return false

  // Check if each part is base64 encoded
  try {
    parts.forEach((part) => {
      if (!part) throw new Error("Empty part")
      // Basic base64 validation
      atob(part.replace(/-/g, "+").replace(/_/g, "/"))
    })
    return true
  } catch {
    return false
  }
}

// Helper function to validate return URL
function isValidReturnUrl(url) {
  try {
    const returnUrl = new URL(url, "http://localhost")
    // Only allow relative URLs or same origin
    return (
      returnUrl.pathname.startsWith("/") &&
      !returnUrl.pathname.startsWith("//") &&
      !publicRoutes.includes(returnUrl.pathname)
    )
  } catch {
    return false
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
