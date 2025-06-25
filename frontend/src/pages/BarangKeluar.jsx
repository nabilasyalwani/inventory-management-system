import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Search, SquarePen, Trash2 } from "lucide-react";
import "./Service.module.css";

const TABLE_HEADER = [
  "Tanggal Keluar",
  "Nama Barang",
  "Jumlah",
  "Total Harga Jual",
];

export default function BarangKeluar() {
  const [transactions, setTransactions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [searchNamaBarang, setSearchNamaBarang] = useState("");
  const [searchTanggal, setSearchTanggal] = useState("");

  const [updateData, setUpdateData] = useState({
    id_petugas: "",
    id_distributor: "",
    tanggal_keluar: "",
    jumlah: "",
  });

  const [addFormData, setAddFormData] = useState({
    id_barang_keluar: "",
    id_detail_keluar: "",
    id_petugas: "",
    id_distributor: "",
    tanggal_keluar: "",
    nama_barang: "",
    id_barang: "",
    jumlah: "",
    harga_jual_satuan: "",
    harga_beli_satuan: "",
  });

  const [totalPemasukan, setTotalPemasukan] = useState(0); // Untuk total harga jual
  const [totalLaba, setTotalLaba] = useState(0); // Untuk total laba (harga jual - harga beli)

  useEffect(() => {
    fetchTransactions();
  }, []);

  // --- Fetch Transactions Function ---
  const fetchTransactions = async (searchParams = "") => {
    console.log("Fetching transactions with params:", searchParams);
    try {
      const url = `http://localhost:3000/api/transaksi_keluar`;
      const res = await fetch(url);
      if (!res.ok)
        throw new Error(`Failed to fetch transactions: ${res.statusText}`);
      const data = await res.json();
      // Asumsi API mengembalikan:
      // data[0] = array data transaksi
      // data[1] = [{ grand_total: X, grand_total_beli: Y, total_laba: Z }]
      setTransactions(data[0] || []);
      setTotalPemasukan(
        data[1] && data[1][0] ? data[1][0].grand_total || 0 : 0
      );
      setTotalLaba(data[1] && data[1][0] ? data[1][0].total_laba || 0 : 0); // Pastikan API menghitung laba
      console.log("Fetched transactions:", data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
      setTotalPemasukan(0);
      setTotalLaba(0);
    }
  };

  // --- Handle Search ---
  const handleSearch = async () => {
    let queryParams = new URLSearchParams();
    if (searchNamaBarang) queryParams.append("nama_barang", searchNamaBarang);
    if (searchTanggal) queryParams.append("tanggal_keluar", searchTanggal);

    fetchTransactions(queryParams.toString());
  };

  // --- Utility: Get Barang ID, Harga Jual, Harga Beli by Name ---
  const getBarangDetailsByName = async (namaBarang) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/join/find/barang?nama_barang=${namaBarang}`
      );
      if (!res.ok) throw new Error("Failed to fetch barang details");
      const data = await res.json();
      return Array.isArray(data) && data.length > 0
        ? {
            id_barang: data[0].id_barang,
            harga_jual: data[0].harga_jual,
            harga_beli: data[0].harga_beli,
          }
        : { id_barang: "", harga_jual: "", harga_beli: "" };
    } catch (error) {
      console.error("Error fetching barang details:", error);
      return { id_barang: "", harga_jual: "", harga_beli: "" };
    }
  };

  // --- Handle Input Change for Add Form ---
  const handleAddInputChange = async (e) => {
    const { name, value } = e.target;
    setAddFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Jika nama barang diisi, coba cari ID barang, harga jual, dan harga beli
    if (name === "nama_barang" && value) {
      const details = await getBarangDetailsByName(value);
      setAddFormData((prevData) => ({
        ...prevData,
        id_barang: details.id_barang,
        harga_jual_satuan: details.harga_jual,
        harga_beli_satuan: details.harga_beli,
      }));
    } else if (name === "nama_barang" && !value) {
      setAddFormData((prevData) => ({
        ...prevData,
        id_barang: "",
        harga_jual_satuan: "",
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
  const handleAddTransaksiKeluar = async () => {
    // Mengganti nama fungsi
    // Validasi sederhana

    try {
      const response = await fetch(
        "http://localhost:3000/api/transaksi_keluar",
        {
          // <-- Endpoint API Add Transaksi Keluar
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_barang_keluar: addFormData.id_barang_keluar,
            id_detail_keluar: addFormData.id_detail_keluar,
            id_petugas: addFormData.id_petugas,
            id_distributor: addFormData.id_distributor,
            tanggal_keluar: addFormData.tanggal_keluar,
            id_barang: addFormData.id_barang,
            jumlah: parseInt(addFormData.jumlah),
            harga_jual_satuan: parseFloat(addFormData.harga_jual_satuan), // Kirim harga jual
            harga_beli_satuan: parseFloat(addFormData.harga_beli_satuan), // Kirim harga beli (untuk perhitungan laba)
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
        id_barang_keluar: "",
        id_detail_keluar: "",
        id_petugas: "",
        id_distributor: "",
        tanggal_keluar: "",
        nama_barang: "",
        id_barang: "",
        jumlah: "",
        harga_jual_satuan: "",
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
      id_petugas: item.id_petugas,
      id_distributor: item.id_distributor,
      tanggal_keluar: toInputDateFormat(item.tanggal_keluar),
      jumlah: item.jumlah,
    });
    setShowUpdateModal(true);
  };

  const handleUpdateTransaksiKeluar = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/join/transaksi_keluar",
        {
          method: "PUT", // Atau PATCH
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_petugas: updateData.id_petugas,
            id_distributor: updateData.id_distributor,
            tanggal_keluar: updateData.tanggal_keluar,
            jumlah: parseInt(updateData.jumlah),
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

  const handleDeleteTransaksiKeluar = async (id_detail_keluar) => {
    if (
      window.confirm(
        `Are you sure you want to delete transaction detail with ID: ${id_detail_keluar}?`
      )
    ) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/join/transaksi_barang_keluar",
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_detail_keluar: id_detail_keluar }),
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

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "" : date.toLocaleDateString("id-ID");
  }

  function toInputDateFormat(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  }

  return (
    <div className="product-page">
      <h1 className="page-title">Outgoing Transaction History</h1>
      <p className="page-description">
        This page displays the history of outgoing product transactions.
      </p>
      <div className="search-bar">
        <Button className="search-button" onClick={handleSearch}>
          Search
        </Button>
        <input
          type="text"
          placeholder="Nama Barang"
          value={searchNamaBarang}
          onChange={(e) => setSearchNamaBarang(e.target.value)}
        />
        <input
          type="date"
          placeholder="Tanggal Keluar"
          value={searchTanggal}
          onChange={(e) => setSearchTanggal(e.target.value)}
        />
        <Button className="add-button" onClick={() => setShowAddModal(true)}>
          +Add
        </Button>
      </div>
      <hr className="divider" />
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
                <tr key={item.id_transaksi_keluar}>
                  <td data-label="Tanggal Keluar">
                    {formatDate(item.tanggal_keluar)}
                  </td>
                  <td data-label="Nama Barang">{item.nama_barang}</td>
                  <td data-label="Jumlah">
                    {item.jumlah} {item.satuan_barang}
                  </td>
                  <td data-label="Total Harga Jual">
                    Rp {parseFloat(item.Total_harga).toLocaleString("id-ID")}
                  </td>
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
                        handleDeleteTransaksiKeluar(item.id_detail_keluar)
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
                  No outgoing transactions found.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={TABLE_HEADER.length - 1}
                className="text-end fw-bold pe-3">
                Total Pemasukan:
              </td>
              <td colSpan="2" className="fw-bold">
                Rp {parseFloat(totalPemasukan).toLocaleString("id-ID")}
              </td>
            </tr>
            <tr>
              <td
                colSpan={TABLE_HEADER.length - 1}
                className="text-end fw-bold pe-3">
                Total Laba:
              </td>
              <td colSpan="2" className="fw-bold">
                Rp {parseFloat(totalLaba).toLocaleString("id-ID")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {/* Modal Tambah Transaksi Barang Keluar */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">
            Tambah Transaksi Barang Keluar
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-scrollable">
          <Form>
            <Form.Group className="mb-3" controlId="addTanggalKeluar">
              <Form.Label>Tanggal Keluar:</Form.Label>
              <Form.Control
                type="date"
                name="tanggal_keluar"
                value={addFormData.tanggal_keluar}
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
            <Form.Group className="mb-3" controlId="addIdDistributor">
              <Form.Label>ID Distributor:</Form.Label>
              <Form.Control
                type="text"
                name="id_distributor"
                value={addFormData.id_distributor}
                onChange={handleAddInputChange}
                placeholder="DTB001"
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
            onClick={handleAddTransaksiKeluar}
            className="submit-button"
            // disabled={!isAddFormValid()}
          >
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal Update Transaksi Barang Keluar */}
      <Modal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">
            Update Transaksi Barang Keluar
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-scrollable">
          <Form>
            <Form.Group className="mb-3" controlId="updateTanggalKeluar">
              <Form.Label>Tanggal Keluar:</Form.Label>
              <Form.Control
                type="date"
                name="tanggal_keluar"
                value={updateData.tanggal_keluar || ""}
                onChange={handleUpdateInputChange}
                required
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
            <Form.Group className="mb-3" controlId="updateIdDistributor">
              <Form.Label>ID Distributor:</Form.Label>
              <Form.Control
                type="text"
                name="id_distributor"
                value={updateData.id_distributor || ""}
                onChange={handleUpdateInputChange}
                placeholder="DIS001"
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
            onClick={handleUpdateTransaksiKeluar}
            className="submit-button"
            // disabled={!isUpdateFormValid()}
          >
            Simpan Perubahan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
