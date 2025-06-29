import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import styles from "./page.module.css";
import SearchInput from "../component/SearchInput";
import { Search, SquarePen, Trash2, CirclePlus } from "lucide-react";
import formatDate from "../data/globalFunction"; // Import the formatDate function

const TABLE_HEADER = [
  "#",
  "Tanggal Masuk",
  "Tanggal Keluar",
  "Nama Barang",
  "Jenis Barang",
  "Biaya Service",
  "Nama Petugas",
  "Status",
  "Keterangan",
];

export default function LapService() {
  const [service, setService] = useState([]);
  const [searchNamaBarang, setSearchNamaBarang] = useState("");
  const [searchJenisBarang, setSearchJenisBarang] = useState("");
  const [searchTanggal, setSearchTanggal] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/join/laporan_service");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setService(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearch = async () => {
    let queryParams = [];
    if (searchNamaBarang) queryParams.push(`s.nama_barang=${searchNamaBarang}`);
    if (searchTanggal) queryParams.push(`s.tanggal_masuk=${searchTanggal}`);
    if (searchStatus) queryParams.push(`s.status=${searchStatus}`);
    if (searchJenisBarang)
      queryParams.push(`s.jenis_barang=${searchJenisBarang}`);

    const queryString = queryParams.join("&");

    if (queryString) {
      const url = `http://localhost:3000/api/join/find/laporan_service?${queryString}`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch filtered data");
        const data = await res.json();
        setService(data);
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
      <h1>Laporan Service</h1>

      <div className={styles["search-bar"]}>
        <SearchInput
          className={styles.searchLaporanDate}
          icon={Search}
          type="date"
          value={searchTanggal}
          onKeyDown={handleSearchKeyDown}
          onChange={(e) => setSearchTanggal(e.target.value)}
          placeholder="Tanggal Masuk"
        />
        <SearchInput
          icon={Search}
          type="text"
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Status"
        />
        <SearchInput
          icon={Search}
          type="text"
          value={searchJenisBarang}
          onChange={(e) => setSearchJenisBarang(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Jenis Barang"
        />
        <SearchInput
          icon={Search}
          type="text"
          value={searchNamaBarang}
          onChange={(e) => setSearchNamaBarang(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Nama Barang"
        />
        <Button className="me-2" onClick={handleSearch}>
          Download
        </Button>
      </div>

      <Table responsive bordered hover striped>
        <thead>
          <tr>
            {TABLE_HEADER.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
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
                <td colSpan="1">{index + 1}</td>
                <td colSpan="1">{formatDate(item.tanggal_masuk)}</td>
                <td colSpan="1">{formatDate(item.tanggal_keluar) || "-"}</td>
                <td colSpan="1">{item.nama_barang}</td>
                <td colSpan="1">{item.jenis_barang}</td>
                <td colSpan="1">{item.biaya_service}</td>
                <td colSpan="1">{item.nama_petugas}</td>
                <td colSpan="1">{item.status}</td>
                <td
                  style={{
                    maxWidth: "200px",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                  }}>
                  {item.keterangan || "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
