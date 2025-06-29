import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Search, SquarePen, Trash2, CirclePlus } from "lucide-react";
import SearchInput from "../component/SearchInput";
import styles from "./page.module.css"; // Menggunakan file CSS yang sama untuk gaya yang konsisten
import { fetchDistributor } from "../api/distributor"; // Mengambil daftar dist
import {
  TABLE_HEADER,
  EMPTY_FORM_DATA,
  TransaksiKeluarFields,
} from "../data/TransaksiKeluarFields";
import {
  fetchTransaksiKeluar,
  addTransaksiKeluar,
  updateTransaksiKeluar,
  deleteTransaksiKeluar,
  searchTransaksiKeluar,
  searchIDBarang,
} from "../api/transaksiKeluar";

export default function BarangKeluar() {
  const [transactions, setTransactions] = useState([]); // State untuk daftar transaksi
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [totalPemasukan, setTotalPemasukan] = useState(0); // Untuk total harga keluar
  // const [totalLaba, setTotalLaba] = useState(0); // Untuk total laba

  const [distributor, setDistributor] = useState([]);
  const [searchNamaBarang, setSearchNamaBarang] = useState("");
  const [searchTanggal, setSearchTanggal] = useState("");
  const [searchJumlah, setSearchJumlah] = useState(0);

  const [addFormData, setAddFormData] = useState(EMPTY_FORM_DATA);
  const [updateFormData, setUpdateFormData] = useState(EMPTY_FORM_DATA);

  useEffect(() => {
    handleFetch();
    setIDPetugas();
    fetchDistributor().then((data) => {
      setDistributor(data);
    });
  }, []);

  const setIDPetugas = () => {
    const id_petugas = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).id_petugas
      : "";
    setAddFormData((prevData) => ({
      ...prevData,
      id_petugas: id_petugas,
    }));
    setUpdateFormData((prevData) => ({
      ...prevData,
      id_petugas: id_petugas,
    }));
    console.log("ID Petugas:", id_petugas);
  };

  const handleFetch = async () => {
    try {
      const data = await fetchTransaksiKeluar();
      setTransactions(data[0]);
      console.log("Data Transaksi Keluar:", data[0]);
      setTotalPemasukan(data[1][0].grand_total);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    let query = [];
    if (searchNamaBarang) query.push(`nama_barang=${searchNamaBarang}`);
    if (searchTanggal) query.push(`tanggal_keluar=${searchTanggal}`);
    if (searchJumlah) query.push(`jumlah=${searchJumlah}`);

    console.log("Query String:", query);
    if (query.length === 0) return handleFetch();
    const queryString = query.join("&");

    try {
      const data = await searchTransaksiKeluar(queryString);
      setTransactions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTransaksiKeluar = async () => {
    try {
      await addTransaksiKeluar(addFormData);
      handleFetch();
      setShowAddModal(false);
      setAddFormData(EMPTY_FORM_DATA);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateTransaksiKeluar = async () => {
    try {
      await updateTransaksiKeluar(updateFormData);
      handleFetch();
      setShowUpdateModal(false);
      setUpdateFormData(EMPTY_FORM_DATA);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTransaksiKeluar = async (id) => {
    console.log("ID Transaksi Keluar yang akan dihapus:", id);
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      try {
        await deleteTransaksiKeluar(id);
        handleFetch();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSearchIDBarang = async (namaBarang) => {
    try {
      const data = await searchIDBarang(namaBarang);
      setAddFormData((prevData) => ({
        ...prevData,
        id_barang: data,
      }));
      setUpdateFormData((prevData) => ({
        ...prevData,
        id_barang: data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e, modal) => {
    const { name, value } = e.target;
    if (modal === "add") {
      setAddFormData({
        ...addFormData,
        [name]: value,
      });
    } else {
      setUpdateFormData({
        ...updateFormData,
        [name]: value,
      });
    }
    if (name === "nama_barang") {
      handleSearchIDBarang(value);
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

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles["product-page"]}>
      <h1>Riwayat Transaksi Keluar</h1>
      <p>Halaman ini menampilkan riwayat transaksi masuk.</p>
      <div className={styles["search-bar"]}>
        <SearchInput
          type="text"
          icon={Search}
          value={searchNamaBarang}
          onKeyDown={handleSearchKeyDown}
          onChange={(e) => setSearchNamaBarang(e.target.value)}
          placeholder="Nama Barang"
        />
        <SearchInput
          type="date"
          icon={Search}
          value={searchTanggal}
          onChange={(e) => setSearchTanggal(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="mm/dd/yyyy"
        />
        <SearchInput
          type="number"
          icon={Search}
          value={searchJumlah}
          onChange={(e) => setSearchJumlah(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Jumlah Barang"
        />
        <button
          className={styles["add-button"]}
          onClick={() => setShowAddModal(true)}>
          <CirclePlus size={20} />
          Tambah
        </button>
      </div>

      <table>
        <thead>
          <tr>
            {TABLE_HEADER.map((header) => (
              <th
                key={header}
                className={
                  styles[`${header === "Total Harga" ? "biaya-head" : ""}`]
                }>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((item) => (
              <tr key={item.id_transaksi_keluar}>
                <td>{formatDate(item.tanggal_keluar)}</td>
                <td>{item.nama_barang}</td>
                <td>{item.jumlah}</td>
                <td className={styles.biaya}>
                  Rp {parseFloat(item.Total_harga).toLocaleString("id-ID")}
                </td>
                <td>
                  <button
                    onClick={() => {
                      setAddFormData({
                        ...item,
                        tanggal_keluar: toInputDateFormat(item.tanggal_keluar),
                      });
                      setUpdateFormData({
                        ...item,
                        tanggal_keluar: toInputDateFormat(item.tanggal_keluar),
                      });
                      setShowUpdateModal(true);
                    }}>
                    <SquarePen size={20} />
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteTransaksiKeluar(item.id_transaksi_keluar)
                    }
                    style={{ marginLeft: "6px", backgroundColor: "#e53e3e" }}>
                    <Trash2 size={20} color="white" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={TABLE_HEADER.length + 1} className="no-data-message">
                Tidak ada data transaksi masuk yang ditemukan.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td
              colSpan={TABLE_HEADER.length - 1}
              className="text-end fw-bold pe-3" // text-end, fw-bold, pe-3 from Bootstrap
            >
              Total Pengeluaran:
            </td>
            <td colSpan="2" className="fw-bold">
              Rp {parseFloat(totalPemasukan).toLocaleString("id-ID")}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Modal Tambah Transaksi Barang Keluar */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton className="p-4 pb-3 m-2">
          <Modal.Title className="modal-title">
            Tambah Transaksi Barang Keluar
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-scrollable p-4 pt-2 pb-2 m-2">
          <Form>
            {TransaksiKeluarFields.map((field) => (
              <Form.Group className="mb-3" key={field.name}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  name={field.name}
                  type={field.type}
                  value={addFormData[field.name]}
                  onChange={(e) => handleInputChange(e, "add")}
                />
              </Form.Group>
            ))}
            <Form.Group>
              <Form.Label>Distributor</Form.Label>
              <Form.Select
                value={addFormData.id_distributor || ""}
                onChange={(e) =>
                  setAddFormData({
                    ...addFormData,
                    id_distributor: e.target.value,
                  })
                }>
                <option value="">-- Pilih Distributor --</option>
                {distributor.map((dist) => (
                  <option key={dist.id_distributor} value={dist.id_distributor}>
                    {dist.id_distributor} - {dist.nama_distributor}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-buttons p-3 m-2">
          <Button
            variant="secondary"
            onClick={() => setShowAddModal(false)}
            className="cancel-button">
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={handleAddTransaksiKeluar}
            className="submit-button">
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Update Transaksi Barang Keluar */}
      <Modal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        centered>
        <Modal.Header closeButton className="p-4 pb-3 m-2">
          <Modal.Title>Update Transaksi Barang Keluar</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-scrollable p-4 pt-2 pb-2 m-2">
          <Form>
            {TransaksiKeluarFields.map((field) => (
              <Form.Group className="mb-3" key={field.name}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  name={field.name}
                  type={field.type}
                  value={updateFormData[field.name] || ""}
                  onChange={(e) => handleInputChange(e, "update")}
                />
              </Form.Group>
            ))}
            <Form.Group>
              <Form.Label>Distributor</Form.Label>
              <Form.Select
                value={updateFormData.id_distributor || ""}
                onChange={(e) =>
                  setUpdateFormData({
                    ...updateFormData,
                    id_distributor: e.target.value,
                  })
                }>
                <option value="">-- Pilih Distributor --</option>
                {distributor.map((dist) => (
                  <option key={dist.id_distributor} value={dist.id_distributor}>
                    {dist.id_distributor} - {dist.nama_dist}
                  </option>
                ))}
              </Form.Select>
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
            className="submit-button">
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
