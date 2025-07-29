import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { rateLimit, cors, combineMiddlewares } from "@/utils/apiMiddleware"

// POST /api/auth/register - User registration
export const POST = combineMiddlewares(
  cors(),
  rateLimit({ maxRequests: 3, windowMs: 15 * 60 * 1000 }),
)(async (req) => {
  try {
    const { name, username, email, password, confirmPassword } = await req.json()

    // Validation
    if (!name || !username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required",
          code: "MISSING_FIELDS",
        },
        { status: 400 },
      )
    }

    // Password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Passwords do not match",
          code: "PASSWORD_MISMATCH",
        },
        { status: 400 },
      )
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 8 characters long",
          code: "WEAK_PASSWORD",
        },
        { status: 400 },
      )
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
          code: "INVALID_PASSWORD_FORMAT",
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

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        {
          success: false,
          error: "Username must be 3-20 characters long and contain only letters, numbers, and underscores",
          code: "INVALID_USERNAME",
        },
        { status: 400 },
      )
    }

    // Name validation
    if (name.length < 2 || name.length > 50) {
      return NextResponse.json(
        {
          success: false,
          error: "Name must be between 2 and 50 characters long",
          code: "INVALID_NAME",
        },
        { status: 400 },
      )
    }

    // Mock existing users check - replace with actual database query
    const existingUsers = [
      { email: "john@example.com", username: "johndoe" },
      { email: "admin@example.com", username: "admin" },
    ]

    const emailExists = existingUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())
    if (emailExists) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is already registered",
          code: "EMAIL_EXISTS",
        },
        { status: 409 },
      )
    }

    const usernameExists = existingUsers.some((u) => u.username.toLowerCase() === username.toLowerCase())
    if (usernameExists) {
      return NextResponse.json(
        {
          success: false,
          error: "Username is already taken",
          code: "USERNAME_EXISTS",
        },
        { status: 409 },
      )
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create new user - replace with actual database insertion
    const newUser = {
      id: Date.now(), // Use proper ID generation in production
      name: name.trim(),
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
      isActive: true,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        bio: "",
        avatar: null,
        location: "",
        website: "",
        skills: [],
        socialLinks: {},
      },
    }

    // Generate JWT token
    const tokenPayload = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || "fallback-secret", {
      expiresIn: "24h",
    })

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Registration successful",
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          emailVerified: newUser.emailVerified,
        },
        token,
      },
    })

    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: "/",
    })

    // Log successful registration
    console.log(`New user registered: ${newUser.email} at ${new Date().toISOString()}`)

    return response
  } catch (error) {
    console.error("Registration error:", error)
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
