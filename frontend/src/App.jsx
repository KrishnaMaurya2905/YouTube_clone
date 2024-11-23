import axios from "axios";
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Pages/Home";
import RegistrationForm from "./Pages/RegisterForm";
import LoginForm from "./Pages/LoginForm";

const App = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get("/users/isUserLoggedIn");
        if (response.data.success) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking login status", error);
        setIsLoggedIn(false);
        navigate("/login");
      }
    };
    checkLogin();
  }, [navigate]);

  if (isLoggedIn === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden">
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </div>
  );
};

export default App;
