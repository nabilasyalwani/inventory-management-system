import React, { useState, useEffect } from "react";
import { Modal, Button, Card, Form, Col, Row } from "react-bootstrap";
import { Search, SquarePen, Trash2, CirclePlus } from "lucide-react";
import SearchInput from "../component/SearchInput";
import { fetchKategori } from "../api/kategori"; // Mengambil daftar dist
import { searchIDKategori } from "../api/service";
import {
  TABLE_HEADER,
  EMPTY_FORM_DATA,
  BarangFields,
} from "../data/BarangFields";
import {
  fetchBarang,
  addBarang,
  updateBarang,
  searchBarang,
  generateNewID,
  searchIDKategoriByName,
} from "../api/barang";
import "./ProductPage.css";
import styles from "./page.module.css";

export default function ProductPage() {
  const [barang, setBarang] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false); // Renamed for clarity (previously showModal)
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [searchStok, setSearchStok] = useState("");
  const [searchNamaBarang, setSearchNamaBarang] = useState("");
  const [searchInputIDKategori, setSearchInputIDKategori] = useState(""); // Used for Kategori Barang Input input
  const [searchFixIDKategori, setSearchFixIDKategori] = useState(""); // Used for Kategori Barang Input input

  const [updateData, setUpdateData] = useState(EMPTY_FORM_DATA);
  const [addFormData, setAddFormData] = useState(EMPTY_FORM_DATA);

  useEffect(() => {
    handleFetch();
    fetchKategori().then((data) => {
      setKategori(data);
    });
  }, []);

  useEffect(() => {
    if (showAddModal) handleNewID();
  }, [showAddModal]);

  const handleFetch = async () => {
    try {
      const data = await fetchBarang();
      setBarang(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    let query = [];
    if (searchFixIDKategori) query.push(`id_kategori=${searchFixIDKategori}`);
    if (searchNamaBarang) query.push(`nama_barang=${searchNamaBarang}`);
    if (searchStok) query.push(`stok=${searchStok}`);

    if (query.length === 0) return handleFetch();
    const queryString = query.join("&");

    try {
      const data = await searchBarang(queryString);
      setBarang(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchIDKategoriByBarang = async (namaBarang) => {
    try {
      const data = await searchIDKategori(namaBarang);
      setAddFormData((prevData) => ({
        ...prevData,
        id_kategori: data,
      }));
      setUpdateData((prevData) => ({
        ...prevData,
        id_kategori: data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchIDKategoriByName = async (namaKategori) => {
    console.log("Searching for ID Kategori by name:", namaKategori);
    try {
      const data = await searchIDKategoriByName(namaKategori);
      console.log("ID Kategori found:", data);
      setSearchFixIDKategori(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewID = async () => {
    try {
      const newID = await generateNewID();
      setAddFormData((prev) => ({ ...prev, id_barang: newID }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddbarang = async () => {
    try {
      await addBarang(addFormData);
      handleFetch();
      setShowAddModal(false);
      setAddFormData(EMPTY_FORM_DATA);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatebarang = async () => {
    try {
      await updateBarang(updateData);
      handleFetch();
      setShowUpdateModal(false);
      setUpdateData(EMPTY_FORM_DATA);
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
    } else if (modal === "add") {
      setAddFormData({
        ...addFormData,
        [name]: value,
      });
    } else if (modal === "search") {
      handleSearchIDKategoriByName(value);
      setSearchInputIDKategori(value);
    }
    if (name === "nama_barang") {
      handleSearchIDKategoriByBarang(value);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles["product-page"]}>
      <div className="product-page-container">
        <h1 className="page-title">Barang</h1>
        <p className="page-description">
          Halaman ini menampilkan dan mengelola data barang.
        </p>
        <div className={styles["search-bar"]}>
          <SearchInput
            icon={Search}
            value={searchNamaBarang}
            onKeyDown={handleSearchKeyDown}
            onChange={(e) => setSearchNamaBarang(e.target.value)}
            placeholder="Nama Barang"
          />
          <SearchInput
            icon={Search}
            value={searchInputIDKategori}
            onChange={(e) => handleInputChange(e, "search")}
            onKeyDown={handleSearchKeyDown}
            placeholder="Nama Kategori"
          />
          <SearchInput
            icon={Search}
            value={searchStok}
            onChange={(e) => setSearchStok(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="XX-XX"
          />
          <button
            className={styles["add-button"]}
            onClick={() => setShowAddModal(true)}>
            <CirclePlus size={20} />
            Tambah
          </button>
        </div>
        <hr className="divider" />
        <div className="product-cards-grid">
          {barang.length > 0 ? (
            barang.map((item) => (
              <Card key={item.id_barang} className="product-card">
                <Card.Img
                  variant="top"
                  src={`/dummy_img.jpeg`}
                  className="card-img-top"
                />
                <Card.Body className="card-body">
                  <p className="product-category">
                    {item.nama_kategori || item.id_kategori}
                  </p>
                  <h5 className="product-name">{item.nama_barang}</h5>
                  <p className="product-id-small">ID: {item.id_barang}</p>
                  <div className="product-details">
                    <div className="product-price-info">
                      <div className="price-item">
                        <span className="price-label">Harga Beli:</span>
                        <span className="product-price-value">
                          Rp{" "}
                          {parseFloat(item.harga_beli).toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="price-item">
                        <span className="price-label">Harga Jual:</span>
                        <span className="product-price-value">
                          Rp{" "}
                          {parseFloat(item.harga_jual).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="card-actions">
                    <span className="product-stock">
                      Stok: {item.stok} {item.satuan}
                    </span>{" "}
                    <Button
                      className="btn-action btn-update"
                      onClick={() => {
                        setUpdateData(item);
                        setShowUpdateModal(true);
                      }}>
                      <SquarePen size={20} />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p className="no-products-message">
              Loading products or no products found...
            </p>
          )}
        </div>
      </div>

      {/* Modal Tambah */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        scrollable>
        <Modal.Header closeButton className="p-4 pb-3 m-2">
          <Modal.Title>Tambah Barang</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 pt-2 pb-2 m-2">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Kategori</Form.Label>
              <Form.Select
                value={addFormData.id_kategori || ""}
                onChange={(e) =>
                  setAddFormData({
                    ...addFormData,
                    id_kategori: e.target.value,
                  })
                }>
                <option value="">-- Pilih Kategori --</option>
                {kategori.map((jenis) => (
                  <option key={jenis.id_kategori} value={jenis.id_kategori}>
                    {jenis.id_kategori} - {jenis.nama_kategori}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {BarangFields.map((field) => (
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
          </Form>
        </Modal.Body>
        <Modal.Footer className="p-3 m-2">
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleAddbarang}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Update */}
      <Modal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        centered
        scrollable>
        <Modal.Header closeButton className="p-4 pb-3 m-2">
          <Modal.Title>Update Barang Service</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 pt-2 pb-2 m-2">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Kategori</Form.Label>
              <Form.Select
                value={updateData.id_kategori || ""}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    id_kategori: e.target.value,
                  })
                }>
                <option value="">-- Pilih Kategori --</option>
                {kategori.map((jenis) => (
                  <option key={jenis.id_kategori} value={jenis.id_kategori}>
                    {jenis.id_kategori} - {jenis.nama_kategori}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {BarangFields.map((field) => (
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
          <Button variant="primary" onClick={handleUpdatebarang}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
