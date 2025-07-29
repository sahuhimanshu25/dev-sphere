import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Async thunks
export const executeCode = createAsyncThunk(
  "playground/executeCode",
  async ({ code, language, input }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/playground/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, input }),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.message)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const savePlayground = createAsyncThunk(
  "playground/savePlayground",
  async ({ id, code, language, title }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/playground/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, title }),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.message)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const initialState = {
  folders: [
    {
      id: "folder-1",
      name: "My Projects",
      playgrounds: [
        {
          id: "playground-1",
          title: "Hello World",
          language: "javascript",
          code: 'console.log("Hello, World!");',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
  ],
  currentPlayground: null,
  currentFolder: null,
  code: "",
  language: "javascript",
  input: "",
  output: "",
  isExecuting: false,
  isSaving: false,
  error: null,
  theme: "vs-dark",
  fontSize: 14,
  autoSave: true,
  lastSaved: null,
}

const playgroundSlice = createSlice({
  name: "playground",
  initialState,
  reducers: {
    setCode: (state, action) => {
      state.code = action.payload
      if (state.autoSave) {
        state.lastSaved = new Date().toISOString()
      }
    },
    setLanguage: (state, action) => {
      state.language = action.payload
    },
    setInput: (state, action) => {
      state.input = action.payload
    },
    setOutput: (state, action) => {
      state.output = action.payload
    },
    setCurrentPlayground: (state, action) => {
      state.currentPlayground = action.payload
      if (action.payload) {
        state.code = action.payload.code
        state.language = action.payload.language
      }
    },
    setCurrentFolder: (state, action) => {
      state.currentFolder = action.payload
    },
    createFolder: (state, action) => {
      state.folders.push({
        id: action.payload.id,
        name: action.payload.name,
        playgrounds: [],
      })
    },
    createPlayground: (state, action) => {
      const folder = state.folders.find((f) => f.id === action.payload.folderId)
      if (folder) {
        folder.playgrounds.push(action.payload.playground)
      }
    },
    updatePlayground: (state, action) => {
      const { folderId, playgroundId, updates } = action.payload
      const folder = state.folders.find((f) => f.id === folderId)
      if (folder) {
        const playground = folder.playgrounds.find((p) => p.id === playgroundId)
        if (playground) {
          Object.assign(playground, updates)
        }
      }
    },
    deletePlayground: (state, action) => {
      const { folderId, playgroundId } = action.payload
      const folder = state.folders.find((f) => f.id === folderId)
      if (folder) {
        folder.playgrounds = folder.playgrounds.filter((p) => p.id !== playgroundId)
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload
    },
    setAutoSave: (state, action) => {
      state.autoSave = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Execute code
      .addCase(executeCode.pending, (state) => {
        state.isExecuting = true
        state.error = null
      })
      .addCase(executeCode.fulfilled, (state, action) => {
        state.isExecuting = false
        state.output = action.payload.output
      })
      .addCase(executeCode.rejected, (state, action) => {
        state.isExecuting = false
        state.error = action.payload
        state.output = `Error: ${action.payload}`
      })
      // Save playground
      .addCase(savePlayground.pending, (state) => {
        state.isSaving = true
      })
      .addCase(savePlayground.fulfilled, (state, action) => {
        state.isSaving = false
        state.lastSaved = new Date().toISOString()
      })
      .addCase(savePlayground.rejected, (state, action) => {
        state.isSaving = false
        state.error = action.payload
      })
  },
})

export const {
  setCode,
  setLanguage,
  setInput,
  setOutput,
  setCurrentPlayground,
  setCurrentFolder,
  createFolder,
  createPlayground,
  updatePlayground,
  deletePlayground,
  setTheme,
  setFontSize,
  setAutoSave,
  clearError,
} = playgroundSlice.actions

export default playgroundSlice.reducer
