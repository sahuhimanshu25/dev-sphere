import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../Slices/authSlice.js"; // import the login async thunk
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader.jsx"; // A simple loader component

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Local loader state for button-specific loading
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Show button loader during request

    try {
      const result = await dispatch(login({ email, password })).unwrap();
      if (result) {
        toast.success("Login Successful");

        console.log(result,"latest update 6.50");
        
        navigate('/post'); // Navigate only after successful login


      }
    } catch (err) {
      toast.error(err || "Login failed. Please check your credentials.");
      console.error("LOGIN.JSX ERROR: ", err);
    } finally {
      setIsSubmitting(false); // Hide button loader after request
    }
  };

  return (
    <div className="log">
      <div className="login-container">
        <h2 className="login-title">
          <span>Log</span>
          <span>in</span>
        </h2>
        {loading && <Loader />} {/* Show global loader if `loading` is true */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>
              <span className="icon">📧</span>
              <span className="icon-t">Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="login-input"
            />
          </div>
          <div className="form-group">
            <label>
              <span className="icon">🔒</span>
              <span className="icon-t">Password</span>
            </label>
            <div className="password-container">
              <input
                type={showPassword ? "none" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="login-input"
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting || loading} 
          >
            {isSubmitting || loading ? "Logging in..." : "Login"}
          </button>

          <div className="reg">
            <span>Don't have an account? </span>
            <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
