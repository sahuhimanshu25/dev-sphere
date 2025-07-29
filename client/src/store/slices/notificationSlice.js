import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Async thunks
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async ({ page = 1, limit = 20, filter = "all" }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/notifications?page=${page}&limit=${limit}&filter=${filter}`)
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

export const markAsRead = createAsyncThunk("notifications/markAsRead", async (notificationId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/notifications/${notificationId}/read`, {
      method: "PUT",
    })

    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error.message)
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const markAllAsRead = createAsyncThunk("notifications/markAllAsRead", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/notifications/read-all", {
      method: "PUT",
    })

    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error.message)
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.message)
      }

      return { notificationId }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const initialState = {
  notifications: [],
  unreadCount: 0,
  currentPage: 1,
  totalPages: 1,
  hasMore: true,
  filter: "all", // 'all', 'unread', 'friend_requests', 'messages', 'posts', 'system'
  loading: false,
  error: null,
  settings: {
    sound: true,
    desktop: true,
    email: true,
    push: true,
    types: {
      friend_requests: true,
      messages: true,
      posts: true,
      comments: true,
      likes: true,
      follows: true,
      system: true,
    },
  },
}

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload)
      if (!action.payload.read) {
        state.unreadCount += 1
      }
    },
    updateNotification: (state, action) => {
      const { id, updates } = action.payload
      const notificationIndex = state.notifications.findIndex((n) => n.id === id)
      if (notificationIndex !== -1) {
        const wasUnread = !state.notifications[notificationIndex].read
        state.notifications[notificationIndex] = {
          ...state.notifications[notificationIndex],
          ...updates,
        }

        // Update unread count
        if (wasUnread && updates.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        } else if (!wasUnread && updates.read === false) {
          state.unreadCount += 1
        }
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload
      state.notifications = []
      state.currentPage = 1
      state.hasMore = true
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        const { notifications, currentPage, totalPages, hasMore, unreadCount } = action.payload

        if (currentPage === 1) {
          state.notifications = notifications
        } else {
          state.notifications = [...state.notifications, ...notifications]
        }

        state.currentPage = currentPage
        state.totalPages = totalPages
        state.hasMore = hasMore
        state.unreadCount = unreadCount
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload.id
        const notification = state.notifications.find((n) => n.id === notificationId)
        if (notification && !notification.read) {
          notification.read = true
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })
      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach((notification) => {
          notification.read = true
        })
        state.unreadCount = 0
      })
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const { notificationId } = action.payload
        const notificationIndex = state.notifications.findIndex((n) => n.id === notificationId)
        if (notificationIndex !== -1) {
          const wasUnread = !state.notifications[notificationIndex].read
          state.notifications.splice(notificationIndex, 1)
          if (wasUnread) {
            state.unreadCount = Math.max(0, state.unreadCount - 1)
          }
        }
      })
  },
})

export const { addNotification, updateNotification, setFilter, updateSettings, clearError } = notificationSlice.actions

export default notificationSlice.reducer
