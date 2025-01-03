import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [avatar, setAvatar] = useState(null);  // Thêm state avatar

  // Kiểm tra localStorage khi component tải lại
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");
    const storedAvatar = localStorage.getItem("avatar");  // Kiểm tra avatar từ localStorage

    if (storedUserId && storedRole) {
      setUserId(storedUserId);
      setRole(storedRole);
    }
    if (storedAvatar) {
      setAvatar(storedAvatar);  // Cập nhật avatar từ localStorage
    }
  }, []);

  const login = (userId, role, avatar) => {
    setUserId(userId);
    setRole(role);
    setAvatar(avatar);  // Lưu avatar khi login

    // Lưu vào localStorage
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", role);
    localStorage.setItem("avatar", avatar);  // Lưu avatar vào localStorage
  };

  const logout = () => {
    setUserId(null);
    setRole(null);
    setAvatar(null);  // Xóa avatar khi logout

    // Xóa thông tin trong localStorage khi logout
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("avatar");
  };

  return (
    <AuthContext.Provider value={{ role, userId, avatar, setAvatar, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
