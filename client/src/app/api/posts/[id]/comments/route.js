import { NextResponse } from "next/server"
import { verifyToken, rateLimit, combineMiddlewares } from "@/utils/apiMiddleware"

// GET /api/posts/[id]/comments - Get post comments
export const GET = combineMiddlewares(rateLimit({ maxRequests: 100, windowMs: 15 * 60 * 1000 }))(
  async (req, { params }) => {
    try {
      const postId = Number.parseInt(params.id)
      const { searchParams } = new URL(req.url)
      const page = Number.parseInt(searchParams.get("page")) || 1
      const limit = Math.min(Number.parseInt(searchParams.get("limit")) || 20, 50)
      const sort = searchParams.get("sort") || "recent" // recent, popular

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

      // Mock comments data - replace with actual database query
      const mockComments = [
        {
          id: 1,
          postId,
          content: "Great explanation! This really helped me understand React hooks better.",
          author: {
            id: 2,
            name: "Alice Johnson",
            username: "alicecodes",
            avatar: null,
          },
          likes: 5,
          replies: 2,
          isLiked: false,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          postId,
          content: "Could you provide an example with useEffect as well?",
          author: {
            id: 3,
            name: "Bob Smith",
            username: "bobdev",
            avatar: null,
          },
          likes: 2,
          replies: 1,
          isLiked: true,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
      ]

      // Apply sorting
      const sortedComments = [...mockComments]
      if (sort === "popular") {
        sortedComments.sort((a, b) => b.likes - a.likes)
      } else {
        sortedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }

      // Pagination
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedComments = sortedComments.slice(startIndex, endIndex)

      return NextResponse.json({
        success: true,
        data: {
          comments: paginatedComments,
          pagination: {
            page,
            limit,
            total: sortedComments.length,
            totalPages: Math.ceil(sortedComments.length / limit),
            hasNext: endIndex < sortedComments.length,
            hasPrev: page > 1,
          },
        },
      })
    } catch (error) {
      console.error("Error fetching comments:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch comments",
          code: "COMMENTS_FETCH_ERROR",
        },
        { status: 500 },
      )
    }
  },
)

// POST /api/posts/[id]/comments - Create comment
export const POST = combineMiddlewares(
  rateLimit({ maxRequests: 30, windowMs: 15 * 60 * 1000 }),
  verifyToken,
)(async (req, { params }) => {
  try {
    const userId = req.user.id
    const postId = Number.parseInt(params.id)
    const { content, parentId } = await req.json()

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

    // Validation
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Comment content is required",
          code: "MISSING_CONTENT",
        },
        { status: 400 },
      )
    }

    if (content.length > 500) {
      return NextResponse.json(
        {
          success: false,
          error: "Comment must be less than 500 characters",
          code: "CONTENT_TOO_LONG",
        },
        { status: 400 },
      )
    }

    // Create new comment - replace with actual database insertion
    const newComment = {
      id: Date.now(),
      postId,
      parentId: parentId || null,
      content: content.trim(),
      author: {
        id: userId,
        name: req.user.name || "User",
        username: req.user.username,
        avatar: null,
      },
      likes: 0,
      replies: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: newComment,
      message: "Comment created successfully",
    })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create comment",
        code: "COMMENT_CREATE_ERROR",
      },
      { status: 500 },
    )
  }
})
