import React, { useState, useEffect } from "react";
import "./BarangMasuk.css";

const TABLE_HEADER = [
  "ID Transaksi", //id barang masuk
  "ID Detail Transaksi", //id detail barang masuk
  "ID Petugas",
  "ID pelanggan",
  "Tanggal",
  "Nama Barang", //dari tabel barang
  "Kategori", //dari tabel barang
  "Harga Jual/item", //dari tabel barang
  "Jumlah", //dari tabel detail_barang_masuk
  "Total Harga", // harga * jumlah
  "Aksi",
];

export default function BarangKeluar() {
  const [barang, setBarang] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchIDBarang, setSearchIDBarang] = useState("");
  const [searchIDTransaksi, setSearchIDTransaksi] = useState("");
  const [searchIDKategori, setSearchIDKategori] = useState("");
  const [searchTanggal, setSearchTanggal] = useState("");
  const [totalPemasukan, setTotalPemasukan] = useState(0);
  const [totalLaba, setTotalLaba] = useState(0);
  const [formData, setFormData] = useState({
    id_detail_keluar: "",
    id_barang_keluar: "",
    id_petugas: "",
    id_pelanggan: "",
    tanggal_keluar: "",
    nama_barang: "",
    jumlah: "",
    id_barang: "",
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
      console.log("Data fetched:", data);
      setBarang(data[0]);
      setTotalPemasukan(data[1][0].grand_total);
      setTotalLaba(data[1][0].total_laba);
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

  const handleSearch = async () => {
    let searchString = "";
    if (searchIDBarang) {
      searchString += `b.nama_barang=${searchIDBarang}&`;
    }
    if (searchIDTransaksi) {
      searchString += `bk.id_barang_keluar=${searchIDTransaksi}&`;
    }
    if (searchIDKategori) {
      searchString += `k.jenis_barang=${searchIDKategori}&`;
    }
    if (searchTanggal) {
      searchString += `bk.tanggal_keluar=${searchTanggal}&`;
    }

    // console.log(searchTanggal);

    if (searchString === "") {
      console.log("No search criteria provided, fetching all products.");
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
      console.log("Data fetched:", data);
      setBarang(data);
      setTotalPemasukan(data.grand_total || data[0].grand_total || 0);
      setTotalLaba(data.total_laba || data[0].total_laba || 0);
      console.log("Fetched products:", data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
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

  const handleAddTransaksiKeluar = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/join/transaksi_barang_keluar",
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
        id_detail_keluar: "",
        id_barang_keluar: "",
        id_petugas: "",
        id_pelanggan: "",
        tanggal_keluar: "",
        nama_barang: "",
        jumlah: "",
      });
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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/join/transaksi_barang_keluar",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_detail_keluar: id }),
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
            <tr key={item.id_barang_keluar}>
              <td>{item.id_barang_keluar}</td>
              <td>{item.id_detail_keluar}</td>
              <td>{item.id_petugas}</td>
              <td>{item.id_pelanggan}</td>
              <td>{formatDateTime(item.tanggal_keluar)}</td>
              <td>{item.nama_barang}</td>
              <td>{item.jenis_barang}</td>
              <td>{item.harga_jual}</td>
              <td>{item.jumlah}</td>
              <td>{item.harga_jual * item.jumlah}</td>
              <td>
                <button
                  onClick={() => handleDelete(item.id_detail_keluar)}
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
              <p>Total Pemasukan: Rp {totalPemasukan}</p>
            </td>
          </tr>
          <tr>
            <td
              colSpan={TABLE_HEADER.length + 1} // +1 for the action column
              style={{
                textAlign: "right",
                fontWeight: "bold",
                paddingRight: "50px",
              }}>
              <p>Total Laba: Rp {totalLaba}</p>
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
                <label>ID Detail Transaksi:</label>
                <input
                  type="text"
                  name="id_detail_keluar"
                  value={formData.id_detail_keluar}
                  onChange={handleInputChange}
                  placeholder="DBK001"
                />
              </div>
              <div>
                <label>ID Transaksi:</label>
                <input
                  type="text"
                  name="id_barang_keluar"
                  value={formData.id_barang_keluar}
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
                  name="tanggal_keluar"
                  value={
                    formData.tanggal_keluar
                      ? formData.tanggal_keluar.slice(0, 10)
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
              <button onClick={handleAddTransaksiKeluar}>Selesai</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
