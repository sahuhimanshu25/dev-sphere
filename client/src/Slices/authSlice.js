import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userData: null,
  error: null,
  isAuthorized: false,
  loading: false,
};

// Async action for signup
export const signup = createAsyncThunk("signup", async (userCredentials, { rejectWithValue }) => {
  try {
    console.log("Signup request config:", {
      url: `${axios.defaults.baseURL}/auth/register`,
      headers: axios.defaults.headers.common,
      withCredentials: axios.defaults.withCredentials,
    });
    const { data } = await axios.post(`/auth/register`, userCredentials, {
      withCredentials: true,
    });
    if (data.token) {
      localStorage.setItem("authToken", data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    }
    return data;
  } catch (err) {
    console.error("Signup error:", err.response?.data || err.message);
    return rejectWithValue(err.response?.data?.error || "Registration failed");
  }
});

// Async action for login
export const login = createAsyncThunk("login", async (userCredentials, { rejectWithValue }) => {
  try {
    console.log("Login request config:", {
      url: `${axios.defaults.baseURL}/auth/login`,
      headers: axios.defaults.headers.common,
      withCredentials: axios.defaults.withCredentials,
    });
    const { data } = await axios.post(`/auth/login`, userCredentials, {
      withCredentials: true,
    });
    if (data.token) {
      localStorage.setItem("authToken", data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    }
    return data;
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    return rejectWithValue(err.response?.data?.error || "Login failed");
  }
});

// Async action to check auth status
export const checkAuthStatus = createAsyncThunk(
  "checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      // console.log("CheckAuthStatus request config:", {
      //   url: `${axios.defaults.baseURL}/user/get-login-details`,
      //   headers: axios.defaults.headers.common,
      //   withCredentials: axios.defaults.withCredentials,
      // });
      const { data } = await axios.get(`/user/get-login-details`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken") || ""}` },
      });
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      }
      return data;
    } catch (err) {
      console.error("CheckAuthStatus error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.error || "Not authenticated");
    }
  }
);

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.userData = null;
      state.isAuthorized = false;
      state.error = null;
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
      console.log("Cleared auth state");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.user;
        state.isAuthorized = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.user;
        state.isAuthorized = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.user) {
          state.userData = action.payload.user;
          state.isAuthorized = true;
        } else {
          state.userData = null;
          state.isAuthorized = false;
        }
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.userData = null;
        state.isAuthorized = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;