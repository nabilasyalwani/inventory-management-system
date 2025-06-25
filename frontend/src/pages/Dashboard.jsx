import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div id="dashboard-app">
      <div className="dashboard-wrapper">
        <div className="dashboard-text">
          <h4>Welcome to Management</h4>
          <h1>
            Toko <span>“Jaya Abadi”</span>
          </h1>
          <p className="layanan">
            Jual Beli Barang Elektronik dan Jasa Service
          </p>
          <p className="loc">
            Jl. Keputih, Kec. Sukolilo, Surabaya, Jawa Timur 60117
          </p>
        </div>
        <div className="dashboard-image">
          <img
            src="/src/assets/dashboard.png"
            alt="Shop Illustration"
            className="welcome-image welcome-image-float"
          />
        </div>
      </div>
    </div>
  );
}
