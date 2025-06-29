import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Search, SquarePen, Trash2, CirclePlus } from "lucide-react";
import {
  TABLE_HEADER,
  addServiceFields,
  updateServiceFields,
  EMPTY_FORM_DATA,
} from "../data/ServiceFields";
import {
  fetchService,
  addService,
  updateService,
  deleteService,
  searchService,
  searchIDKategori,
  searchJenisBarangByID,
} from "../api/service";
import SearchInput from "../component/SearchInput";
import styles from "./page.module.css";

export default function Service() {
  const [service, setService] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [searchNamaBarang, setSearchNamaBarang] = useState("");
  const [searchTanggal, setSearchTanggal] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [updateData, setUpdateData] = useState(EMPTY_FORM_DATA);
  const [formData, setFormData] = useState(EMPTY_FORM_DATA);

  useEffect(() => {
    handleFetch();
    setIDPetugas();
  }, []);

  const setIDPetugas = () => {
    const id_petugas = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).id_petugas
      : "";
    setFormData((prevData) => ({
      ...prevData,
      id_petugas: id_petugas,
    }));
  };

  const handleFetch = async () => {
    try {
      const data = await fetchService();
      setService(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    let query = [];
    if (searchNamaBarang) query.push(`nama_barang=${searchNamaBarang}`);
    if (searchTanggal) query.push(`tanggal_masuk=${searchTanggal}`);
    if (searchStatus) query.push(`status=${searchStatus}`);

    if (query.length === 0) return handleFetch();
    const queryString = query.join("&");

    try {
      const data = await searchService(queryString);
      setService(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddService = async () => {
    try {
      await addService(formData);
      handleFetch();
      setShowModal(false);
      setFormData(EMPTY_FORM_DATA);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateService = async () => {
    try {
      await updateService(updateData);
      handleFetch();
      setShowUpdateModal(false);
      setUpdateData(EMPTY_FORM_DATA);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus service ini?")) {
      try {
        await deleteService(id);
        handleFetch();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSearchIDKategoriByName = async (namaBarang) => {
    try {
      const data = await searchIDKategori(namaBarang);
      handleSearchJenisBarangByID(data);
      setFormData((prevData) => ({
        ...prevData,
        id_kategori: data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchJenisBarangByID = async (id) => {
    try {
      const data = await searchJenisBarangByID(id);
      setFormData((prevData) => ({
        ...prevData,
        jenis_barang: data,
      }));
      setUpdateData((prevData) => ({
        ...prevData,
        jenis_barang: data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e, modal) => {
    const { name, value } = e.target;
    if (modal === "update") {
      setUpdateData({
        ...updateData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    if (name === "nama_barang") {
      handleSearchIDKategoriByName(value);
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
      <h1>Service</h1>
      <p>Halaman ini menampilkan dan mengelola data service.</p>

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
          icon={Search}
          type="text"
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Status"
        />
        <button
          className={styles["add-button"]}
          onClick={() => setShowModal(true)}>
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
                  header === "Status"
                    ? styles["status-head"]
                    : header === "Biaya Service"
                    ? styles["biaya-head"]
                    : ""
                }>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {service.map((item) => (
            <tr key={item.id_service}>
              <td>{formatDate(item.tanggal_masuk)}</td>
              <td>{formatDate(item.tanggal_keluar)}</td>
              <td>{item.nama_barang}</td>
              <td>{item.jenis_barang}</td>
              <td className={styles.biaya}>
                {parseFloat(item.biaya_service).toLocaleString("id-ID")}
              </td>
              <td>
                <div
                  className={[
                    styles.status,
                    item.status === "Selesai"
                      ? styles.aktif
                      : styles["non-aktif"],
                  ].join(" ")}>
                  {item.status}
                </div>
              </td>
              <td>
                <button
                  onClick={() => {
                    setUpdateData({
                      ...item,
                      tanggal_masuk: toInputDateFormat(item.tanggal_masuk),
                      tanggal_keluar: toInputDateFormat(item.tanggal_keluar),
                    });
                    setShowUpdateModal(true);
                  }}>
                  <SquarePen size={20} />
                </button>
                <button
                  onClick={() => handleDeleteService(item.id_service)}
                  style={{ marginLeft: "6px", backgroundColor: "#e53e3e" }}>
                  <Trash2 size={20} color="white" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Tambah */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="p-4 pb-3 m-2">
          <Modal.Title>Tambah Barang Service</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 pt-2 pb-2 m-2">
          <Form>
            {addServiceFields.map((field) => (
              <Form.Group className="mb-3" key={field.name}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={(e) => handleInputChange(e, "add")}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer className="p-3 m-2">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleAddService}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Update */}
      <Modal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        centered>
        <Modal.Header closeButton className="p-4 pb-3 m-2">
          <Modal.Title>Update Barang Service</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 pt-2 pb-2 m-2">
          <Form>
            {updateServiceFields.map((field) => (
              <Form.Group className="mb-3" key={field.name}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  name={field.name}
                  type={field.type}
                  value={updateData[field.name] || ""}
                  onChange={(e) => handleInputChange(e, "update")}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleUpdateService}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
