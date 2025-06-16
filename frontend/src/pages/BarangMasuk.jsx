import React, { useState, useEffect } from "react";
import "./barangMasuk.css";

const TABLE_HEADER = [
  "ID Transaksi", //id barang masuk
  "ID Detail Transaksi", //id detail barang masuk
  "ID Petugas",
  "ID Supplier",
  "Tanggal",
  "Nama Barang", //dari tabel barang
  "Kategori", //dari tabel barang
  "Harga Beli/item", //dari tabel barang
  "Jumlah", //dari tabel detail_barang_masuk
  "Total Harga", // harga * jumlah
  "Aksi",
];

export default function ProductPage() {
  const [barang, setBarang] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchIDBarang, setSearchIDBarang] = useState("");
  const [searchIDTransaksi, setSearchIDTransaksi] = useState("");
  const [searchIDKategori, setSearchIDKategori] = useState("");
  const [searchTanggal, setSearchTanggal] = useState("");
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);
  const [formData, setFormData] = useState({
    id_barang_masuk: "",
    id_detail_masuk: "",
    id_petugas: "",
    id_supplier: "",
    tanggal_masuk: "",
    nama_barang: "",
    jumlah: "",
    id_barang: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/join/transaksi_barang_masuk"
      ); //tabel combined?

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      setBarang(data[0]);
      setTotalPengeluaran(data[1][0].grand_total || 0);
      // console.log("Total Pengeluaran:", data[1][0].grand_total);
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
    if (name === "nama_barang") {
      handleSearchIDBarang(value);
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearchIDBarang = async (barang) => {
    console.log("Searching for barang:", barang);
    try {
      const res = await fetch(
        `http://localhost:3000/api/join/find/barang?nama_barang=${barang}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await res.json();
      const id_barang =
        Array.isArray(data) && data.length > 0 ? data[0].id_barang : "";
      setFormData((prevData) => ({
        ...prevData,
        id_barang: id_barang,
      }));
      console.log("Fetched products:", data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearch = async () => {
    let searchString = "";
    if (searchIDBarang) {
      searchString += `b.nama_barang=${searchIDBarang}&`;
    }
    if (searchIDTransaksi) {
      searchString += `bm.id_barang_masuk=${searchIDTransaksi}&`;
    }
    if (searchIDKategori) {
      searchString += `k.jenis_barang=${searchIDKategori}&`;
    }
    if (searchTanggal) {
      searchString += `bm.tanggal_masuk=${searchTanggal}&`;
    }

    if (searchString === "") {
      console.log("No search criteria provided, fetching all products.");
      fetchProducts();
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/api/join/find/transaksi_barang_masuk?" +
          searchString
      );
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await res.json();
      console.log("Search results:", data);
      setBarang(data);
      setTotalPengeluaran(data.grand_total || data[0].grand_total || 0);
      console.log("Fetched products:", data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddTransaksiMasuk = async () => {
    console.log(formData);
    try {
      const response = await fetch(
        "http://localhost:3000/api/join/transaksi_barang_masuk",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }
      const newEntry = await response.json();
      console.log("New entry added:", newEntry);
      fetchProducts(); // Refresh
      // setBarang([...barang, newEntry]);
      setShowModal(false);
      setFormData({
        id_barang_masuk: "",
        id_detail_masuk: "",
        id_petugas: "",
        id_supplier: "",
        tanggal_masuk: "",
        nama_barang: "",
        jumlah: "",
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/join/transaksi_barang_masuk",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_detail_masuk: id }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }
      const deleteItem = await response.json();
      console.log("Item Deleted:", deleteItem);
      fetchProducts(); // Refresh
      // setBarang([...barang, newEntry]);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  function formatDateTime(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("id-ID");
  }

  return (
    <div className="product-page">
      <h1>Incoming Transaction Page</h1>
      <p>
        This is the Incoming transaction page where you can view and manage
        incoming transactions.
      </p>

      {/* Search Input */}
      <div className="search-bar">
        <p>Search by:</p>
        <input
          type="text"
          placeholder="Nama Barang"
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
          placeholder="Kategori"
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
            <tr key={item.id_barang_masuk}>
              <td>{item.id_barang_masuk}</td>
              <td>{item.id_detail_masuk}</td>
              <td>{item.id_petugas}</td>
              <td>{item.id_supplier}</td>
              <td>{formatDateTime(item.tanggal_masuk)}</td>
              <td>{item.nama_barang}</td>
              <td>{item.jenis_barang}</td>
              <td>{item.harga_beli}</td>
              <td>{item.jumlah}</td>
              <td>{item.harga_beli * item.jumlah}</td>
              <td>
                <button
                  onClick={() => handleDelete(item.id_detail_masuk)}
                  style={{ marginLeft: "6px", backgroundColor: "#e53e3e" }}>
                  Delete
                </button>
              </td>
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
              <p>Total Pengeluaran: Rp {totalPengeluaran}</p>
            </td>
          </tr>
        </tfoot>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Tambah Transaksi Barang Masuk</h2>
            <div className="form-group">
              <div>
                <label>ID Transaksi:</label>
                <input
                  type="text"
                  name="id_barang_masuk"
                  value={formData.id_barang_masuk}
                  onChange={handleInputChange}
                  placeholder="BMK001"
                />
              </div>
              <div>
                <label>ID Detail Transaksi:</label>
                <input
                  type="text"
                  name="id_detail_masuk"
                  value={formData.id_detail_masuk}
                  onChange={handleInputChange}
                  placeholder="DBM001"
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
                <label>ID Supplier:</label>
                <input
                  type="text"
                  name="id_supplier"
                  value={formData.id_supplier}
                  onChange={handleInputChange}
                  placeholder="SUP001"
                />
              </div>
              <div>
                <label>Tanggal:</label>
                <input
                  type="date"
                  name="tanggal_masuk"
                  value={
                    formData.tanggal_masuk
                      ? formData.tanggal_masuk.slice(0, 10)
                      : ""
                  }
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Nama Barang:</label>
                <input
                  type="text"
                  name="nama_barang"
                  value={formData.nama_barang}
                  onChange={handleInputChange}
                  placeholder="Iphone 14 Pro Max"
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
              <button onClick={() => handleAddTransaksiMasuk()}>Selesai</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
