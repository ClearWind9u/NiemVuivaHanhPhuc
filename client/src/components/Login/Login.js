import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // default role


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await response.json();
  
      if (response.ok) {
        login(data.role);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error logging in');
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
        backgroundImage: `url('../image/banner.png')`, // Update the path to your image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="login-form">
        <div style={{ margin: '50px' }}>
          <h2 className="text-center mb-4">JoHap Login Form</h2>
          <form onSubmit={handleSubmit}>
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
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
