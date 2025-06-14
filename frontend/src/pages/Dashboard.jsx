// import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="container">
      <aside className="sidebar">
        <h2 className="store-title">
          Toko <span className="highlight">Jaya Abadi</span>
        </h2>
        <div className="profile-circle"></div>
        <ul className="nav-links">
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/barangMasuk">Barang Masuk</Link>
          </li>
          <li>
            <Link to="/barangKeluar">Barang Keluar</Link>
          </li>
          <li>
            <Link to="/service">Service</Link>
          </li>
        </ul>
        <footer className="footer">FP MBD 2025</footer>
      </aside>

      <div className="main-content">
        <div className="welcome-section-vertical">
          <h4>Welcome to Management</h4>
          <h1>
            Toko <span>“Jaya Abadi”</span>
          </h1>
          <img
            src="/src/assets/ilustrasi.jpg"
            alt="Shop Illustration"
            className="welcome-image-vertical"
          />
        </div>
      </div>
    </div>
  );
}
