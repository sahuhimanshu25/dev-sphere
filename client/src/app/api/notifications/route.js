import { NextResponse } from "next/server"
import { verifyToken, rateLimit, combineMiddlewares } from "@/utils/apiMiddleware"

// GET /api/notifications - Get user notifications
export const GET = combineMiddlewares(
  rateLimit({ maxRequests: 60, windowMs: 15 * 60 * 1000 }),
  verifyToken,
)(async (req) => {
  try {
    const userId = req.user.id
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Math.min(Number.parseInt(searchParams.get("limit")) || 20, 50)
    const filter = searchParams.get("filter") || "all"

    // Mock notifications data - replace with actual database query
    const mockNotifications = [
      {
        id: 1,
        userId,
        type: "friend_request",
        title: "New Friend Request",
        message: "Alice Johnson sent you a friend request",
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        data: {
          senderId: 101,
          senderName: "Alice Johnson",
          senderAvatar: null,
        },
      },
      {
        id: 2,
        userId,
        type: "like",
        title: "Post Liked",
        message: "Bob Smith liked your post about React hooks",
        read: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        data: {
          postId: 123,
          likerId: 102,
          likerName: "Bob Smith",
        },
      },
      {
        id: 3,
        userId,
        type: "message",
        title: "New Message",
        message: "Carol Davis sent you a message",
        read: true,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        data: {
          senderId: 103,
          senderName: "Carol Davis",
          messagePreview: "Hey! I saw your latest project...",
        },
      },
      {
        id: 4,
        userId,
        type: "comment",
        title: "New Comment",
        message: "David Kim commented on your post",
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        data: {
          postId: 124,
          commenterId: 104,
          commenterName: "David Kim",
          commentPreview: "Great explanation! This helped me a lot.",
        },
      },
      {
        id: 5,
        userId,
        type: "friend_accepted",
        title: "Friend Request Accepted",
        message: "Emma Wilson accepted your friend request",
        read: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        data: {
          friendId: 105,
          friendName: "Emma Wilson",
        },
      },
    ]

    // Apply filters
    let filteredNotifications = mockNotifications

    if (filter === "unread") {
      filteredNotifications = filteredNotifications.filter((n) => !n.read)
    } else if (filter === "friends") {
      filteredNotifications = filteredNotifications.filter((n) =>
        ["friend_request", "friend_accepted"].includes(n.type),
      )
    } else if (filter === "posts") {
      filteredNotifications = filteredNotifications.filter((n) => ["like", "comment", "share"].includes(n.type))
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex)

    // Calculate unread count
    const unreadCount = mockNotifications.filter((n) => !n.read).length

    return NextResponse.json({
      success: true,
      data: {
        notifications: paginatedNotifications,
        unreadCount,
        pagination: {
          page,
          limit,
          total: filteredNotifications.length,
          totalPages: Math.ceil(filteredNotifications.length / limit),
          hasNext: endIndex < filteredNotifications.length,
          hasPrev: page > 1,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch notifications",
        code: "NOTIFICATIONS_FETCH_ERROR",
      },
      { status: 500 },
    )
  }
})

// DELETE /api/notifications - Clear all notifications
export const DELETE = combineMiddlewares(
  rateLimit({ maxRequests: 10, windowMs: 15 * 60 * 1000 }),
  verifyToken,
)(async (req) => {
  try {
    const userId = req.user.id

    // Mock clear all - replace with actual database operation
    // await clearAllUserNotifications(userId)

    return NextResponse.json({
      success: true,
      message: "All notifications cleared successfully",
    })
  } catch (error) {
    console.error("Error clearing notifications:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clear notifications",
        code: "NOTIFICATIONS_CLEAR_ERROR",
      },
      { status: 500 },
    )
  }
})
