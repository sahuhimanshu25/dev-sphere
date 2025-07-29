import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
  userData: null,
  token: null,
  error: null,
  isAuthorized: false,
  loading: false,
  emailVerified: false,
}

// Async action for signup with email verification
const signup = createAsyncThunk("signup", async (userCredentials, { rejectWithValue }) => {
  try {
    console.log(userCredentials)

    const { data } = await axios.post(`${process.env.VITE_BACKEND_BASEURL}/auth/register`, userCredentials, {
      withCredentials: true,
    })
    return data
  } catch (err) {
    if (err.response) {
      return rejectWithValue(err.response.data.message || err.response.data.error)
    } else if (err.request) {
      return rejectWithValue("No response from server. Please try again.")
    } else {
      return rejectWithValue("An unexpected error occurred.")
    }
  }
})

const login = createAsyncThunk("login", async (userCredentials, { rejectWithValue }) => {
  try {
    console.log(process.env.VITE_BACKEND_BASEURL);
    
    const result = await axios.post(`${process.env.NEXT_PUBLIC__BACKEND_BASEURL}/auth/login`, userCredentials, {
      withCredentials: true,
    })
    return result.data
  } catch (err) {
    console.error("Error in login thunk:", err)
    if (err.response) {
      return rejectWithValue(err.response.data.message || err.response.data.error)
    } else if (err.request) {
      return rejectWithValue("No response from server. Please try again.")
    } else {
      return rejectWithValue("An unexpected error occurred.")
    }
  }
})

// Async action for email verification
const verifyEmail = createAsyncThunk("verifyEmail", async (token, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(
      `${process.env.VITE_BACKEND_BASEURL}/auth/verify-email`,
      { token },
      {
        withCredentials: true,
      },
    )
    return data
  } catch (err) {
    if (err.response) {
      return rejectWithValue(err.response.data.message || err.response.data.error)
    } else {
      return rejectWithValue("Email verification failed.")
    }
  }
})

// Async action for resending verification email
const resendVerificationEmail = createAsyncThunk("resendVerificationEmail", async (email, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(
      `${process.env.VITE_BACKEND_BASEURL}/auth/resend-verification`,
      { email },
      {
        withCredentials: true,
      },
    )
    return data
  } catch (err) {
    if (err.response) {
      return rejectWithValue(err.response.data.message || err.response.data.error)
    } else {
      return rejectWithValue("Failed to resend verification email.")
    }
  }
})

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    logout: (state) => {
      state.userData = null
      state.token = null
      state.isAuthorized = false
      state.emailVerified = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup cases
      .addCase(signup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false
        // Don't set user as authorized until email is verified
        state.userData = action.payload.user
        state.emailVerified = action.payload.user?.emailVerified || false
        state.isAuthorized = action.payload.user?.emailVerified || false
        if (action.payload.token) {
          state.token = action.payload.token
        }
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.userData = action.payload.user
        state.token = action.payload.token
        state.emailVerified = action.payload.user?.emailVerified || false
        state.isAuthorized = action.payload.user?.emailVerified || false
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
      // Email verification cases
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false
        state.emailVerified = true
        state.isAuthorized = true
        if (state.userData) {
          state.userData.emailVerified = true
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
      // Resend verification email cases
      .addCase(resendVerificationEmail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
  },
})

export const { clearError, logout } = authSlice.actions
export { signup, login, verifyEmail, resendVerificationEmail }
export default authSlice.reducer
