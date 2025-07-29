import { NextResponse } from "next/server"
import { verifyToken, rateLimit, combineMiddlewares } from "@/utils/apiMiddleware"

// POST /api/auth/logout - User logout
export const POST = combineMiddlewares(
  rateLimit({ maxRequests: 10, windowMs: 15 * 60 * 1000 }),
  verifyToken,
)(async (req) => {
  try {
    const userId = req.user.id

    // In a real application, you might want to:
    // 1. Add the token to a blacklist
    // 2. Log the logout event
    // 3. Clear any active sessions

    // Log successful logout
    console.log(`User ${userId} logged out at ${new Date().toISOString()}`)

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    })

    // Clear the HTTP-only cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        code: "SERVER_ERROR",
      },
      { status: 500 },
    )
  }
})
