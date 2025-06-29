import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Search, SquarePen, Trash2, CirclePlus } from "lucide-react";
import SearchInput from "../component/SearchInput";
import {
  fetchKategori,
  addKategori,
  updateKategori,
  generateNewID,
  searchKategori,
} from "../api/kategori";
import {
  TABLE_HEADER,
  KategoriFields,
  EMPTY_FORM_DATA,
} from "../data/KategoriFields";
import styles from "./page.module.css";

export default function Kategori() {
  const [kategori, setkategori] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [searchIDkategori, setSearchIDkategori] = useState("");
  const [searchNamaKategori, setSearchNamaKategori] = useState("");
  const [searchNoRak, setSearchNoRak] = useState("");

  const [formData, setFormData] = useState(EMPTY_FORM_DATA);
  const [updateData, setUpdateData] = useState(EMPTY_FORM_DATA);

  useEffect(() => {
    handleFetch();
  }, []);

  useEffect(() => {
    if (showModal) handleNewID();
  }, [showModal]);

  const handleFetch = async () => {
    try {
      const data = await fetchKategori();
      setkategori(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    let query = [];
    if (searchIDkategori) query.push(`id_kategori=${searchIDkategori}`);
    if (searchNamaKategori) query.push(`nama_kategori=${searchNamaKategori}`);
    if (searchNoRak) query.push(`no_rak=${searchNoRak}`);

    if (query.length === 0) return handleFetch();
    const queryString = query.join("&");

    try {
      const data = await searchKategori(queryString);
      setkategori(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewID = async () => {
    try {
      const newID = await generateNewID();
      setFormData((prev) => ({ ...prev, id_kategori: newID }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddkategori = async () => {
    try {
      await addKategori(formData);
      handleFetch();
      setShowModal(false);
      setFormData(EMPTY_FORM_DATA);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatekategori = async () => {
    try {
      await updateKategori(updateData);
      handleFetch();
      setShowUpdateModal(false);
      setUpdateData(EMPTY_FORM_DATA);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles["product-page"]}>
      <h1>Kategori</h1>
      <p>Halaman ini menampilkan dan mengelola data kategori.</p>

      <div className={styles["search-bar"]}>
        <SearchInput
          icon={Search}
          value={searchIDkategori}
          onKeyDown={handleSearchKeyDown}
          onChange={(e) => setSearchIDkategori(e.target.value)}
          placeholder="ID Kategori"
        />
        <SearchInput
          icon={Search}
          value={searchNamaKategori}
          onChange={(e) => setSearchNamaKategori(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Nama Kategori"
        />
        <SearchInput
          icon={Search}
          value={searchNoRak}
          onChange={(e) => setSearchNoRak(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="No Rak "
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
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {kategori.map((item) => (
            <tr key={item.id_kategori}>
              <td>{item.id_kategori}</td>
              <td>{item.nama_kategori}</td>
              <td>{item.no_rak}</td>
              <td>
                <button
                  onClick={() => {
                    setUpdateData(item);
                    setShowUpdateModal(true);
                  }}>
                  <SquarePen size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal Tambah */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header className="p-4 pb-3 m-2" closeButton>
          <Modal.Title>Tambah kategori</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 pt-2 pb-2 m-2">
          <Form>
            {KategoriFields.map((field) => (
              <Form.Group className="mb-3" key={field.name}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  type={field.type}
                  value={formData[field.name]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  disabled={field.name === "id_kategori"}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer className="p-3 m-2">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleAddkategori}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Update */}
      <Modal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        centered>
        <Modal.Header className="p-4 pb-3 m-2" closeButton>
          <Modal.Title>Update Kategori</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 pt-2 pb-2 m-2">
          <Form>
            {KategoriFields.map((field) => (
              <Form.Group className="mb-3" key={field.name}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  type={field.type}
                  value={updateData[field.name]}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      [field.name]: e.target.value,
                    })
                  }
                  disabled={field.disabled}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer className="p-3 m-2">
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleUpdatekategori}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
