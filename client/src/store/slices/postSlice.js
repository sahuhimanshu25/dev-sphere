import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Async thunks
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ page = 1, limit = 10, filter = "all" }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/posts?page=${page}&limit=${limit}&filter=${filter}`)
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

export const createPost = createAsyncThunk("posts/createPost", async (postData, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    })

    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error.message)
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const likePost = createAsyncThunk("posts/likePost", async (postId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/posts/${postId}/like`, {
      method: "POST",
    })

    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error.message)
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const addComment = createAsyncThunk("posts/addComment", async ({ postId, content }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })

    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error.message)
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const initialState = {
  posts: [],
  trendingTopics: [],
  currentPage: 1,
  totalPages: 1,
  hasMore: true,
  loading: false,
  error: null,
  filter: "all", // 'all', 'following', 'trending'
  searchQuery: "",
  selectedPost: null,
}

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload
      state.posts = []
      state.currentPage = 1
      state.hasMore = true
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload
    },
    updatePost: (state, action) => {
      const { postId, updates } = action.payload
      const postIndex = state.posts.findIndex((p) => p.id === postId)
      if (postIndex !== -1) {
        state.posts[postIndex] = { ...state.posts[postIndex], ...updates }
      }
    },
    deletePost: (state, action) => {
      const postId = action.payload
      state.posts = state.posts.filter((p) => p.id !== postId)
    },
    addCommentToPost: (state, action) => {
      const { postId, comment } = action.payload
      const post = state.posts.find((p) => p.id === postId)
      if (post) {
        if (!post.comments) post.comments = []
        post.comments.push(comment)
        post.commentCount = (post.commentCount || 0) + 1
      }
    },
    toggleLike: (state, action) => {
      const { postId, isLiked, likeCount } = action.payload
      const post = state.posts.find((p) => p.id === postId)
      if (post) {
        post.isLiked = isLiked
        post.likeCount = likeCount
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false
        const { posts, currentPage, totalPages, hasMore } = action.payload

        if (currentPage === 1) {
          state.posts = posts
        } else {
          state.posts = [...state.posts, ...posts]
        }

        state.currentPage = currentPage
        state.totalPages = totalPages
        state.hasMore = hasMore
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create post
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload)
      })
      // Like post
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, isLiked, likeCount } = action.payload
        const post = state.posts.find((p) => p.id === postId)
        if (post) {
          post.isLiked = isLiked
          post.likeCount = likeCount
        }
      })
      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        const comment = action.payload
        const post = state.posts.find((p) => p.id === comment.postId)
        if (post) {
          if (!post.comments) post.comments = []
          post.comments.push(comment)
          post.commentCount = (post.commentCount || 0) + 1
        }
      })
  },
})

export const {
  setFilter,
  setSearchQuery,
  setSelectedPost,
  updatePost,
  deletePost,
  addCommentToPost,
  toggleLike,
  clearError,
} = postSlice.actions

export default postSlice.reducer
