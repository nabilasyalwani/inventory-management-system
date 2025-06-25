import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import "./Service.module.css";

export default function LapService() {
  const [service, setService] = useState([]);
  const [searchNamaBarang, setSearchNamaBarang] = useState("");
  const [searchTanggal, setSearchTanggal] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/service");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setService(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearch = async () => {
    let queryParams = [];
    if (searchNamaBarang) queryParams.push(`nama_barang=${searchNamaBarang}`);
    if (searchTanggal) queryParams.push(`tanggal_masuk=${searchTanggal}`);
    if (searchStatus) queryParams.push(`status=${searchStatus}`);

    const queryString = queryParams.join("&");
    const url = queryString
      ? `http://localhost:3000/api/service?${queryString}`
      : "http://localhost:3000/api/service";

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch filtered data");
      const data = await res.json();
      setService(data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  return (
    <div className="product-page">
      <h1>Laporan Service</h1>

      <div className="search-bar mb-4">
        <Button className="me-2" onClick={handleSearch}>
          Search
        </Button>
        <Form.Control
          type="date"
          placeholder="Tanggal Masuk"
          className="me-2"
          style={{ display: "inline-block", width: "180px" }}
          value={searchTanggal}
          onChange={(e) => setSearchTanggal(e.target.value)}
        />
        <Form.Control
          type="text"
          placeholder="Jenis Service"
          className="me-2"
          style={{ display: "inline-block", width: "200px" }}
          value={searchNamaBarang}
          onChange={(e) => setSearchNamaBarang(e.target.value)}
        />
        <Form.Control
          type="text"
          placeholder="Status"
          className="me-2"
          style={{ display: "inline-block", width: "150px" }}
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        />
        <Form.Control
          type="text"
          placeholder="Biaya Service"
          className="me-2"
          style={{ display: "inline-block", width: "150px" }}
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        />
        <Button className="me-2" onClick={handleSearch}>
          Download
        </Button>
      </div>

      <Table responsive bordered hover striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Tanggal Masuk</th>
            <th>Tanggal Keluar</th>
            <th>Nama Barang</th>
            <th>Jenis Barang</th>
            <th>Biaya Service</th>
            <th>Nama Petugas</th>
            <th>Status</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {service.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                Data tidak ditemukan.
              </td>
            </tr>
          ) : (
            service.map((item, index) => (
              <tr key={item.id_service}>
                <td>{index + 1}</td>
                <td>{item.tanggal_masuk}</td>
                <td>{item.tanggal_keluar || "-"}</td>
                <td>{item.nama_barang}</td>
                <td>{item.jenis_barang}</td>
                <td>{item.biaya_service}</td>
                <td>{item.nama_petugas}</td>
                <td>{item.status}</td>
                <td>{item.keterangan}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
