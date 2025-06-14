import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ProductPage from "./pages/ProductPage";
import Dashboard from "./pages/Dashboard";
import BarangMasuk from "./pages/BarangMasuk";
import BarangKeluar from "./pages/BarangKeluar";
import Service from "./pages/service";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/productPage" element={<ProductPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/barangMasuk" element={<BarangMasuk />} />
      <Route path="/barangKeluar" element={<BarangKeluar />} />
      <Route path="/service" element={<Service />} />
      {/* Add more routes as needed */}
    </Routes>
  </BrowserRouter>
);
