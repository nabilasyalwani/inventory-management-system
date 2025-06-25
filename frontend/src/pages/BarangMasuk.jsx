import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
// Jika Anda ingin menggunakan sidebar di halaman ini, Anda perlu mengimpor Link dan useLocation
// import { Link, useLocation } from 'react-router-dom';

import "./Service.module.css"; // Menggunakan file CSS yang sama untuk gaya yang konsisten

const TABLE_HEADER = [
  "Tanggal",
  "Nama Barang",
  "Jumlah",
  "Total Harga",
  // "ID Petugas", // Jika ingin ditampilkan di tabel
  // "ID Supplier", // Jika ingin ditampilkan di tabel
];

// Opsi ini tidak relevan untuk transaksi barang masuk secara langsung, bisa dihapus atau diubah jika ada daftar kategori
// const JENIS_SERVICE_OPTIONS = [ ... ]; // Dihapus atau tidak digunakan di sini

export default function BarangMasuk() {
  // <-- Ubah nama komponen
  const [transactions, setTransactions] = useState([]); // State untuk daftar transaksi
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Search states untuk Transaksi Barang Masuk
  const [searchNamaBarang, setSearchNamaBarang] = useState("");
  const [searchTanggal, setSearchTanggal] = useState("");
  // searchStatus tidak relevan untuk transaksi, dihapus

  // State untuk data yang akan diupdate
  const [updateData, setUpdateData] = useState({
    id_barang_masuk: "",
    id_detail_masuk: "", // Penting untuk identifikasi unik item di detail
    id_petugas: "",
    id_supplier: "",
    tanggal_masuk: "",
    nama_barang: "", // Nama barang (untuk display, bisa disabled)
    id_barang: "", // ID barang (untuk dikirim ke API)
    jumlah: "",
    harga_beli_satuan: "", // Harga beli per satuan saat update
  });

  // State untuk data yang akan ditambahkan
  const [addFormData, setAddFormData] = useState({
    id_barang_masuk: "",
    id_detail_masuk: "",
    id_petugas: "",
    id_supplier: "",
    tanggal_masuk: "",
    nama_barang: "", // Nama barang untuk input
    id_barang: "", // Akan dicari berdasarkan nama_barang
    jumlah: "",
    harga_beli_satuan: "", // Harga beli per satuan saat tambah
  });

  const [totalPengeluaran, setTotalPengeluaran] = useState(0); // Untuk total harga keluar

  // const location = useLocation(); // Hapus ini jika tidak pakai sidebar

  useEffect(() => {
    fetchTransactions(); // Mengganti fetchProducts
  }, []);

  // --- Fetch Transactions Function ---
  const fetchTransactions = async (searchParams = "") => {
    // Mengganti fetchProducts
    try {
      // Endpoint ini mengasumsikan API Anda bisa melakukan JOIN dan menghitung total harga
      const url = `http://localhost:3000/api/transaksi_masuk${
        searchParams ? "?" + searchParams : ""
      }`;
      const res = await fetch(url);
      if (!res.ok)
        throw new Error(`Failed to fetch transactions: ${res.statusText}`);
      const data = await res.json();
      // Asumsi API mengembalikan array data transaksi di index 0 dan total di index 1
      setTransactions(data[0]);
      setTotalPengeluaran(
        data[1] && data[1][0] ? data[1][0].grand_total || 0 : 0
      );
      console.log("Fetched transactions:", data);
      // console.log("Fetched transactions:", data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
      setTotalPengeluaran(0);
    }
  };

  // --- Handle Search ---
  const handleSearch = async () => {
    let queryParams = [];

    if (searchTanggal) queryParams.push(`nama_barang=${searchNamaBarang}`);
    if (searchTanggal) queryParams.push(`tanggal_masuk=${searchTanggal}`);

    if (queryParams.length === 0) return fetchTransactions();

    try {
      const res = await fetch(
        `http://localhost:3000/api/join/find/transaksi_masuk?${queryParams.join(
          "&"
        )}`
      );
      if (!res.ok) throw new Error("Failed to search transaksi");
      const data = await res.json();
      setTransactions(data);
      console.log("Search results:", data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleSearchKeyDown = (e) => {
    // e.preventDefault();
    console.log("Key pressed:", e.key);
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // --- Utility: Get Barang ID and Harga Beli by Name ---
  const getBarangDetailsByName = async (namaBarang) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/join/find/barang?nama_barang=${namaBarang}`
      );
      if (!res.ok) throw new Error("Failed to fetch barang details");
      const data = await res.json();
      return Array.isArray(data) && data.length > 0
        ? { id_barang: data[0].id_barang, harga_beli: data[0].harga_beli }
        : { id_barang: "", harga_beli: "" };
    } catch (error) {
      console.error("Error fetching barang details:", error);
      return { id_barang: "", harga_beli: "" };
    }
  };

  // --- Handle Input Change for Add Form ---
  const handleAddInputChange = async (e) => {
    const { name, value } = e.target;
    setAddFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Jika nama barang diisi, coba cari ID barang dan harga beli
    if (name === "nama_barang" && value) {
      const details = await getBarangDetailsByName(value);
      setAddFormData((prevData) => ({
        ...prevData,
        id_barang: details.id_barang,
        harga_beli_satuan: details.harga_beli, // Isi harga beli satuan secara otomatis
      }));
    } else if (name === "nama_barang" && !value) {
      setAddFormData((prevData) => ({
        ...prevData,
        id_barang: "",
        harga_beli_satuan: "",
      }));
    }
  };

  // --- Handle Input Change for Update Form ---
  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // --- Handle Add Transaction ---
  const handleAddTransaksiMasuk = async () => {
    // Mengganti handleAddService
    // Validasi sederhana
    try {
      const response = await fetch(
        "http://localhost:3000/api/transaksi_masuk",
        {
          // <-- Endpoint API Add Transaksi
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_barang_masuk: addFormData.id_barang_masuk,
            id_detail_masuk: addFormData.id_detail_masuk,
            id_petugas: addFormData.id_petugas,
            id_supplier: addFormData.id_supplier,
            tanggal_masuk: addFormData.tanggal_masuk,
            id_barang: addFormData.id_barang, // ID barang dari hasil pencarian
            jumlah: parseInt(addFormData.jumlah),
            harga_beli_satuan: parseFloat(addFormData.harga_beli_satuan), // Kirim harga beli satuan
          }),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add transaction: ${errorText}`);
      }
      await response.json();
      alert("Transaction added successfully!");
      fetchTransactions(); // Refresh data
      setShowAddModal(false);
      setAddFormData({
        // Reset form
        id_barang_masuk: "",
        id_detail_masuk: "",
        id_petugas: "",
        id_supplier: "",
        tanggal_masuk: "",
        nama_barang: "",
        id_barang: "",
        jumlah: "",
        harga_beli_satuan: "",
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert(`Failed to add transaction: ${error.message}`);
    }
  };

  // --- Handle Update Click (to populate form) ---
  const handleUpdateClick = (item) => {
    setUpdateData({
      id_barang_masuk: item.id_barang_masuk,
      id_detail_masuk: item.id_detail_masuk,
      id_petugas: item.id_petugas,
      id_supplier: item.id_supplier,
      tanggal_masuk: toInputDateFormat(item.tanggal_masuk),
      nama_barang: item.nama_barang, // Nama barang untuk display di form
      id_barang: item.id_barang, // ID barang asli
      jumlah: item.jumlah,
      harga_beli_satuan: item.harga_beli, // Asumsi ini dari API join
    });
    setShowUpdateModal(true);
  };

  // --- Handle Update Transaction ---
  const handleUpdateTransaksiMasuk = async () => {
    // Mengganti handleUpdateService
    // Validasi sederhana
    if (
      !updateData.id_barang_masuk ||
      !updateData.id_detail_masuk ||
      !updateData.id_petugas ||
      !updateData.id_supplier ||
      !updateData.tanggal_masuk ||
      !updateData.nama_barang ||
      !updateData.id_barang ||
      !updateData.jumlah ||
      !updateData.harga_beli_satuan
    ) {
      alert("Please fill in all required fields for update.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/transaksi_masuk",
        {
          // <-- Endpoint API Update Transaksi
          method: "PUT", // Atau PATCH, tergantung API Anda
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_barang_masuk: updateData.id_barang_masuk,
            id_detail_masuk: updateData.id_detail_masuk,
            id_petugas: updateData.id_petugas,
            id_supplier: updateData.id_supplier,
            tanggal_masuk: updateData.tanggal_masuk,
            id_barang: updateData.id_barang,
            jumlah: parseInt(updateData.jumlah),
            harga_beli_satuan: parseFloat(updateData.harga_beli_satuan),
          }),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update transaction: ${errorText}`);
      }
      await response.json();
      alert("Transaction updated successfully!");
      fetchTransactions(); // Refresh data
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert(`Failed to update transaction: ${error.message}`);
    }
  };

  // --- Handle Delete Transaction ---
  const handleDeleteTransaksiMasuk = async (id_detail_masuk) => {
    // Mengganti handleDelete
    if (
      window.confirm(
        `Are you sure you want to delete transaction detail with ID: ${id_detail_masuk}?`
      )
    ) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/transaksi_masuk",
          {
            // <-- Endpoint API Delete Transaksi
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_detail_masuk: id_detail_masuk }),
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete transaction: ${errorText}`);
        }
        await response.json();
        alert("Transaction deleted successfully!");
        fetchTransactions(); // Refresh data
      } catch (error) {
        console.error("Error deleting transaction:", error);
        alert(`Failed to delete transaction: ${error.message}`);
      }
    }
  };

  // Fungsi format tanggal
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "" : date.toLocaleDateString("id-ID");
  }

  // Fungsi untuk format tanggal ke YYYY-MM-DD untuk input type="date"
  function toInputDateFormat(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  }

  // Validasi form (opsional, bisa ditambahkan lebih detail)
  // const isAddFormValid = () => {
  //   // Memastikan semua field yang dibutuhkan terisi, termasuk id_barang dan harga_beli_satuan
  //   return (
  //     addFormData.id_barang_masuk &&
  //     addFormData.id_detail_masuk &&
  //     addFormData.id_petugas &&
  //     addFormData.id_supplier &&
  //     addFormData.tanggal_masuk &&
  //     addFormData.nama_barang &&
  //     addFormData.id_barang &&
  //     addFormData.jumlah &&
  //     addFormData.harga_beli_satuan
  //   );
  // };
  // const isUpdateFormValid = () => {
  //   return (
  //     updateData.id_barang_masuk &&
  //     updateData.id_detail_masuk &&
  //     updateData.id_petugas &&
  //     updateData.id_supplier &&
  //     updateData.tanggal_masuk &&
  //     updateData.nama_barang &&
  //     updateData.id_barang &&
  //     updateData.jumlah &&
  //     updateData.harga_beli_satuan
  //   );
  // };

  return (
    <div className="product-page">
      {" "}
      {/* Menggunakan kelas 'product-page' sesuai kode Anda */}
      <h1 className="page-title">Incoming Transaction History</h1>{" "}
      {/* Judul halaman */}
      <p className="page-description">
        This page displays the history of incoming product transactions.
      </p>{" "}
      {/* Deskripsi */}
      {/* Search Input Section */}
      <div className="search-bar">
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
        <input
          type="text"
          placeholder="Nama Barang"
          value={searchNamaBarang}
          onChange={(e) => setSearchNamaBarang(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
        <input
          type="date"
          placeholder="Tanggal"
          value={searchTanggal}
          onChange={(e) => setSearchTanggal(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
        <Button className="add-button" onClick={() => setShowAddModal(true)}>
          +Add
        </Button>
      </div>
      {/* Tabel Transaksi Barang Masuk */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              {TABLE_HEADER.map((header) => (
                <th key={header}>{header}</th>
              ))}
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((item) => (
                <tr key={item.id_transaksi_masuk}>
                  {" "}
                  {/* Gunakan id_detail_masuk sebagai key yang lebih unik */}
                  <td data-label="Tanggal">{formatDate(item.tanggal_masuk)}</td>
                  <td data-label="Nama Barang">{item.nama_barang}</td>
                  <td data-label="Jumlah">{item.jumlah}</td>{" "}
                  {/* Asumsi ada item.satuan_barang */}
                  <td data-label="Total Harga">
                    Rp {parseFloat(item.Total_harga).toLocaleString("id-ID")}
                  </td>{" "}
                  {/* Asumsi ada item.total_harga */}
                  <td data-label="Aksi">
                    <Button
                      variant="primary"
                      size="sm"
                      className="btn-action btn-update"
                      onClick={() => handleUpdateClick(item)}>
                      Update
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="btn-action btn-delete"
                      onClick={() =>
                        handleDeleteTransaksiMasuk(item.id_detail_masuk)
                      }>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={TABLE_HEADER.length + 1}
                  className="no-data-message">
                  No incoming transactions found.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={TABLE_HEADER.length - 1} // Kolom untuk "Total Pengeluaran"
                className="text-end fw-bold pe-3" // text-end, fw-bold, pe-3 from Bootstrap
              >
                Total Pengeluaran:
              </td>
              <td colSpan="2" className="fw-bold">
                Rp {parseFloat(totalPengeluaran).toLocaleString("id-ID")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {/* Modal Tambah Transaksi Barang Masuk */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">
            Tambah Transaksi Barang Masuk
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-scrollable">
          <Form>
            <Form.Group className="mb-3" controlId="addIdBarangMasuk">
              <Form.Label>ID Transaksi Masuk:</Form.Label>
              <Form.Control
                type="text"
                name="id_barang_masuk"
                value={addFormData.id_barang_masuk}
                onChange={handleAddInputChange}
                placeholder="BMK001"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addIdDetailMasuk">
              <Form.Label>ID Detail Masuk:</Form.Label>
              <Form.Control
                type="text"
                name="id_detail_masuk"
                value={addFormData.id_detail_masuk}
                onChange={handleAddInputChange}
                placeholder="DBM001"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addTanggalMasuk">
              <Form.Label>Tanggal Masuk:</Form.Label>
              <Form.Control
                type="date"
                name="tanggal_masuk"
                value={addFormData.tanggal_masuk}
                onChange={handleAddInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addNamaBarang">
              <Form.Label>Nama Barang:</Form.Label>
              <Form.Control
                type="text"
                name="nama_barang"
                value={addFormData.nama_barang}
                onChange={handleAddInputChange}
                placeholder="iPhone 14 Pro Max"
                required
              />
              {addFormData.nama_barang && addFormData.id_barang && (
                <Form.Text className="text-success">
                  ID Barang: {addFormData.id_barang}
                </Form.Text>
              )}
              {addFormData.nama_barang && !addFormData.id_barang && (
                <Form.Text className="text-danger">
                  Barang tidak ditemukan!
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="addJumlah">
              <Form.Label>Jumlah:</Form.Label>
              <Form.Control
                type="number"
                name="jumlah"
                value={addFormData.jumlah}
                onChange={handleAddInputChange}
                min="1"
                placeholder="10"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addHargaBeliSatuan">
              <Form.Label>Harga Beli per Satuan:</Form.Label>
              <Form.Control
                type="number"
                name="harga_beli_satuan"
                value={addFormData.harga_beli_satuan}
                onChange={handleAddInputChange}
                min="0"
                step="0.01"
                placeholder="15000000"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addIdPetugas">
              <Form.Label>ID Petugas:</Form.Label>
              <Form.Control
                type="text"
                name="id_petugas"
                value={addFormData.id_petugas}
                onChange={handleAddInputChange}
                placeholder="PTG001"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addIdSupplier">
              <Form.Label>ID Supplier:</Form.Label>
              <Form.Control
                type="text"
                name="id_supplier"
                value={addFormData.id_supplier}
                onChange={handleAddInputChange}
                placeholder="SUP001"
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-buttons">
          <Button
            variant="secondary"
            onClick={() => setShowAddModal(false)}
            className="cancel-button">
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={handleAddTransaksiMasuk}
            className="submit-button"
            disabled={!isAddFormValid()}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal Update Transaksi Barang Masuk */}
      <Modal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">
            Update Transaksi Barang Masuk
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-scrollable">
          <Form>
            <Form.Group className="mb-3" controlId="updateIdBarangMasuk">
              <Form.Label>ID Transaksi Masuk:</Form.Label>
              <Form.Control
                type="text"
                name="id_barang_masuk"
                value={updateData.id_barang_masuk}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="updateIdDetailMasuk">
              <Form.Label>ID Detail Masuk:</Form.Label>
              <Form.Control
                type="text"
                name="id_detail_masuk"
                value={updateData.id_detail_masuk}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="updateTanggalMasuk">
              <Form.Label>Tanggal Masuk:</Form.Label>
              <Form.Control
                type="date"
                name="tanggal_masuk"
                value={updateData.tanggal_masuk || ""}
                onChange={handleUpdateInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="updateNamaBarang">
              <Form.Label>Nama Barang:</Form.Label>
              <Form.Control
                type="text"
                name="nama_barang"
                value={updateData.nama_barang || ""}
                onChange={handleUpdateInputChange}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="updateJumlah">
              <Form.Label>Jumlah:</Form.Label>
              <Form.Control
                type="number"
                name="jumlah"
                value={updateData.jumlah || ""}
                onChange={handleUpdateInputChange}
                min="1"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="updateHargaBeliSatuan">
              <Form.Label>Harga Beli per Satuan:</Form.Label>
              <Form.Control
                type="number"
                name="harga_beli_satuan"
                value={updateData.harga_beli_satuan || ""}
                onChange={handleUpdateInputChange}
                min="0"
                step="0.01"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="updateIdPetugas">
              <Form.Label>ID Petugas:</Form.Label>
              <Form.Control
                type="text"
                name="id_petugas"
                value={updateData.id_petugas || ""}
                onChange={handleUpdateInputChange}
                placeholder="PTG001"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="updateIdSupplier">
              <Form.Label>ID Supplier:</Form.Label>
              <Form.Control
                type="text"
                name="id_supplier"
                value={updateData.id_supplier || ""}
                onChange={handleUpdateInputChange}
                placeholder="SUP001"
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-buttons">
          <Button
            variant="secondary"
            onClick={() => setShowUpdateModal(false)}
            className="cancel-button">
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateTransaksiMasuk}
            className="submit-button"
            disabled={!isUpdateFormValid()}>
            Simpan Perubahan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
