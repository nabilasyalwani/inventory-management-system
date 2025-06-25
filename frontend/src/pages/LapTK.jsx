import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import "./Service.module.css";

export default function LapTK() {
  const [service, setService] = useState([]);
  const [searchNamaBarang, setSearchNamaBarang] = useState("");
  const [searchTanggal, setSearchTanggal] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/transaksi_keluar");
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
      ? `http://localhost:3000/api/transaksi_keluar?${queryString}`
      : "http://localhost:3000/api/transaksi_keluar";

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
      <h1>Laporan Barang Keluar</h1>

      <div className="search-bar mb-4">
        <Button className="me-2" onClick={handleSearch}>
          Search
        </Button>
        <Form.Control
          type="date"
          className="me-2"
          style={{ display: "inline-block", width: "180px" }}
          value={searchTanggal}
          onChange={(e) => setSearchTanggal(e.target.value)}
        />
        <Form.Control
          type="text"
          placeholder="Nama Barang"
          className="me-2"
          style={{ display: "inline-block", width: "200px" }}
          value={searchNamaBarang}
          onChange={(e) => setSearchNamaBarang(e.target.value)}
        />
        <Form.Control
          type="text"
          placeholder="Jenis Barang"
          className="me-2"
          style={{ display: "inline-block", width: "200px" }}
          value={searchNamaBarang}
          onChange={(e) => setSearchNamaBarang(e.target.value)}
        />
        <Form.Control
          type="text"
          placeholder="Nama Distributor"
          className="me-2"
          style={{ display: "inline-block", width: "150px" }}
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        />
        <Form.Control
          type="text"
          placeholder="Total Pembelian"
          className="me-2"
          style={{ display: "inline-block", width: "150px" }}
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        />
        <Form.Control
          type="text"
          placeholder="Total Laba"
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
            <th>Tanggal Keluar</th>
            <th>Nama Distributor</th>
            <th>Nama Barang</th>
            <th>Jenis Barang</th>
            <th>Jumlah</th>
            <th>Harga Jual/Satuan</th>
            <th>Total Harga</th>
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
              <tr key={item.id_transaksi_keluar}>
                <td>{index + 1}</td>
                <td>{item.tanggal_keluar}</td>
                <td>{item.nama_distributor}</td>
                <td>{item.nama_barang}</td>
                <td>{item.jenis_barang}</td>
                <td>{item.jumlah}</td>
                <td>{item.harga_jual}</td>
                <td>{item.total_harga}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
