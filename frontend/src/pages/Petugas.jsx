import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Search, SquarePen, Trash2, CirclePlus } from "lucide-react";
import SearchInput from "../component/SearchInput";
import {
  fetchPetugas,
  addPetugas,
  updatePetugas,
  generateNewID,
  searchPetugas,
} from "../api/petugas";
import { TABLE_HEADER, PetugasFields } from "../data/PetugasFields";
import styles from "./page.module.css";

const EMPTY_FORM_DATA = {
  id_petugas: "",
  nama_petugas: "",
  username: "",
  password: "",
  status: "",
};

const EMPTY_UPDATE_DATA = {
  id_petugas: "",
  nama_petugas: "",
  username: "",
  status: "",
};

export default function Petugas() {
  const [petugas, setpetugas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [searchIDpetugas, setSearchIDpetugas] = useState("");
  const [searchNamaPetugas, setSearchNamaPetugas] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const [formData, setFormData] = useState(EMPTY_FORM_DATA);
  const [updateData, setUpdateData] = useState(EMPTY_UPDATE_DATA);

  useEffect(() => {
    handleFetch();
  }, []);

  useEffect(() => {
    if (showModal) handleNewID();
  }, [showModal]);

  const handleFetch = async () => {
    try {
      const data = await fetchPetugas();
      setpetugas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    let query = [];
    if (searchIDpetugas) query.push(`id_petugas=${searchIDpetugas}`);
    if (searchNamaPetugas) query.push(`nama_petugas=${searchNamaPetugas}`);
    if (searchStatus) query.push(`status=${searchStatus}`);

    if (query.length === 0) return handleFetch();
    const queryString = query.join("&");

    try {
      const data = await searchPetugas(queryString);
      setpetugas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewID = async () => {
    try {
      const newID = await generateNewID();
      setFormData((prev) => ({ ...prev, id_petugas: newID }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddpetugas = async () => {
    try {
      await addPetugas(formData);
      handleFetch();
      setShowModal(false);
      setFormData(EMPTY_FORM_DATA);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatepetugas = async () => {
    try {
      await updatePetugas(updateData);
      handleFetch();
      setShowUpdateModal(false);
      setUpdateData(EMPTY_UPDATE_DATA);
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
      <h1>Petugas</h1>
      <p>Halaman ini menampilkan dan mengelola data petugas.</p>

      <div className={styles["search-bar"]}>
        <SearchInput
          icon={Search}
          value={searchIDpetugas}
          onKeyDown={handleSearchKeyDown}
          onChange={(e) => setSearchIDpetugas(e.target.value)}
          placeholder="ID Petugas"
        />
        <SearchInput
          icon={Search}
          value={searchNamaPetugas}
          onChange={(e) => setSearchNamaPetugas(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Nama Petugas"
        />
        <SearchInput
          icon={Search}
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Status "
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
                  styles[`${header === "Status" ? "status-head" : ""}`]
                }>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {petugas.map((item) => (
            <tr key={item.id_petugas}>
              <td>{item.id_petugas}</td>
              <td>
                <div
                  className={[
                    styles.status,
                    item.status === "aktif"
                      ? styles.aktif
                      : styles["non-aktif"],
                  ].join(" ")}>
                  {item.status}
                </div>
              </td>
              <td>{item.nama_petugas}</td>
              <td>{item.username}</td>

              <td>
                <button
                  onClick={() => {
                    setUpdateData(item);
                    setShowUpdateModal(true);
                  }}>
                  <SquarePen size={20} />
                </button>
                {/* <button onClick={() => handleDeletepetugas(item.id_petugas)} style={{ marginLeft: "6px", backgroundColor: "#e53e3e", color: "white" }}>Delete</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal Tambah */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header className="p-4 pb-3 m-2" closeButton>
          <Modal.Title>Tambah petugas</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 pt-2 pb-2 m-2">
          <Form>
            {PetugasFields.map((field) => (
              <Form.Group className="mb-3" key={field.name}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  type={field.type}
                  value={formData[field.name]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  disabled={field.name === "id_petugas"}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer className="p-3 m-2">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleAddpetugas}>
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
          <Modal.Title>Update Petugas</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 pt-2 pb-2 m-2">
          <Form>
            {PetugasFields.map((field) => (
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
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={updateData.status}
                onChange={(e) =>
                  setUpdateData({ ...updateData, status: e.target.value })
                }>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Non-Aktif</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="p-3 m-2">
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleUpdatepetugas}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
