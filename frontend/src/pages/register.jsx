import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { registerFields } from "../data/AuthFields";

export default function Register() {
  const [registerData, setregisterData] = useState({
    username: "",
    password: "",
    nama_petugas: "",
  });

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      if (!res.ok) throw new Error("Failed to register");
      const result = await res.json();
      console.log("register successful:", result);
      setregisterData({ username: "", password: "", nama_petugas: "" });
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
    }
    console.log("register form submitted");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setregisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    setregisterData({ username: "", password: "", nama_petugas: "" });
  }, []);

  return (
    <div className={styles["auth-container"]}>
      <div className={styles["auth-box"]}>
        <h2>Sign Up!</h2>
        <form>
          {registerFields.map((field) => (
            <React.Fragment key={field.name}>
              <label>{field.label}</label>
              <input
                name={field.name}
                value={registerData[field.name]}
                type={field.type}
                placeholder={field.placeholder}
                required
                onChange={handleChange}
              />
            </React.Fragment>
          ))}
          <button
            type="submit"
            onClick={handleRegister}
            className={styles["custom-btn"]}>
            Sign Up
          </button>
          <p className={styles["switch-text"]}>
            Sudah punya akun? <Link to="/login">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
