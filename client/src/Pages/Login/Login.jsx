import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../Slices/authSlice.js";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e, demoCredentials = null) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Add toast for server wakeup
    toast(
      <div className="custom-toast">
        <span className="toast-icon">⏳</span>
        <div>
          <strong>Waking up the server...</strong>
          <p>This may take up to 40 seconds. Thanks for your patience!</p>
        </div>
      </div>,
      {
        duration: 6000,
        position: 'top-center',
      }
    );

    const credentials = demoCredentials || { email, password };

    try {
      const result = await dispatch(login(credentials)).unwrap();
      if (result) {
        toast.success("Login Successful");
        console.log(result, "latest update 6.50");
        navigate('/post');
      }
    } catch (err) {
      toast.error(err || "Login failed. Please check your credentials.");
      console.error("LOGIN.JSX ERROR: ", err);
    } finally {
      setIsSubmitting(false);
    }
  };

const handleDemoLogin = (e) => {
  const demoCredentials = {
    email: import.meta.env.VITE_EMAIL,
    password: import.meta.env.VITE_PASSWORD
  };
  handleLogin(e, demoCredentials);
};

  return (
    <div className="log">
      <div className="login-container">
        <h2 className="login-title">
          <span>Log</span>
          <span>in</span>
        </h2>
        {loading && <Loader />}
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
                type={showPassword ? "text" : "password"} // Fixed type from "none" to "text"
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
          
          {/* Demo User Button */}
          <button
            type="button"
            className="login-button demo-button" // Add custom class for styling if needed
            onClick={handleDemoLogin}
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? "Logging in..." : "Login as Demo User"}
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