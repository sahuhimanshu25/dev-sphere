import { NextResponse } from "next/server"
import { verifyToken, rateLimit, combineMiddlewares } from "@/utils/apiMiddleware"

// POST /api/posts/[id]/like - Like/unlike post
export const POST = combineMiddlewares(
  rateLimit({ maxRequests: 60, windowMs: 15 * 60 * 1000 }),
  verifyToken,
)(async (req, { params }) => {
  try {
    const userId = req.user.id
    const postId = Number.parseInt(params.id)

    if (!postId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid post ID",
          code: "INVALID_POST_ID",
        },
        { status: 400 },
      )
    }

    // Mock like/unlike logic - replace with actual database operations
    const isCurrentlyLiked = false // Check if user already liked this post
    const newLikeStatus = !isCurrentlyLiked
    const newLikeCount = isCurrentlyLiked ? 41 : 43 // Mock count adjustment

    // In a real app, you would:
    // 1. Check if the post exists
    // 2. Check if user already liked it
    // 3. Add/remove like record
    // 4. Update post like count
    // 5. Create notification for post author (if liking)

    return NextResponse.json({
      success: true,
      data: {
        postId,
        isLiked: newLikeStatus,
        likeCount: newLikeCount,
      },
      message: newLikeStatus ? "Post liked" : "Post unliked",
    })
  } catch (error) {
    console.error("Error toggling post like:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to toggle like",
        code: "LIKE_TOGGLE_ERROR",
      },
      { status: 500 },
    )
  }
})
