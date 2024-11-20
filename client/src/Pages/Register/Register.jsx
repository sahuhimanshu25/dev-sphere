import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../Slices/authSlice.js";
import { useNavigate,Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPencilAlt } from "react-icons/fa"; 
import "./Register.css"; // Add CSS for the register page
import DefaultAvatar from "../../../public/userimg.jpg"; // Default avatar image
import axios from "axios";
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
  const [avatarPreview, setAvatarPreview] = useState(DefaultAvatar); // Default avatar image

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
          setAvatarPreview(reader.result); // Update preview
          setAvatar(file); // Save file for upload
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
      // const result = await dispatch(signup(completeData)).unwrap();
      const result =await axios.post("http://localhost:3000/user/register",completeData);
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
      <div className="reg-main-reg-cont">
        <div className="reg-avatar-section">
          <div className="reg-avatar-wrapper">
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="reg-avatar-preview"
            />
            <label htmlFor="avatarInput" className="reg-avatar-upload-label">
              <FaPencilAlt className="reg-avatar-pencil" />
            </label>
            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              onChange={handleAvatarChange}
              className="reg-avatar-input"
            />
          </div>
        </div>
        <div className="reg-register-container">
          <div className="reg-register-container-1"></div>
          <div className="reg-register-container-2">
            <h2 className="reg-register-title">
              <span>Regi</span>
              <span>ster</span>
            </h2>
            <form onSubmit={handleRegister} className="reg-register-form">
              <div className="reg-form-group">
                <label>
                  <span className="icon">👤</span>
                  <span className="icon-t">Username</span>
                </label>
                <input
                  // type="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  required
                  className="reg-register-input"
                />
              </div>
              <div className="reg-form-group">
                <label>
                  <span className="icon">📧</span>
                  <span className="icon-t">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="reg-register-input"
                />
              </div>
              <div className="form-group">
                <label>
                  <span className="icon">🔒</span>
                  <span className="icon-t">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="reg-register-input"
                />
              </div>
              <button
                type="submit"
                className="reg-register-button"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
              <div className="reg">
                <span>Already have an account? </span>
                <Link to={"/Login"}>Login</Link>
              </div>
            </form>
          </div>
          {error && <p className="reg-error-msg">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
