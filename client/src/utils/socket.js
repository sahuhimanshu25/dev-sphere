import { io } from "socket.io-client"
import {
  setConnectionStatus,
  addMessage,
  setOnlineUsers,
  setTyping,
  addConversation,
  updateConversation,
  updateMessage, // Declare the updateMessage variable
} from "@/store/slices/chatSlice"

class SocketManager {
  constructor() {
    this.socket = null
    this.store = null
  }

  connect(store, token) {
    this.store = store

    this.socket = io(process.env.NEXT_PUBLIC_BACKEND_BASEURL, {
      auth: {
        token,
      },
      transports: ["websocket", "polling"],
    })

    this.setupEventListeners()
  }

  setupEventListeners() {
    if (!this.socket || !this.store) return

    // Connection events
    this.socket.on("connect", () => {
      console.log("Connected to server")
      this.store.dispatch(setConnectionStatus(true))
    })

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server")
      this.store.dispatch(setConnectionStatus(false))
    })

    // Message events
    this.socket.on("newMessage", (data) => {
      this.store.dispatch(
        addMessage({
          conversationId: data.conversationId,
          message: data.message,
        }),
      )
    })

    this.socket.on("messageDelivered", (data) => {
      this.store.dispatch(
        updateMessage({
          conversationId: data.conversationId,
          messageId: data.messageId,
          updates: { status: "delivered" },
        }),
      )
    })

    this.socket.on("messageRead", (data) => {
      this.store.dispatch(
        updateMessage({
          conversationId: data.conversationId,
          messageId: data.messageId,
          updates: { status: "read" },
        }),
      )
    })

    // Typing events
    this.socket.on("userTyping", (data) => {
      this.store.dispatch(
        setTyping({
          conversationId: data.conversationId,
          userId: data.userId,
          isTyping: true,
        }),
      )

      // Clear typing after 3 seconds
      setTimeout(() => {
        this.store.dispatch(
          setTyping({
            conversationId: data.conversationId,
            userId: data.userId,
            isTyping: false,
          }),
        )
      }, 3000)
    })

    this.socket.on("userStoppedTyping", (data) => {
      this.store.dispatch(
        setTyping({
          conversationId: data.conversationId,
          userId: data.userId,
          isTyping: false,
        }),
      )
    })

    // Online users
    this.socket.on("onlineUsers", (users) => {
      this.store.dispatch(setOnlineUsers(users))
    })

    // Conversation events
    this.socket.on("newConversation", (conversation) => {
      this.store.dispatch(addConversation(conversation))
    })

    this.socket.on("conversationUpdated", (data) => {
      this.store.dispatch(
        updateConversation({
          conversationId: data.conversationId,
          updates: data.updates,
        }),
      )
    })
  }

  // Send message
  sendMessage(conversationId, message, type = "text") {
    if (this.socket) {
      this.socket.emit("sendMessage", {
        conversationId,
        message,
        type,
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Join conversation
  joinConversation(conversationId) {
    if (this.socket) {
      this.socket.emit("joinConversation", conversationId)
    }
  }

  // Leave conversation
  leaveConversation(conversationId) {
    if (this.socket) {
      this.socket.emit("leaveConversation", conversationId)
    }
  }

  // Typing indicators
  startTyping(conversationId) {
    if (this.socket) {
      this.socket.emit("startTyping", conversationId)
    }
  }

  stopTyping(conversationId) {
    if (this.socket) {
      this.socket.emit("stopTyping", conversationId)
    }
  }

  // Mark messages as read
  markAsRead(conversationId, messageIds) {
    if (this.socket) {
      this.socket.emit("markAsRead", { conversationId, messageIds })
    }
  }

  // Create conversation
  createConversation(participants, type = "direct") {
    if (this.socket) {
      this.socket.emit("createConversation", { participants, type })
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export const socketManager = new SocketManager()
