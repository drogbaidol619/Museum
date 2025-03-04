import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CheckToken({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setIsAuthenticated(false);
        return;
      }
      // So sánh acces Token từ localStorage với backend
      try {
        await axios.get("http://localhost:3000/protected", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setIsAuthenticated(true);
        const isAdminValue = localStorage.getItem("isAdmin");
        setIsAdmin(JSON.parse(isAdminValue)); // người dùng là Admin (dạng boolean)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            const response = await axios.post(
              "http://localhost:3000/refresh-token"
            );

            const { accessToken: newAccessToken } = response.data;
            localStorage.setItem("accessToken", newAccessToken); // lưu trữ access token mới
            setIsAuthenticated(true);
          } catch (refreshError) {
            setIsAuthenticated(false);
            localStorage.removeItem("accessToken");
            Cookies.remove("refreshToken");
            navigate("/login");
          }
        } else {
          setIsAuthenticated(false);
          navigate("/login");
        }
      }
    };

    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (isAuthenticated && !isAdmin) {
    navigate("/login");
    return null;
  }

  return children;
}

export default CheckToken;
