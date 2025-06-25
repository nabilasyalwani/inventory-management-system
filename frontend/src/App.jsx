import { Routes, Route, useLocation } from "react-router-dom";
import NavbarComponent from "./component/NavbarComponent";

import Login from "./pages/Login";
import Register from "./pages/register";
import ProductPage from "./pages/ProductPage";
import Dashboard from "./pages/Dashboard";
import BarangMasuk from "./pages/BarangMasuk";
import BarangKeluar from "./pages/BarangKeluar";
import Service from "./pages/service";
import SupplierPage from "./pages/Supplier";
import LapService from "./pages/LapService";
import LapTM from "./pages/LapTM";
import LapTK from "./pages/LapTK";
import Petugas from "./pages/Petugas";
import DistributorPage from "./pages/Pelanggan";

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <NavbarComponent />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/productPage" element={<ProductPage />} />
        <Route path="/barangMasuk" element={<BarangMasuk />} />
        <Route path="/barangKeluar" element={<BarangKeluar />} />
        <Route path="/service" element={<Service />} />
        <Route path="/distributor" element={<DistributorPage />} />
        <Route path="/supplier" element={<SupplierPage />} />
        <Route path="/lapService" element={<LapService />} />
        <Route path="/lapTM" element={<LapTM />} />
        <Route path="/lapTK" element={<LapTK />} />
        <Route path="/petugas" element={<Petugas />} />
      </Routes>
    </>
  );
}

export default App;
