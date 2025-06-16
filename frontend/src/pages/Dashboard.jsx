import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function ProductPage() {
  return (
    <div id="dashboard-app">
      <div className="container">
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
            <div className="button-group">
              <Link to="/barangMasuk" className="dashboard-button masuk">
                Barang Masuk
              </Link>
              <Link to="/barangKeluar" className="dashboard-button keluar">
                Barang Keluar
              </Link>
              <Link to="/service" className="dashboard-button service">
                Service
              </Link>
              <Link to="/productPage" className="dashboard-button barang">
                Barang
              </Link>
              <Link to="/pelanggan" className="dashboard-button pelanggan">
                Pelanggan
              </Link>
              <Link to="/supplier" className="dashboard-button supplier">
                Supplier
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
