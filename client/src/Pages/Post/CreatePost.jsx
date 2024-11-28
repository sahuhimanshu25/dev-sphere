import React, { useState } from "react";
import axios from "axios";
import "./CreatePost.css";
import { useSelector } from "react-redux";
function CreatePost({ onPostCreated }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {token}=useSelector((state)=>state.user)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error
    setError(null);

    // Validation: At least one input (text, image, or video) is required
    if (!text.trim() && !image && !video) {
      setError("Please provide either text, an image, or a video.");
      return;
    }

    // Validation: Prevent submitting both image and video
    if (image && video) {
      setError("You can only upload an image or a video, not both.");
      return;
    }

    // Prepare data for submission
    const formData = new FormData();
    if (text.trim()) formData.append("text", text.trim());
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    setIsSubmitting(true);
    try {
      // API request
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/post/post`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data",Authorization: `Bearer ${token}` }
        }
      );

      // Notify parent component and reset inputs
      onPostCreated(data);
      setText("");
      setImage(null);
      setVideo(null);
      setFile(null);
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        setImage(selectedFile);
        setVideo(null); // Ensure only one type of file is selected
        setFile(selectedFile);
      } else if (selectedFile.type.startsWith("video/")) {
        setVideo(selectedFile);
        setImage(null); // Ensure only one type of file is selected
        setFile(selectedFile);
      } else {
        setError("Only image or video files are allowed.");
        setFile(null);
        setImage(null);
        setVideo(null);
      }
    }
  };

  return (
    <div className="create-post">
      {error && <p className="error-message">{error}</p>}
      <textarea
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="post-textarea"
        maxLength={500} // Optional: Limit text length
        disabled={isSubmitting} // Prevent edits while submitting
      />
      <div>
        <label htmlFor="file-upload" className="file-label">
          {file ? file.name : "Choose image or video"}
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*, video/*"
          onChange={handleFileChange}
          className="file-input"
          disabled={isSubmitting} // Prevent file changes while submitting
        />
      </div>
      <button
        onClick={handleSubmit}
        className="post-button"
        disabled={isSubmitting} // Prevent multiple submissions
      >
        {isSubmitting ? "Posting..." : "Post"}
      </button>
    </div>
  );
}

export default CreatePost;
