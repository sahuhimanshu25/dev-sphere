import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  userId: null,
}

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload
    },
  },
})

export const { setUserId } = postSlice.actions
export default postSlice.reducer
