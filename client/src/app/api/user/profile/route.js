import { NextResponse } from "next/server"
import { verifyToken, rateLimit, combineMiddlewares } from "@/utils/apiMiddleware"

// GET /api/user/profile - Get current user profile
export const GET = combineMiddlewares(
  rateLimit({ maxRequests: 50, windowMs: 15 * 60 * 1000 }),
  verifyToken,
)(async (req) => {
  try {
    const userId = req.user.id

    // Mock user data - replace with actual database query
    const userData = {
      id: userId,
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      bio: "Full-stack developer passionate about React and Node.js",
      avatar: null,
      location: "San Francisco, CA",
      company: "Tech Corp",
      website: "https://johndoe.dev",
      joinedAt: "2023-01-15T00:00:00.000Z",
      isOnline: true,
      socialLinks: {
        github: "https://github.com/johndoe",
        twitter: "https://twitter.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe",
      },
      stats: {
        postsCount: 42,
        friendsCount: 156,
        followersCount: 234,
        followingCount: 189,
      },
      skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python"],
      preferences: {
        theme: "dark",
        notifications: {
          email: true,
          push: true,
          friendRequests: true,
          messages: true,
        },
        privacy: {
          profileVisibility: "public",
          showEmail: false,
          showOnlineStatus: true,
        },
      },
    }

    return NextResponse.json({
      success: true,
      data: userData,
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user profile",
        code: "PROFILE_FETCH_ERROR",
      },
      { status: 500 },
    )
  }
})

// PUT /api/user/profile - Update user profile
export const PUT = combineMiddlewares(
  rateLimit({ maxRequests: 10, windowMs: 15 * 60 * 1000 }),
  verifyToken,
)(async (req) => {
  try {
    const userId = req.user.id
    const updates = await req.json()

    // Validate allowed fields
    const allowedFields = ["name", "bio", "location", "company", "website", "socialLinks", "skills", "preferences"]

    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {})

    // Basic validation
    if (filteredUpdates.name && filteredUpdates.name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Name must be at least 2 characters long",
          code: "INVALID_NAME",
        },
        { status: 400 },
      )
    }

    if (filteredUpdates.bio && filteredUpdates.bio.length > 500) {
      return NextResponse.json(
        {
          success: false,
          error: "Bio must be less than 500 characters",
          code: "BIO_TOO_LONG",
        },
        { status: 400 },
      )
    }

    if (filteredUpdates.website && filteredUpdates.website.length > 0) {
      const urlRegex = /^https?:\/\/.+/
      if (!urlRegex.test(filteredUpdates.website)) {
        return NextResponse.json(
          {
            success: false,
            error: "Website must be a valid URL starting with http:// or https://",
            code: "INVALID_WEBSITE",
          },
          { status: 400 },
        )
      }
    }

    if (filteredUpdates.skills && (!Array.isArray(filteredUpdates.skills) || filteredUpdates.skills.length > 20)) {
      return NextResponse.json(
        {
          success: false,
          error: "Maximum 20 skills allowed",
          code: "TOO_MANY_SKILLS",
        },
        { status: 400 },
      )
    }

    // Mock update - replace with actual database update
    const updatedUser = {
      id: userId,
      ...filteredUpdates,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update user profile",
        code: "PROFILE_UPDATE_ERROR",
      },
      { status: 500 },
    )
  }
})
