
import { useState, useCallback } from "react"
import axios from "axios"
import "./CreatePost.css"
import { useSelector } from "react-redux"
import { FaImage, FaVideo, FaPaperPlane } from "react-icons/fa"

function CreatePost({ onPostCreated }) {
  const [text, setText] = useState("")
  const [image, setImage] = useState(null)
  const [video, setVideo] = useState(null)
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { token } = useSelector((state) => state.user)

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()

      setError(null)

      if (!text.trim() && !image && !video) {
        setError("Please provide either text, an image, or a video.")
        return
      }

      if (image && video) {
        setError("You can only upload an image or a video, not both.")
        return
      }

      const formData = new FormData()
      if (text.trim()) formData.append("text", text.trim())
      if (image) formData.append("image", image)
      if (video) formData.append("video", video)

      setIsSubmitting(true)
      try {
        const { data} = await axios.post(`/post/post`, formData, {
          withCredentials:true
        })

        onPostCreated(data.data)
        setText("")
        setImage(null)
        setVideo(null)
        setFile(null)
      } catch (error) {
        console.error("Error creating post:", error)
        setError("Failed to create post. Please try again later.")
      } finally {
        setIsSubmitting(false)
      }
    },
    [text, image, video, token, onPostCreated]
  )

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        setImage(selectedFile)
        setVideo(null)
        setFile(selectedFile)
      } else if (selectedFile.type.startsWith("video/")) {
        setVideo(selectedFile)
        setImage(null)
        setFile(selectedFile)
      } else {
        setError("Only image or video files are allowed.")
        setFile(null)
        setImage(null)
        setVideo(null)
      }
    }
  }, [])

  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <h3>Share your thoughts</h3>
      </div>

      <div className="create-post-form">
        {error && <div className="error-message">{error}</div>}

        <textarea
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="post-textarea"
          maxLength={500}
          disabled={isSubmitting}
        />

        <div className="file-upload-section">
          <input
            id="file-upload"
            type="file"
            accept="image/*, video/*"
            onChange={handleFileChange}
            className="file-input"
            disabled={isSubmitting}
          />

          <div className="upload-actions">
            <label htmlFor="file-upload" className="file-label">
              {file ? (
                <span className="file-selected">
                  {file.type.startsWith("image/") ? <FaImage /> : <FaVideo />}
                  {file.name}
                </span>
              ) : (
                <span className="file-placeholder">
                  <FaImage />
                  Add media
                </span>
              )}
            </label>

            <button onClick={handleSubmit} className="post-button" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="posting">Posting...</span>
              ) : (
                <span className="post-text">
                  <FaPaperPlane />
                  Post
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost