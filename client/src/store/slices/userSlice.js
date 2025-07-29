import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Async thunks
export const fetchUserProfile = createAsyncThunk("user/fetchUserProfile", async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/user/profile${userId ? `/${userId}` : ""}`)
    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error.message)
    }
    return await response.json()
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const updateProfile = createAsyncThunk("user/updateProfile", async (profileData, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
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

export const fetchFriends = createAsyncThunk("user/fetchFriends", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/user/friends")
    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error.message)
    }
    return await response.json()
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const sendFriendRequest = createAsyncThunk("user/sendFriendRequest", async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/user/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: "request" }),
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

const initialState = {
  profile: null,
  friends: [],
  followers: [],
  following: [],
  friendRequests: [],
  sentRequests: [],
  blockedUsers: [],
  settings: {
    privacy: {
      profileVisibility: "public", // 'public', 'friends', 'private'
      showEmail: false,
      showOnlineStatus: true,
      allowFriendRequests: true,
    },
    notifications: {
      email: true,
      push: true,
      desktop: true,
      sound: true,
      friendRequests: true,
      messages: true,
      posts: true,
      comments: true,
    },
    preferences: {
      language: "en",
      timezone: "UTC",
      dateFormat: "MM/DD/YYYY",
      theme: "dark",
    },
  },
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      const { category, settings } = action.payload
      state.settings[category] = { ...state.settings[category], ...settings }
    },
    addFriend: (state, action) => {
      state.friends.push(action.payload)
      state.friendRequests = state.friendRequests.filter((req) => req.id !== action.payload.id)
    },
    removeFriend: (state, action) => {
      const userId = action.payload
      state.friends = state.friends.filter((friend) => friend.id !== userId)
    },
    blockUser: (state, action) => {
      const user = action.payload
      state.blockedUsers.push(user)
      state.friends = state.friends.filter((friend) => friend.id !== user.id)
      state.followers = state.followers.filter((follower) => follower.id !== user.id)
      state.following = state.following.filter((following) => following.id !== user.id)
    },
    unblockUser: (state, action) => {
      const userId = action.payload
      state.blockedUsers = state.blockedUsers.filter((user) => user.id !== userId)
    },
    followUser: (state, action) => {
      state.following.push(action.payload)
    },
    unfollowUser: (state, action) => {
      const userId = action.payload
      state.following = state.following.filter((user) => user.id !== userId)
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ...action.payload }
      })
      // Fetch friends
      .addCase(fetchFriends.fulfilled, (state, action) => {
        const { friends, followers, following, friendRequests, sentRequests } = action.payload
        state.friends = friends || []
        state.followers = followers || []
        state.following = following || []
        state.friendRequests = friendRequests || []
        state.sentRequests = sentRequests || []
      })
      // Send friend request
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.sentRequests.push(action.payload)
      })
  },
})

export const { updateSettings, addFriend, removeFriend, blockUser, unblockUser, followUser, unfollowUser, clearError } =
  userSlice.actions

export default userSlice.reducer
