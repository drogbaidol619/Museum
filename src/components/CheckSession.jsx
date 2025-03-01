import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CheckSession({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/check-session",
          {},
          { withCredentials: true }
        );
        setIsAuthenticated(response.data.verified);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Hoặc một component loading khác
  }
  if (!isAuthenticated) {
    return children; // Hoặc một component loading khác
  }
  if (isAuthenticated === true) {
    return children;
  }
}
export default CheckSession;
