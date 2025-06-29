import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import styles from "./page.module.css";
import SearchInput from "../component/SearchInput";
import { Search, SquarePen, Trash2, CirclePlus } from "lucide-react";
import formatDate from "../data/globalFunction"; // Import the formatDate function

const TABLE_HEADER = [
  "#",
  "Tanggal Keluar",
  "Nama Distributor",
  "Nama Barang",
  "Jenis Barang",
  "Jumlah",
  "Harga Jual/Satuan",
  "Total Harga",
];

export default function LapTK() {
  const [transaksi, setTransaksi] = useState([]);
  const [searchNamaBarang, setSearchNamaBarang] = useState("");
  const [searchTanggal, setSearchTanggal] = useState("");
  const [searchJenis, setSearchJenis] = useState("");
  const [searchDistributor, setSearchDistributor] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/join/laporan_transaksi_keluar"
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setTransaksi(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearch = async () => {
    let queryParams = [];
    if (searchNamaBarang) queryParams.push(`b.nama_barang=${searchNamaBarang}`);
    if (searchTanggal) queryParams.push(`tanggal_keluar=${searchTanggal}`);
    if (searchJenis) queryParams.push(`nama_kategori=${searchJenis}`);
    if (searchDistributor)
      queryParams.push(`nama_distributor=${searchDistributor}`);

    const queryString = queryParams.join("&");

    if (queryString) {
      const url = `http://localhost:3000/api/join/find/laporan_transaksi_keluar?${queryString}`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch filtered data");
        const data = await res.json();
        setTransaksi(data);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
    } else {
      await fetchProducts();
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles["product-page"]}>
      <h1>Laporan Barang Keluar</h1>
      <div className={styles["search-bar"]}>
        <SearchInput
          className={styles.searchLaporanDate}
          icon={Search}
          type="date"
          value={searchTanggal}
          onKeyDown={handleSearchKeyDown}
          onChange={(e) => setSearchTanggal(e.target.value)}
          placeholder="Tanggal Keluar"
        />
        <SearchInput
          icon={Search}
          type="text"
          value={searchNamaBarang}
          onChange={(e) => setSearchNamaBarang(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Nama Barang"
        />
        <SearchInput
          icon={Search}
          type="text"
          value={searchJenis}
          onChange={(e) => setSearchJenis(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Jenis Barang"
        />
        <SearchInput
          icon={Search}
          type="text"
          value={searchDistributor}
          onChange={(e) => setSearchDistributor(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Nama Distributor"
        />
        {/* <Form.Control
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
        /> */}
        <Button className="me-2" onClick={handleSearch}>
          Download
        </Button>
      </div>
      <Table responsive hover striped bordered>
        <thead>
          <tr>
            {TABLE_HEADER.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transaksi.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                Data tidak ditemukan.
              </td>
            </tr>
          ) : (
            transaksi.map((item, index) => (
              <tr key={item.id_transaksi_keluar}>
                <td>{index + 1}</td>
                <td>{formatDate(item.tanggal_keluar)}</td>
                <td>{item.nama_distributor}</td>
                <td>{item.nama_barang}</td>
                <td>{item.nama_kategori}</td>
                <td>{item.jumlah}</td>
                <td>{item.harga_jual}</td>
                <td>{item.Total_harga}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
