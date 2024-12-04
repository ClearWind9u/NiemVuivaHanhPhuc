import axios from "axios";
import React, { useEffect, useState } from "react";
import { Tooltip } from 'react-tooltip';
import { useAuth } from "../../context/AuthContext";
import './Header.css';

const Header = () => {
    const { userId } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const getUserInfo = async (userId) => {
        try {
          const response = await axios.get(`http://localhost:8000/user/${userId}`, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          return response.data; // Trả về dữ liệu user
        } catch (error) {
          console.error("Error fetching user data:", error);
          return null; // Xử lý lỗi bằng cách trả về null
        }
      };
    
      useEffect(() => {
        const fetchUserInfo = async () => {
          const data = await getUserInfo(userId);
          if (data) {
            setUserInfo(data);
          } else {
            console.error("Failed to fetch user info.");
          }
        };
        if (userId) {
          fetchUserInfo();
        }
      }, [userId]);

    return (
        <header className="header-section">
            <div className="logo">
                <img src="../image/logo2.png" alt="JoHap" style={{ width: '150px', height: '90px' }} />
            </div>
            <Tooltip anchorSelect=".logo" place="right"> Joy and Happiness Canteen </Tooltip>
            <div className="avatar">
                <img src={userInfo?.avatar || "../image/avatar.jpg"} // Dùng avatar nếu có, không thì dùng mặc định
                    alt="User Avatar" />
            </div>
        </header>
    );
};

export default Header;