import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  // Kiểm tra localStorage khi component tải lại
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");

    if (storedUserId && storedRole) {
      setUserId(storedUserId);
      setRole(storedRole);
    }
  }, []);

  const login = (userId, role) => {
    setUserId(userId);
    setRole(role);

    // Lưu vào localStorage
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", role);
  };

  const logout = () => {
    setUserId(null);
    setRole(null);

    // Xóa thông tin trong localStorage khi logout
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);