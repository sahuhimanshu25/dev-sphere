import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Async thunks
export const fetchChatRooms = createAsyncThunk("chat/fetchChatRooms", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/chat/rooms")
    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error.message)
    }
    return await response.json()
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const fetchMessages = createAsyncThunk("chat/fetchMessages", async (roomId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/chat/rooms/${roomId}/messages`)
    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error.message)
    }
    return await response.json()
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ roomId, content, type = "text" }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, type }),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.message)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const initialState = {
  rooms: [],
  currentRoom: null,
  messages: {},
  onlineUsers: [],
  typingUsers: {},
  unreadCounts: {},
  searchQuery: "",
  filteredRooms: [],
  loading: false,
  error: null,
  isConnected: false,
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload
      if (action.payload) {
        state.unreadCounts[action.payload.id] = 0
      }
    },
    addMessage: (state, action) => {
      const { roomId, message } = action.payload
      if (!state.messages[roomId]) {
        state.messages[roomId] = []
      }
      state.messages[roomId].push(message)

      // Update unread count if not current room
      if (!state.currentRoom || state.currentRoom.id !== roomId) {
        state.unreadCounts[roomId] = (state.unreadCounts[roomId] || 0) + 1
      }
    },
    updateMessage: (state, action) => {
      const { roomId, messageId, updates } = action.payload
      if (state.messages[roomId]) {
        const messageIndex = state.messages[roomId].findIndex((m) => m.id === messageId)
        if (messageIndex !== -1) {
          state.messages[roomId][messageIndex] = {
            ...state.messages[roomId][messageIndex],
            ...updates,
          }
        }
      }
    },
    deleteMessage: (state, action) => {
      const { roomId, messageId } = action.payload
      if (state.messages[roomId]) {
        state.messages[roomId] = state.messages[roomId].filter((m) => m.id !== messageId)
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload
    },
    setTypingUsers: (state, action) => {
      const { roomId, users } = action.payload
      state.typingUsers[roomId] = users
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
      state.filteredRooms = state.rooms.filter(
        (room) =>
          room.name.toLowerCase().includes(action.payload.toLowerCase()) ||
          room.participants.some((p) => p.username.toLowerCase().includes(action.payload.toLowerCase())),
      )
    },
    markAsRead: (state, action) => {
      const roomId = action.payload
      state.unreadCounts[roomId] = 0
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch rooms
      .addCase(fetchChatRooms.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchChatRooms.fulfilled, (state, action) => {
        state.loading = false
        state.rooms = action.payload
        state.filteredRooms = action.payload
      })
      .addCase(fetchChatRooms.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch messages
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { roomId, messages } = action.payload
        state.messages[roomId] = messages
      })
      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload
        if (!state.messages[message.roomId]) {
          state.messages[message.roomId] = []
        }
        state.messages[message.roomId].push(message)
      })
  },
})

export const {
  setCurrentRoom,
  addMessage,
  updateMessage,
  deleteMessage,
  setOnlineUsers,
  setTypingUsers,
  setSearchQuery,
  markAsRead,
  setConnectionStatus,
  clearError,
} = chatSlice.actions

export default chatSlice.reducer
