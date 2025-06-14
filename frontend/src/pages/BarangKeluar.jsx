import React, { useState, useEffect } from "react";
import "./BarangMasuk.css";

const TABLE_HEADER = [
  "ID Transaksi", //id barang masuk
  "ID Petugas",
  "ID pelanggan",
  "Tanggal",
  "ID Barang", //dari tabel barang
  "ID Kategori", //dari tabel barang
  "Harga Jual/item", //dari tabel barang
  "Jumlah", //dari tabel detail_barang_masuk
  "Total Harga", // harga * jumlah
];

export default function BarangKeluar() {
  const [barang, setBarang] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchIDBarang, setSearchIDBarang] = useState("");
  const [searchIDTransaksi, setSearchIDTransaksi] = useState("");
  const [searchIDKategori, setSearchIDKategori] = useState("");
  const [searchTanggal, setSearchTanggal] = useState("");
  const [formData, setFormData] = useState({
    id_transaksi: "",
    id_petugas: "",
    id_pelanggan: "",
    tanggal_keluar: "",
    id_barang: "",
    jumlah: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/join/transaksi_barang_keluar"
      ); //tabel combined?

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      setBarang(data);
      console.log("Fetched products:", data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  //
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearch = async () => {
    let searchString = "";
    if (searchIDBarang) {
      searchString += `b.id_barang=${searchIDBarang}&`;
    }
    if (searchIDTransaksi) {
      searchString += `bk.id_barang_keluar=${searchIDTransaksi}&`;
    }
    if (searchIDKategori) {
      searchString += `b.id_kategori=${searchIDKategori}&`;
    }
    if (searchTanggal) {
      searchString += `bk.tanggal_keluar=${searchTanggal}&`;
    }

    console.log(searchTanggal);

    if (searchString === "") {
      console.warn("No search criteria provided, fetching all products.");
      fetchProducts();
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/api/join/find/transaksi_barang_keluar?" +
          searchString
      );
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await res.json();
      setBarang(data);
      console.log("Fetched products:", data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddService = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/barang_keluar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }
      const newEntry = await response.json();
      setBarang([...barang, newEntry]);
      setShowModal(false);
      setFormData({
        id_transaksi: "",
        id_petugas: "",
        id_pelanggan: "",
        tanggal_keluar: "",
        id_barang: "",
        jumlah: "",
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const z = (n) => (n < 10 ? "0" : "") + n; // Menambahkan nol di depan jika perlu
    return `${date.getFullYear()}-${z(date.getMonth() + 1)}-${z(
      date.getDate()
    )} ${z(date.getHours())}:${z(date.getMinutes())}:${z(date.getSeconds())}`;
  };

  return (
    <div className="product-page">
      <h1>Outgoing Transaction Page</h1>
      <p>
        This is the Outgping transaction page where you can view and manage
        outgoing transactions.
      </p>

      {/* Search Input */}
      <div className="search-bar">
        <p>Search by:</p>
        <input
          type="text"
          placeholder="ID Barang"
          value={searchIDBarang}
          onChange={(e) => setSearchIDBarang(e.target.value)}
        />
        <input
          type="text"
          placeholder="ID Transaksi"
          value={searchIDTransaksi}
          onChange={(e) => setSearchIDTransaksi(e.target.value)}
        />
        <input
          type="text"
          placeholder="ID Kategori"
          value={searchIDKategori}
          onChange={(e) => setSearchIDKategori(e.target.value)}
        />
        <input
          type="date"
          placeholder="Tanggal"
          value={searchTanggal}
          onChange={(e) => setSearchTanggal(e.target.value)}
        />
        <button className="search-button" onClick={() => handleSearch()}>
          Search
        </button>
        <button className="add-button" onClick={() => setShowModal(true)}>
          + Add
        </button>
      </div>

      <table>
        <thead>
          <tr>
            {TABLE_HEADER.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {barang.map((item) => (
            <tr key={item.id_barang_keluar}>
              <td>{item.id_barang_keluar}</td>
              <td>{item.id_petugas}</td>
              <td>{item.id_pelanggan}</td>
              <td>{formatDateTime(item.tanggal_keluar)}</td>
              <td>{item.id_barang}</td>
              <td>{item.id_kategori}</td>
              <td>{item.harga_jual}</td>
              <td>{item.jumlah}</td>
              <td>{item.harga_jual * item.jumlah}</td>
              {/* sesuai-in */}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td
              colSpan={TABLE_HEADER.length}
              style={{
                textAlign: "right",
                fontWeight: "bold",
                paddingRight: "50px",
              }}>
              <p>Total Pemasukan: Rp {/*perhitungan total*/}</p>
            </td>
          </tr>
        </tfoot>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Tambah Transaksi Barang Keluar</h2>
            <div className="form-group">
              <div>
                <label>ID Transaksi:</label>
                <input
                  type="text"
                  name="id_transaksi"
                  value={formData.id_transaksi}
                  onChange={handleInputChange}
                  placeholder="BMK001"
                />
              </div>
              <div>
                <label>ID Petugas:</label>
                <input
                  type="text"
                  name="id_petugas"
                  value={formData.id_petugas}
                  onChange={handleInputChange}
                  placeholder="PTG001"
                />
              </div>
              <div>
                <label>ID pelanggan:</label>
                <input
                  type="text"
                  name="id_pelanggan"
                  value={formData.id_pelanggan}
                  onChange={handleInputChange}
                  placeholder="PLG001"
                />
              </div>
              <div>
                <label>Tanggal:</label>
                <input
                  type="date"
                  name="tanggal_masuk"
                  value={formData.tanggal_masuk}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>ID Barang:</label>
                <input
                  type="text"
                  name="id_barang"
                  value={formData.id_barang}
                  onChange={handleInputChange}
                  placeholder="BRG001"
                />
              </div>
              <div>
                <label>Jumlah:</label>
                <input
                  type="number"
                  name="jumlah"
                  value={formData.jumlah}
                  onChange={handleInputChange}
                  placeholder="1"
                  min="1"
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)}>Batal</button>
              <button onClick={handleAddService}>Selesai</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
