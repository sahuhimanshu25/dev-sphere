import { NextResponse } from "next/server"
import { verifyToken, rateLimit, combineMiddlewares } from "@/utils/apiMiddleware"

// GET /api/auth/verify - Verify JWT token
export const GET = combineMiddlewares(
  rateLimit({ maxRequests: 60, windowMs: 15 * 60 * 1000 }),
  verifyToken,
)(async (req) => {
  try {
    const user = req.user

    // Mock user data fetch - replace with actual database query
    const userData = {
      id: user.id,
      name: "John Doe",
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: true,
      emailVerified: true,
      createdAt: "2023-01-15T00:00:00.000Z",
    }

    return NextResponse.json({
      success: true,
      data: {
        user: userData,
        isAuthenticated: true,
      },
    })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Invalid or expired token",
        code: "INVALID_TOKEN",
        isAuthenticated: false,
      },
      { status: 401 },
    )
  }
})
