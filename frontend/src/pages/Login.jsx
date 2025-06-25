import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { loginFields } from "../data/AuthFields";
import styles from "./login.module.css";

export default function Login() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      if (!res.ok) throw new Error("Failed to login");
      const result = await res.json();
      console.log("Login successful:", result);
      localStorage.setItem("isLogedIn", true);
      setLoginData({ username: "", password: "" });
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
    console.log("Login form submitted");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    setLoginData({ username: "", password: "" });
  }, []);

  return (
    <div className={styles["auth-container"]}>
      <div className={styles["auth-box"]}>
        <h2>Welcome Back!</h2>
        <form>
          {loginFields.map((field) => (
            <React.Fragment key={field.name}>
              <label>{field.label}</label>
              <input
                name={field.name}
                value={loginData[field.name]}
                type={field.type}
                placeholder={field.placeholder}
                required
                onChange={handleChange}
              />
            </React.Fragment>
          ))}
          <button
            type="submit"
            className={styles["custom-btn"]}
            onClick={handleLogin}>
            Log In
          </button>
        </form>
        <p className={styles["switch-text"]}>
          Belum punya akun? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
