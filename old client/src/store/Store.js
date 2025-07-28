import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Slices/authSlice";
import postReducer from "../Slices/postSlice"; 
export const Store = configureStore({
  reducer: {
    user: authSlice,   
    post: postReducer 
  },
});
