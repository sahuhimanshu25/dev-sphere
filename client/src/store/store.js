import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import playgroundReducer from "./slices/playgroundSlice";
import modalReducer from "./slices/modalSlice";
import themeReducer from "./slices/themeSlice";
import chatReducer from "./slices/chatSlice";
import postReducer from "./slices/postSlice";
import userReducer from "./slices/userSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    playground: playgroundReducer,
    modal: modalReducer,
    theme: themeReducer,
    chat: chatReducer,
    posts: postReducer,
    user: userReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

// For JavaScript usage, you can access the types like this:
// const state = store.getState(); // RootState equivalent
// const dispatch = store.dispatch; // AppDispatch equivalent