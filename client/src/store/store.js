"use client"
import { configureStore } from "@reduxjs/toolkit"
import authSlice from "../slices/authSlice"
import postReducer from "../slices/postSlice"

export const Store = configureStore({
  reducer: {
    user: authSlice,
    post: postReducer,
  },
})
