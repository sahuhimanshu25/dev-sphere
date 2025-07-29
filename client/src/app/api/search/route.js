import { NextResponse } from "next/server"
import { rateLimit, combineMiddlewares } from "@/utils/apiMiddleware"

// GET /api/search - Global search
export const GET = combineMiddlewares(rateLimit({ maxRequests: 30, windowMs: 15 * 60 * 1000 }))(async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q") || ""
    const type = searchParams.get("type") || "all" // all, users, posts, code
    const limit = Math.min(Number.parseInt(searchParams.get("limit")) || 20, 50)

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Search query must be at least 2 characters long",
          code: "INVALID_QUERY",
        },
        { status: 400 },
      )
    }

    const searchTerm = query.trim().toLowerCase()

    // Mock search results - replace with actual database search
    const mockUsers = [
      {
        id: 1,
        name: "John Doe",
        username: "johndoe",
        bio: "Full-stack developer passionate about React",
        avatar: null,
        isVerified: false,
        followersCount: 156,
      },
      {
        id: 2,
        name: "Alice Johnson",
        username: "alicecodes",
        bio: "Frontend developer specializing in React and Vue.js",
        avatar: null,
        isVerified: true,
        followersCount: 234,
      },
    ]

    const mockPosts = [
      {
        id: 1,
        content: "Just finished building a React component library! 🚀",
        author: {
          id: 1,
          name: "John Doe",
          username: "johndoe",
          avatar: null,
        },
        tags: ["react", "typescript", "components"],
        likes: 42,
        comments: 8,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        content: "Working on a new machine learning project to predict code complexity.",
        author: {
          id: 2,
          name: "Alice Johnson",
          username: "alicecodes",
          avatar: null,
        },
        tags: ["machinelearning", "python", "data"],
        likes: 89,
        comments: 15,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
    ]

    const mockCodeSnippets = [
      {
        id: 1,
        title: "React Custom Hook for API Calls",
        language: "javascript",
        code: "const useApi = (url) => { /* implementation */ }",
        author: {
          id: 1,
          name: "John Doe",
          username: "johndoe",
        },
        tags: ["react", "hooks", "api"],
        likes: 25,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
    ]

    // Filter results based on search term
    const filteredUsers = mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.bio.toLowerCase().includes(searchTerm),
    )

    const filteredPosts = mockPosts.filter(
      (post) =>
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        post.author.name.toLowerCase().includes(searchTerm),
    )

    const filteredCode = mockCodeSnippets.filter(
      (snippet) =>
        snippet.title.toLowerCase().includes(searchTerm) ||
        snippet.code.toLowerCase().includes(searchTerm) ||
        snippet.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )

    // Prepare results based on type
    const results = {}

    if (type === "all" || type === "users") {
      results.users = filteredUsers.slice(0, limit)
    }

    if (type === "all" || type === "posts") {
      results.posts = filteredPosts.slice(0, limit)
    }

    if (type === "all" || type === "code") {
      results.code = filteredCode.slice(0, limit)
    }

    // Calculate total counts
    const totalCounts = {
      users: filteredUsers.length,
      posts: filteredPosts.length,
      code: filteredCode.length,
      total: filteredUsers.length + filteredPosts.length + filteredCode.length,
    }

    return NextResponse.json({
      success: true,
      data: {
        query: searchTerm,
        results,
        counts: totalCounts,
        suggestions: [
          "react hooks",
          "javascript patterns",
          "typescript tips",
          "node.js best practices",
          "css animations",
        ].filter((suggestion) => suggestion.includes(searchTerm)),
      },
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Search failed",
        code: "SEARCH_ERROR",
      },
      { status: 500 },
    )
  }
})
