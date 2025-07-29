import { NextResponse } from "next/server"
import { verifyToken, rateLimit, combineMiddlewares } from "@/utils/apiMiddleware"

// GET /api/user/friends - Get user's friends list
export const GET = combineMiddlewares(
  rateLimit({ maxRequests: 30, windowMs: 15 * 60 * 1000 }),
  verifyToken,
)(async (req) => {
  try {
    const userId = req.user.id
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Math.min(Number.parseInt(searchParams.get("limit")) || 20, 50)
    const search = searchParams.get("search") || ""
    const filter = searchParams.get("filter") || "all" // all, online, mutual

    // Mock friends data - replace with actual database query
    const mockFriends = [
      {
        id: 1,
        name: "Alice Johnson",
        username: "alicecodes",
        avatar: null,
        bio: "Frontend developer specializing in React and Vue.js",
        location: "New York, NY",
        isOnline: true,
        mutualFriends: 5,
        friendsSince: "2023-06-15T00:00:00.000Z",
        skills: ["React", "Vue.js", "CSS", "JavaScript"],
      },
      {
        id: 2,
        name: "Bob Smith",
        username: "bobdev",
        avatar: null,
        bio: "Backend engineer passionate about scalable systems",
        location: "Seattle, WA",
        isOnline: false,
        mutualFriends: 3,
        friendsSince: "2023-08-22T00:00:00.000Z",
        skills: ["Node.js", "Python", "Docker", "AWS"],
      },
      {
        id: 3,
        name: "Carol Davis",
        username: "carolcodes",
        avatar: null,
        bio: "Full-stack developer and tech lead",
        location: "Austin, TX",
        isOnline: true,
        mutualFriends: 8,
        friendsSince: "2023-04-10T00:00:00.000Z",
        skills: ["JavaScript", "TypeScript", "React", "Node.js"],
      },
    ]

    // Apply filters
    let filteredFriends = mockFriends

    if (search) {
      filteredFriends = filteredFriends.filter(
        (friend) =>
          friend.name.toLowerCase().includes(search.toLowerCase()) ||
          friend.username.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (filter === "online") {
      filteredFriends = filteredFriends.filter((friend) => friend.isOnline)
    } else if (filter === "mutual") {
      filteredFriends = filteredFriends.filter((friend) => friend.mutualFriends > 0)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedFriends = filteredFriends.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        friends: paginatedFriends,
        pagination: {
          page,
          limit,
          total: filteredFriends.length,
          totalPages: Math.ceil(filteredFriends.length / limit),
          hasNext: endIndex < filteredFriends.length,
          hasPrev: page > 1,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching friends:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch friends",
        code: "FRIENDS_FETCH_ERROR",
      },
      { status: 500 },
    )
  }
})

// POST /api/user/friends - Send friend request
export const POST = combineMiddlewares(
  rateLimit({ maxRequests: 20, windowMs: 15 * 60 * 1000 }),
  verifyToken,
)(async (req) => {
  try {
    const userId = req.user.id
    const { targetUserId, message } = await req.json()

    if (!targetUserId) {
      return NextResponse.json(
        {
          success: false,
          error: "Target user ID is required",
          code: "MISSING_TARGET_USER",
        },
        { status: 400 },
      )
    }

    if (targetUserId === userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot send friend request to yourself",
          code: "SELF_FRIEND_REQUEST",
        },
        { status: 400 },
      )
    }

    // Mock friend request creation - replace with actual database operation
    const friendRequest = {
      id: Date.now(),
      senderId: userId,
      receiverId: targetUserId,
      message: message || null,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: friendRequest,
      message: "Friend request sent successfully",
    })
  } catch (error) {
    console.error("Error sending friend request:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send friend request",
        code: "FRIEND_REQUEST_ERROR",
      },
      { status: 500 },
    )
  }
})
