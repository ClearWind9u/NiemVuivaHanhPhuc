import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false); // Toggle Reset Password
  const [resetToken, setResetToken] = useState(''); // OTP
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isForgotPassword) {
        // Gửi OTP
        const response = await fetch('http://localhost:5000/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          alert('OTP has been sent to your email!');
          setIsForgotPassword(false);
          setIsResetPassword(true);
        } else {
          setMessage(data.message);
        }
      } else if (isResetPassword) {
        // Kiểm tra OTP và đặt lại mật khẩu
        if (newPassword !== confirmNewPassword) {
          setMessage('Passwords do not match!');
          return;
        }

        const response = await fetch('http://localhost:5000/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, otp: resetToken, newPassword }),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Password reset successful! You can now log in.');
          setIsResetPassword(false);
        } else {
          setMessage(data.message);
        }
      } else {
        // Handle Login or Register
        const url = isRegister ? 'http://localhost:5000/register' : 'http://localhost:5000/login';
        const payload = isRegister
          ? { username, password, email, role: 'student' }
          : { username, password, role };

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          if (isRegister) {
            alert('Registration successful! You can now log in.');
            setIsRegister(false);
          } else {
            login(data.role);
          }
        } else {
          setMessage(data.message);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred');
    }
  };

  return (
    <div
      className="login-container"
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url('../image/banner.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="login-form">
        <div style={{ margin: '50px' }}>
          <h2 className="text-center mb-4">
            {isResetPassword
              ? 'Reset Password'
              : isForgotPassword
              ? 'Forgot Password'
              : isRegister
              ? 'Register'
              : 'Login'}
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
                )}
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
                    {isRegister ? (
                      <input type="text" value="Student" disabled />
                    ) : (
                      <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="student">Student</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </label>
                </div>
              </>
            )}
            <button type="submit">
              {isResetPassword
                ? 'Reset Password'
                : isForgotPassword
                ? 'Send OTP'
                : isRegister
                ? 'Register'
                : 'Login'}
            </button>
          </form>
          {message && <p style={{ color: 'red' }}>{message}</p>}
          <button
            onClick={() => {
              if (isResetPassword) setIsResetPassword(false);
              else if (isForgotPassword) setIsForgotPassword(false);
              else setIsRegister(!isRegister);
            }}
            style={{ marginTop: '10px', display: 'block', width: '100%' }}
          >
            {isResetPassword || isForgotPassword
              ? 'Back to Login'
              : isRegister
              ? 'Switch to Login'
              : 'Switch to Register'}
          </button>
          {!isRegister && !isForgotPassword && !isResetPassword && (
            <button
              onClick={() => setIsForgotPassword(true)}
              style={{ marginTop: '10px', display: 'block', width: '100%' }}
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
