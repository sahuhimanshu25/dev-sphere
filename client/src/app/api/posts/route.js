"use client"

import { NextResponse } from "next/server"
import { verifyToken, rateLimit, combineMiddlewares } from "@/utils/apiMiddleware"

// GET /api/posts - Get posts feed
export const GET = combineMiddlewares(rateLimit({ maxRequests: 100, windowMs: 15 * 60 * 1000 }))(async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Math.min(Number.parseInt(searchParams.get("limit")) || 10, 50)
    const sort = searchParams.get("sort") || "recent" // recent, popular, trending
    const category = searchParams.get("category") || ""
    const userId = searchParams.get("userId") || ""

    // Mock posts data - replace with actual database query
    const mockPosts = [
      {
        id: 1,
        content:
          "Just finished building a React component library! 🚀 The developer experience is amazing with TypeScript and Storybook integration.",
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
          code: `const Button = ({ variant = 'primary', children, ...props }) => {
  return (
    <button className={\`btn btn-\${variant}\`} {...props}>
      {children}
    </button>
  )
}`,
        },
        tags: ["react", "typescript", "components"],
        likes: 42,
        comments: 8,
        shares: 3,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        content:
          "Working on a new machine learning project to predict code complexity. The results are fascinating! 📊",
        author: {
          id: 2,
          name: "Alice Johnson",
          username: "alicecodes",
          avatar: null,
          isVerified: true,
        },
        images: ["/placeholder.svg?height=300&width=500"],
        codeSnippet: null,
        tags: ["machinelearning", "python", "data"],
        likes: 89,
        comments: 15,
        shares: 12,
        isLiked: true,
        isBookmarked: false,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        content:
          "Tips for optimizing React performance: Use React.memo, useMemo, and useCallback wisely. Don't over-optimize! 💡",
        author: {
          id: 3,
          name: "Bob Smith",
          username: "bobdev",
          avatar: null,
          isVerified: false,
        },
        images: [],
        codeSnippet: {
          language: "javascript",
          code: `// Good: Memoize expensive calculations
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => expensiveOperation(item))
  }, [data])
  
  return <div>{processedData}</div>
})`,
        },
        tags: ["react", "performance", "optimization"],
        likes: 156,
        comments: 23,
        shares: 18,
        isLiked: false,
        isBookmarked: true,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ]

    // Apply filters
    let filteredPosts = mockPosts

    if (category) {
      filteredPosts = filteredPosts.filter((post) =>
        post.tags.some((tag) => tag.toLowerCase().includes(category.toLowerCase())),
      )
    }

    if (userId) {
      filteredPosts = filteredPosts.filter((post) => post.author.id === Number.parseInt(userId))
    }

    // Apply sorting
    if (sort === "popular") {
      filteredPosts.sort((a, b) => b.likes - a.likes)
    } else if (sort === "trending") {
      // Simple trending algorithm based on recent engagement
      filteredPosts.sort((a, b) => {
        const aScore = a.likes + a.comments * 2 + a.shares * 3
        const bScore = b.likes + b.comments * 2 + b.shares * 3
        return bScore - aScore
      })
    } else {
      // Default: recent
      filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        posts: paginatedPosts,
        pagination: {
          page,
          limit,
          total: filteredPosts.length,
          totalPages: Math.ceil(filteredPosts.length / limit),
          hasNext: endIndex < filteredPosts.length,
          hasPrev: page > 1,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch posts",
        code: "POSTS_FETCH_ERROR",
      },
      { status: 500 },
    )
  }
})

// POST /api/posts - Create new post
export const POST = combineMiddlewares(
  rateLimit({ maxRequests: 10, windowMs: 15 * 60 * 1000 }),
  verifyToken,
)(async (req) => {
  try {
    const userId = req.user.id
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

    // Validate tags
    if (tags && (!Array.isArray(tags) || tags.length > 10)) {
      return NextResponse.json(
        {
          success: false,
          error: "Maximum 10 tags allowed",
          code: "TOO_MANY_TAGS",
        },
        { status: 400 },
      )
    }

    // Validate images
    if (images && (!Array.isArray(images) || images.length > 5)) {
      return NextResponse.json(
        {
          success: false,
          error: "Maximum 5 images allowed",
          code: "TOO_MANY_IMAGES",
        },
        { status: 400 },
      )
    }

    // Create new post - replace with actual database insertion
    const newPost = {
      id: Date.now(),
      content: content.trim(),
      author: {
        id: userId,
        name: req.user.name || "User",
        username: req.user.username,
        avatar: null,
        isVerified: false,
      },
      images: images || [],
      codeSnippet: codeSnippet || null,
      tags: tags || [],
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: newPost,
      message: "Post created successfully",
    })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create post",
        code: "POST_CREATE_ERROR",
      },
      { status: 500 },
    )
  }
})
