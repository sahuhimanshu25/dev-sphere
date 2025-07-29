// authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userData: null,
  token: null,
  error: null,
  isAuthorized: false,
  loading: false,
};

// Async actions
export const signup = createAsyncThunk(
  "auth/signup",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/auth/register`,
        userCredentials,
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userCredentials, { rejectWithValue }) => {
    try {
      console.log(process.env.NEXT_PUBLIC_BACKEND_BASEURL);
      
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/auth/login`,
        userCredentials,
        { withCredentials: true }
      );
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message
      );
    }
  }
);

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found");

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/auth/verify`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      localStorage.removeItem("token");
      return rejectWithValue(
        error.response?.data?.error || error.message
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("token");
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload };
      }
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
        state.token = action.payload.token;
        state.isAuthorized = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.user;
        state.token = action.payload.token;
        state.isAuthorized = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.user;
        state.token = action.payload.token;
        state.isAuthorized = true;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthorized = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.userData = null;
        state.token = null;
        state.isAuthorized = false;
      });
  },
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;