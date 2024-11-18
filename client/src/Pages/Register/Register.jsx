import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../Slices/authSlice.js";
import "./Register.css"; // Add CSS for the register page
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/profile.png"); // Default image path

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!avatar) {
      toast.error("Please upload an avatar.");
      return;
    }

    const completeData = new FormData();
    completeData.append("username", formData.username);
    completeData.append("email", formData.email);
    completeData.append("password", formData.password);
    completeData.append("avatar", avatar);

    try {
      // Wait for the signup action to complete
      const result = await dispatch(signup(completeData)).unwrap(); // Using `unwrap` to wait for the action's result
      if (result) {
        toast.success("Registration Successful. Please login.");
        navigate("/login"); // Navigate to login page after successful signup
      }
    } catch (err) {
      toast.error("Registration failed. Please try again.");
      console.error("REGISTER.JSX ERROR: ", err);
    }
  };

  return (
    <div className="register">
      <div className="register-container">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleRegister} className="register-form">
          <div className="avatar-section">
            <img src={avatarPreview} alt="Avatar Preview" className="avatar-preview" />
            <label htmlFor="avatarInput" className="avatar-upload-label">
              Choose Avatar
            </label>
            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              onChange={handleAvatarChange}
              className="avatar-input"
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              required
              className="register-input"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              className="register-input"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              className="register-input"
            />
          </div>
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
};

export default RegisterPage;
