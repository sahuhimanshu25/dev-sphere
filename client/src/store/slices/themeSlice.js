import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  mode: "dark", // 'light' or 'dark'
  primaryColor: "blue",
  accentColor: "purple",
  fontSize: "medium", // 'small', 'medium', 'large'
  animations: true,
  compactMode: false,
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark"
    },
    setThemeMode: (state, action) => {
      state.mode = action.payload
    },
    setPrimaryColor: (state, action) => {
      state.primaryColor = action.payload
    },
    setAccentColor: (state, action) => {
      state.accentColor = action.payload
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload
    },
    toggleAnimations: (state) => {
      state.animations = !state.animations
    },
    toggleCompactMode: (state) => {
      state.compactMode = !state.compactMode
    },
    resetTheme: (state) => {
      return initialState
    },
  },
})

export const {
  toggleTheme,
  setThemeMode,
  setPrimaryColor,
  setAccentColor,
  setFontSize,
  toggleAnimations,
  toggleCompactMode,
  resetTheme,
} = themeSlice.actions

export default themeSlice.reducer
