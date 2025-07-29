import { NextResponse } from "next/server"
import { verifyToken, rateLimit, combineMiddlewares } from "@/utils/apiMiddleware"

// GET /api/chat/rooms/[id]/messages - Get chat messages
export const GET = combineMiddlewares(
  rateLimit({ maxRequests: 100, windowMs: 15 * 60 * 1000 }),
  verifyToken,
)(async (req, { params }) => {
  try {
    const userId = req.user.id
    const roomId = Number.parseInt(params.id)
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Math.min(Number.parseInt(searchParams.get("limit")) || 50, 100)
    const before = searchParams.get("before") // For pagination

    if (!roomId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid room ID",
          code: "INVALID_ROOM_ID",
        },
        { status: 400 },
      )
    }

    // Mock messages data - replace with actual database query
    const mockMessages = [
      {
        id: 1,
        roomId,
        content: "Hey everyone! How's the React project going?",
        type: "text",
        sender: {
          id: 2,
          name: "Alice Johnson",
          username: "alicecodes",
          avatar: null,
        },
        reactions: [
          { emoji: "👍", users: [{ id: userId, name: "You" }], count: 1 },
          { emoji: "🚀", users: [{ id: 3, name: "Bob Smith" }], count: 1 },
        ],
        replyTo: null,
        isEdited: false,
        readBy: [
          { userId, readAt: new Date().toISOString() },
          { userId: 3, readAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
        ],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        roomId,
        content: "Making great progress! Just implemented the new component library.",
        type: "text",
        sender: {
          id: userId,
          name: "You",
          username: req.user.username,
          avatar: null,
        },
        reactions: [],
        replyTo: {
          id: 1,
          content: "Hey everyone! How's the React project going?",
          sender: { name: "Alice Johnson" },
        },
        isEdited: false,
        readBy: [
          { userId, readAt: new Date().toISOString() },
          { userId: 2, readAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
        ],
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        roomId,
        content:
          "```javascript\nconst Button = ({ children, ...props }) => {\n  return <button {...props}>{children}</button>\n}\n```",
        type: "code",
        sender: {
          id: userId,
          name: "You",
          username: req.user.username,
          avatar: null,
        },
        reactions: [{ emoji: "🔥", users: [{ id: 2, name: "Alice Johnson" }], count: 1 }],
        replyTo: null,
        isEdited: false,
        readBy: [{ userId, readAt: new Date().toISOString() }],
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: 4,
        roomId,
        content: "Nice! That looks clean and reusable.",
        type: "text",
        sender: {
          id: 3,
          name: "Bob Smith",
          username: "bobdev",
          avatar: null,
        },
        reactions: [],
        replyTo: {
          id: 3,
          content: "const Button = ({ children, ...props }) => {...",
          sender: { name: "You" },
        },
        isEdited: false,
        readBy: [],
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
    ]

    // Apply pagination
    let filteredMessages = mockMessages
    if (before) {
      const beforeDate = new Date(before)
      filteredMessages = filteredMessages.filter((msg) => new Date(msg.createdAt) < beforeDate)
    }

    // Sort by creation time (newest first for pagination)
    filteredMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Apply limit
    const paginatedMessages = filteredMessages.slice(0, limit)

    // Reverse for display (oldest first)
    paginatedMessages.reverse()

    return NextResponse.json({
      success: true,
      data: {
        messages: paginatedMessages,
        hasMore: filteredMessages.length > limit,
        pagination: {
          page,
          limit,
          total: mockMessages.length,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch messages",
        code: "MESSAGES_FETCH_ERROR",
      },
      { status: 500 },
    )
  }
})

// POST /api/chat/rooms/[id]/messages - Send message
export const POST = combineMiddlewares(
  rateLimit({ maxRequests: 60, windowMs: 15 * 60 * 1000 }),
  verifyToken,
)(async (req, { params }) => {
  try {
    const userId = req.user.id
    const roomId = Number.parseInt(params.id)
    const { content, type, replyToId, attachments } = await req.json()

    if (!roomId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid room ID",
          code: "INVALID_ROOM_ID",
        },
        { status: 400 },
      )
    }

    // Validation
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Message content is required",
          code: "MISSING_CONTENT",
        },
        { status: 400 },
      )
    }

    if (content.length > 4000) {
      return NextResponse.json(
        {
          success: false,
          error: "Message must be less than 4000 characters",
          code: "CONTENT_TOO_LONG",
        },
        { status: 400 },
      )
    }

    const validTypes = ["text", "code", "image", "file"]
    if (type && !validTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid message type",
          code: "INVALID_MESSAGE_TYPE",
        },
        { status: 400 },
      )
    }

    // Create new message - replace with actual database insertion
    const newMessage = {
      id: Date.now(),
      roomId,
      content: content.trim(),
      type: type || "text",
      sender: {
        id: userId,
        name: req.user.name || "User",
        username: req.user.username,
        avatar: null,
      },
      reactions: [],
      replyTo: replyToId
        ? {
            id: replyToId,
            content: "Original message content...", // Fetch from DB
            sender: { name: "Original Sender" },
          }
        : null,
      attachments: attachments || [],
      isEdited: false,
      readBy: [{ userId, readAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In a real app, you would also:
    // 1. Update room's lastMessage
    // 2. Increment unread count for other participants
    // 3. Send real-time notification via WebSocket
    // 4. Create push notifications

    return NextResponse.json({
      success: true,
      data: newMessage,
      message: "Message sent successfully",
    })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message",
        code: "MESSAGE_SEND_ERROR",
      },
      { status: 500 },
    )
  }
})
