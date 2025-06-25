import React, { useState, useEffect } from "react";
import { Search, SquarePen, Trash2, CirclePlus } from "lucide-react";
import { Modal, Button, Form } from "react-bootstrap";
import SearchInput from "../component/SearchInput";
import {
  fetchDistributor,
  addDistributor,
  updateDistributor,
  generateNewID,
  searchDistributor,
} from "../api/distributor";
import { TABLE_HEADER, DistributorFields } from "../data/DistributorFields";
import styles from "./page.module.css";

const EMPTY_FORM_DATA = {
  id_distributor: "",
  nama_distributor: "",
  alamat_distributor: "",
  no_telp_distributor: "",
};

const EMPTY_UPDATE_DATA = {
  id_distributor: "",
  nama_distributor: "",
  alamat_distributor: "",
  no_telp_distributor: "",
  status: "",
};

export default function DistributorPage() {
  const [distributor, setDistributor] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [searchIDDistributor, setSearchIDDistributor] = useState("");
  const [searchNamaDistributor, setSearchNamaDistributor] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const [updateData, setUpdateData] = useState(EMPTY_FORM_DATA);
  const [formData, setFormData] = useState(EMPTY_UPDATE_DATA);

  useEffect(() => {
    handleFetch();
  }, []);

  useEffect(() => {
    if (showModal) handleNewID();
  }, [showModal]);

  const handleFetch = async () => {
    try {
      const data = await fetchDistributor();
      setDistributor(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    let query = [];
    if (searchIDDistributor)
      query.push(`id_distributor=${searchIDDistributor}`);
    if (searchNamaDistributor)
      query.push(`nama_distributor=${searchNamaDistributor}`);
    if (searchStatus) query.push(`status=${searchStatus}`);

    if (query.length === 0) return handleFetch();
    const queryString = query.join("&");

    try {
      const data = await searchDistributor(queryString);
      setDistributor(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewID = async () => {
    try {
      const newID = await generateNewID();
      setFormData((prev) => ({ ...prev, id_distributor: newID }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddDistributor = async () => {
    try {
      await addDistributor(formData);
      handleFetch();
      setShowModal(false);
      setFormData(EMPTY_FORM_DATA);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateDistributor = async () => {
    try {
      await updateDistributor(updateData);
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
      <h1>Distributor Page</h1>
      <p>Halaman ini menampilkan dan mengelola data distributor.</p>

      <div className={styles["search-bar"]}>
        <SearchInput
          icon={Search}
          value={searchIDDistributor}
          onKeyDown={handleSearchKeyDown}
          onChange={(e) => setSearchIDDistributor(e.target.value)}
          placeholder="ID Distributor"
        />
        <SearchInput
          icon={Search}
          value={searchNamaDistributor}
          onChange={(e) => setSearchNamaDistributor(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Nama Distributor"
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
          {distributor.map((item) => (
            <tr key={item.id_distributor}>
              <td>{item.id_distributor}</td>
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
              <td>{item.nama_distributor}</td>
              <td>{item.alamat_distributor}</td>
              <td>{item.no_telp_distributor}</td>
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
        <Modal.Header closeButton className="p-4 pb-3 m-2">
          <Modal.Title>Tambah Distributor</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 pt-2 pb-2 m-2">
          <Form>
            {DistributorFields.map((field) => (
              <Form.Group className="mb-3" key={field.name}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  type={field.type}
                  value={formData[field.name]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  disabled={field.name === "id_distributor"}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer className="p-3 m-2">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleAddDistributor}>
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
          <Modal.Title>Update Distributor</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 pt-2 pb-2 m-2">
          <Form>
            {DistributorFields.map((field) => (
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
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleUpdateDistributor}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
