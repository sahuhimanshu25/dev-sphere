import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  isOpen: false,
  type: null,
  data: null,
  title: "",
  size: "md", // sm, md, lg, xl
}

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true
      state.type = action.payload.type
      state.data = action.payload.data || null
      state.title = action.payload.title || ""
      state.size = action.payload.size || "md"
    },
    closeModal: (state) => {
      state.isOpen = false
      state.type = null
      state.data = null
      state.title = ""
      state.size = "md"
    },
    updateModalData: (state, action) => {
      state.data = { ...state.data, ...action.payload }
    },
  },
})

export const { openModal, closeModal, updateModalData } = modalSlice.actions
export default modalSlice.reducer
