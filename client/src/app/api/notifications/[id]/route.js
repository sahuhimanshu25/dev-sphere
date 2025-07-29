import { NextResponse } from "next/server"
import { verifyToken, rateLimit, combineMiddlewares } from "@/utils/apiMiddleware"

// DELETE /api/notifications/[id] - Delete notification
export const DELETE = combineMiddlewares(
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

    // Mock delete - replace with actual database operation
    // await deleteNotification(notificationId, userId)

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting notification:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete notification",
        code: "NOTIFICATION_DELETE_ERROR",
      },
      { status: 500 },
    )
  }
})
