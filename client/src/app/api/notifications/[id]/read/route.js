import { NextResponse } from "next/server"
import { verifyToken, rateLimit, combineMiddlewares } from "@/utils/apiMiddleware"

// PUT /api/notifications/[id]/read - Mark notification as read
export const PUT = combineMiddlewares(
  rateLimit({ maxRequests: 30, windowMs: 15 * 60 * 1000 }),
  verifyToken,
)(async (req, { params }) => {
  try {
    const userId = req.user.id
    const notificationId = Number.parseInt(params.id)

    if (!notificationId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid notification ID",
          code: "INVALID_NOTIFICATION_ID",
        },
        { status: 400 },
      )
    }

    // Mock mark as read - replace with actual database operation
    // const notification = await markNotificationAsRead(notificationId, userId)

    return NextResponse.json({
      success: true,
      message: "Notification marked as read",
    })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to mark notification as read",
        code: "NOTIFICATION_READ_ERROR",
      },
      { status: 500 },
    )
  }
})
