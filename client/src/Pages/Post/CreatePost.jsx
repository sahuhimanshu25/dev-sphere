import React, { useState } from "react";
import axios from "axios";
import "./CreatePost.css";

function CreatePost({ onPostCreated }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text && !image && !video) {
      setError("Please provide either text, an image, or a video.");
      return;
    }

    const formData = new FormData();
    if (text) formData.append("text", text);
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/post/post`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      onPostCreated(data);
      setText("");
      setImage(null);
      setVideo(null);
      setFile(null);
      setError(null);
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        setImage(selectedFile);
        setVideo(null);
      } else if (selectedFile.type.startsWith("video/")) {
        setVideo(selectedFile);
        setImage(null);
      }
      setFile(selectedFile);
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
        />
      </div>
      <button onClick={handleSubmit} className="post-button">
        Post
      </button>
    </div>
  );
}

export default CreatePost;