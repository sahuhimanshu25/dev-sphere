import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { rateLimit, cors, combineMiddlewares } from "@/utils/apiMiddleware"

// POST /api/auth/login - User login
export const POST = combineMiddlewares(
  cors(),
  rateLimit({ maxRequests: 5, windowMs: 15 * 60 * 1000 }),
)(async (req) => {
  try {
    const { email, password, rememberMe } = await req.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required",
          code: "MISSING_CREDENTIALS",
        },
        { status: 400 },
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
          code: "INVALID_EMAIL",
        },
        { status: 400 },
      )
    }

    // Mock user lookup - replace with actual database query
    const mockUsers = [
      {
        id: 1,
        email: "john@example.com",
        password: await bcrypt.hash("password123", 10),
        name: "John Doe",
        username: "johndoe",
        role: "user",
        isActive: true,
        emailVerified: true,
        createdAt: "2023-01-15T00:00:00.000Z",
      },
      {
        id: 2,
        email: "admin@example.com",
        password: await bcrypt.hash("admin123", 10),
        name: "Admin User",
        username: "admin",
        role: "admin",
        isActive: true,
        emailVerified: true,
        createdAt: "2023-01-01T00:00:00.000Z",
      },
    ]

    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
          code: "INVALID_CREDENTIALS",
        },
        { status: 401 },
      )
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: "Account has been suspended. Please contact support.",
          code: "ACCOUNT_SUSPENDED",
        },
        { status: 403 },
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
          code: "INVALID_CREDENTIALS",
        },
        { status: 401 },
      )
    }

    // Generate JWT token
    const tokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    }

    const tokenExpiry = rememberMe ? "30d" : "24h"
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || "fallback-secret", {
      expiresIn: tokenExpiry,
    })

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
        },
        token,
      },
    })

    // Set HTTP-only cookie
    const cookieExpiry = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: cookieExpiry,
      path: "/",
    })

    // Log successful login
    console.log(`User ${user.email} logged in successfully at ${new Date().toISOString()}`)

    return response
  } catch (error) {
    console.error("Login error:", error)
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
