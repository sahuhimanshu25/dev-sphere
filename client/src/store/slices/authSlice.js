import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Async thunks
export const loginUser = createAsyncThunk("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    console.log("login req sent #############")
    const response = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error.message)
    }

    const data = await response.json()
    localStorage.setItem("token", data.token)
    return data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.message)
      }

      const data = await response.json()
      localStorage.setItem("token", data.token)
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    await fetch("/api/auth/logout", { method: "POST" })
    localStorage.removeItem("token")
    return null
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const verifyToken = createAsyncThunk("auth/verifyToken", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token")
    if (!token) return rejectWithValue("No token found")

    const response = await fetch("/api/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
      localStorage.removeItem("token")
      return rejectWithValue("Invalid token")
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
      // Verify
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.user = action.payload.user
      })
      .addCase(verifyToken.rejected, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
  },
})

export const { clearError, updateUser } = authSlice.actions
export default authSlice.reducer
