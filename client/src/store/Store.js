import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Slices/authSlice.js";
export const Store = configureStore({
  reducer: { user: authSlice },
});
