"use client"

import { NextResponse } from "next/server"
import { verifyToken, verifyOwnership, rateLimit, combineMiddlewares } from "@/utils/apiMiddleware"

// GET /api/posts/[id] - Get single post
export const GET = combineMiddlewares(rateLimit({ maxRequests: 100, windowMs: 15 * 60 * 1000 }))(
  async (req, { params }) => {
    try {
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

      // Mock post data - replace with actual database query
      const mockPost = {
        id: postId,
        content: "This is a detailed post about React hooks and their usage patterns.",
        author: {
          id: 1,
          name: "John Doe",
          username: "johndoe",
          avatar: null,
          isVerified: false,
        },
        images: [],
        codeSnippet: {
          language: "javascript",
          code: `const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue)
  
  const increment = useCallback(() => setCount(c => c + 1), [])
  const decrement = useCallback(() => setCount(c => c - 1), [])
  const reset = useCallback(() => setCount(initialValue), [initialValue])
  
  return { count, increment, decrement, reset }
}`,
        },
        tags: ["react", "hooks", "javascript"],
        likes: 42,
        comments: 8,
        shares: 3,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      }

      if (!mockPost) {
        return NextResponse.json(
          {
            success: false,
            error: "Post not found",
            code: "POST_NOT_FOUND",
          },
          { status: 404 },
        )
      }

      return NextResponse.json({
        success: true,
        data: mockPost,
      })
    } catch (error) {
      console.error("Error fetching post:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch post",
          code: "POST_FETCH_ERROR",
        },
        { status: 500 },
      )
    }
  },
)

// PUT /api/posts/[id] - Update post
export const PUT = combineMiddlewares(
  rateLimit({ maxRequests: 20, windowMs: 15 * 60 * 1000 }),
  verifyToken,
  verifyOwnership(async (req) => {
    // Mock ownership check - replace with actual database query
    const postId = Number.parseInt(req.nextUrl.pathname.split("/").pop())
    return 1 // Mock: return the user ID who owns this post
  }),
)(async (req, { params }) => {
  try {
    const postId = Number.parseInt(params.id)
    const { content, images, codeSnippet, tags } = await req.json()

    // Validation
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Post content is required",
          code: "MISSING_CONTENT",
        },
        { status: 400 },
      )
    }

    if (content.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          error: "Post content must be less than 2000 characters",
          code: "CONTENT_TOO_LONG",
        },
        { status: 400 },
      )
    }

    // Mock update - replace with actual database update
    const updatedPost = {
      id: postId,
      content: content.trim(),
      images: images || [],
      codeSnippet: codeSnippet || null,
      tags: tags || [],
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: updatedPost,
      message: "Post updated successfully",
    })
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update post",
        code: "POST_UPDATE_ERROR",
      },
      { status: 500 },
    )
  }
})

// DELETE /api/posts/[id] - Delete post
export const DELETE = combineMiddlewares(
  rateLimit({ maxRequests: 10, windowMs: 15 * 60 * 1000 }),
  verifyToken,
  verifyOwnership(async (req) => {
    // Mock ownership check - replace with actual database query
    const postId = Number.parseInt(req.nextUrl.pathname.split("/").pop())
    return 1 // Mock: return the user ID who owns this post
  }),
)(async (req, { params }) => {
  try {
    const postId = Number.parseInt(params.id)

    // Mock deletion - replace with actual database deletion
    // await deletePost(postId)

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete post",
        code: "POST_DELETE_ERROR",
      },
      { status: 500 },
    )
  }
})
