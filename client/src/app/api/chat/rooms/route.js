import { NextResponse } from "next/server"
import { verifyToken, rateLimit, combineMiddlewares } from "@/utils/apiMiddleware"

// GET /api/chat/rooms - Get user's chat rooms
export const GET = combineMiddlewares(
  rateLimit({ maxRequests: 60, windowMs: 15 * 60 * 1000 }),
  verifyToken,
)(async (req) => {
  try {
    const userId = req.user.id
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""

    // Mock chat rooms data - replace with actual database query
    const mockRooms = [
      {
        id: 1,
        name: "React Developers",
        type: "group",
        avatar: null,
        lastMessage: {
          id: 101,
          content: "Anyone working with Next.js 15?",
          sender: {
            id: 2,
            name: "Alice Johnson",
            username: "alicecodes",
          },
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        participants: [
          { id: userId, name: "You", role: "member" },
          { id: 2, name: "Alice Johnson", role: "admin" },
          { id: 3, name: "Bob Smith", role: "member" },
          { id: 4, name: "Carol Davis", role: "member" },
        ],
        unreadCount: 3,
        isOnline: true,
        createdAt: "2023-06-15T00:00:00.000Z",
      },
      {
        id: 2,
        name: null, // Direct message
        type: "direct",
        avatar: null,
        lastMessage: {
          id: 102,
          content: "Thanks for the code review!",
          sender: {
            id: 3,
            name: "Bob Smith",
            username: "bobdev",
          },
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        participants: [
          { id: userId, name: "You", role: "member" },
          { id: 3, name: "Bob Smith", role: "member" },
        ],
        unreadCount: 0,
        isOnline: false,
        createdAt: "2023-08-22T00:00:00.000Z",
      },
      {
        id: 3,
        name: "JavaScript Study Group",
        type: "group",
        avatar: null,
        lastMessage: {
          id: 103,
          content: "Let's discuss async/await patterns tomorrow",
          sender: {
            id: 4,
            name: "Carol Davis",
            username: "carolcodes",
          },
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
        participants: [
          { id: userId, name: "You", role: "member" },
          { id: 4, name: "Carol Davis", role: "admin" },
          { id: 5, name: "David Kim", role: "member" },
        ],
        unreadCount: 1,
        isOnline: true,
        createdAt: "2023-04-10T00:00:00.000Z",
      },
    ]

    // Apply search filter
    let filteredRooms = mockRooms
    if (search) {
      filteredRooms = filteredRooms.filter((room) => {
        if (room.type === "direct") {
          const otherParticipant = room.participants.find((p) => p.id !== userId)
          return otherParticipant?.name.toLowerCase().includes(search.toLowerCase())
        }
        return room.name?.toLowerCase().includes(search.toLowerCase())
      })
    }

    // Sort by last message timestamp
    filteredRooms.sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp))

    return NextResponse.json({
      success: true,
      data: {
        rooms: filteredRooms,
        totalUnread: filteredRooms.reduce((sum, room) => sum + room.unreadCount, 0),
      },
    })
  } catch (error) {
    console.error("Error fetching chat rooms:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch chat rooms",
        code: "ROOMS_FETCH_ERROR",
      },
      { status: 500 },
    )
  }
})

// POST /api/chat/rooms - Create new chat room
export const POST = combineMiddlewares(
  rateLimit({ maxRequests: 10, windowMs: 15 * 60 * 1000 }),
  verifyToken,
)(async (req) => {
  try {
    const userId = req.user.id
    const { name, type, participantIds, description } = await req.json()

    // Validation
    if (!type || !["direct", "group"].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid room type",
          code: "INVALID_ROOM_TYPE",
        },
        { status: 400 },
      )
    }

    if (type === "group" && (!name || name.trim().length === 0)) {
      return NextResponse.json(
        {
          success: false,
          error: "Group name is required",
          code: "MISSING_GROUP_NAME",
        },
        { status: 400 },
      )
    }

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one participant is required",
          code: "MISSING_PARTICIPANTS",
        },
        { status: 400 },
      )
    }

    if (type === "direct" && participantIds.length !== 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Direct messages must have exactly one other participant",
          code: "INVALID_DIRECT_PARTICIPANTS",
        },
        { status: 400 },
      )
    }

    // Create new room - replace with actual database insertion
    const newRoom = {
      id: Date.now(),
      name: type === "group" ? name.trim() : null,
      type,
      description: description || null,
      avatar: null,
      participants: [
        { id: userId, name: req.user.name || "You", role: "admin" },
        ...participantIds.map((id) => ({
          id,
          name: `User ${id}`, // Replace with actual user lookup
          role: "member",
        })),
      ],
      lastMessage: null,
      unreadCount: 0,
      isOnline: false,
      createdAt: new Date().toISOString(),
      createdBy: userId,
    }

    return NextResponse.json({
      success: true,
      data: newRoom,
      message: "Chat room created successfully",
    })
  } catch (error) {
    console.error("Error creating chat room:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create chat room",
        code: "ROOM_CREATE_ERROR",
      },
      { status: 500 },
    )
  }
})
