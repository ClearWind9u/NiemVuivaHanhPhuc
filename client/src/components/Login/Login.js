import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Added state for name
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student"); // Default role
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false); // Toggle Reset Password
  const [resetToken, setResetToken] = useState(""); // OTP
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const API_URL = "https://joy-and-happiness-be.vercel.app";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      if (isForgotPassword) {
        // Send OTP
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        if (response.status === 200) {
          alert(`We've sent an OTP to your email. Don't forget to check your spam folder!`);
          setIsForgotPassword(false);
          setIsResetPassword(true);
        }
      } else if (isResetPassword) {
        // Reset Password
        if (newPassword !== confirmNewPassword) {
          setMessage("Passwords do not match!");
          return;
        }
        const response = await axios.post(`${API_URL}/reset-password`, {
          email,
          otp: resetToken,
          newPassword,
        });
        if (response.status === 200) {
          alert("Password reset successful! You can now log in.");
          setIsResetPassword(false);
        }
      } else if (isRegister) {
        // Register new user
        const response = await axios.post(`${API_URL}/register`, {
          username,
          password,
          name, // Include name in the request
          email,
          balance: 0,
          role,
        });
        if (response.status === 201) {
          alert("Registration successful! You can now log in.");
          setIsRegister(false);
        }
      } else {
        // Login
        const response = await axios.post(`${API_URL}/login`, {
          username,
          password,
          role,
        });
        const data = response.data;
        // Handle success
        localStorage.setItem("token", data.token); // Lưu token
        localStorage.setItem("userId", data.userId); // Lưu userId
        login(data.userId, data.role, data.avatar); // Gọi hàm login từ context
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div
      className="login-container"
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url('../image/banner.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="login-form">
        <div style={{ margin: "20px 40px" }}>
          <h2 className="text-center mb-4">
            {isResetPassword
              ? "Reset Password"
              : isForgotPassword
                ? "Forgot Password"
                : isRegister
                  ? "Register"
                  : "Login"}
          </h2>
          <form onSubmit={handleSubmit}>
            {isResetPassword ? (
              <>
                <div>
                  <label>
                    OTP:
                    <input
                      type="text"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div>
                  <label>
                    New Password:
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Confirm New Password:
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                  </label>
                </div>
              </>
            ) : isForgotPassword ? (
              <div>
                <label>
                  Email:
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
              </div>
            ) : (
              <>
                <div>
                  <label>
                    Username:
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </label>
                </div>
                {isRegister && (
                  <>
                    <div>
                      <label>
                        Name:
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Password:
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Email:
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Role:
                        <input
                          type="text"
                          value="Student"
                          readOnly
                          style={{ backgroundColor: "#f0f0f0", color: "#555" }}
                        />
                      </label>
                    </div>
                  </>
                )}
                {!isRegister && (
                  <>
                    <div>
                      <label>
                        Password:
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Role:
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                          <option value="student">Student</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                      </label>
                    </div>
                  </>
                )}
              </>
            )}
            <button type="submit">
              {isResetPassword
                ? "Reset Password"
                : isForgotPassword
                  ? "Send OTP"
                  : isRegister
                    ? "Register"
                    : "Login"}
            </button>
          </form>
          {message && <p style={{ color: "red" }}>{message}</p>}
          <button
            onClick={() => {
              if (isResetPassword) setIsResetPassword(false);
              else if (isForgotPassword) setIsForgotPassword(false);
              else setIsRegister(!isRegister);
            }}
            style={{ marginTop: "10px", display: "block", width: "100%" }}
          >
            {isResetPassword || isForgotPassword
              ? "Back to Login"
              : isRegister
                ? "Switch to Login"
                : "Switch to Register"}
          </button>
          {!isRegister && !isForgotPassword && !isResetPassword && (
            <button
              onClick={() => setIsForgotPassword(true)}
              style={{ marginTop: "10px", display: "block", width: "100%" }}
            >
              Forgot Password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
