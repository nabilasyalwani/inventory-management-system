import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Search, SquarePen, Trash2, CirclePlus } from "lucide-react";
import SearchInput from "../component/SearchInput";
import {
  fetchSuppliers,
  searchSupplier,
  generateNewID,
  addSupplier,
  updateSupplier,
} from "../api/supplier";
import { TABLE_HEADER, SupplierFields } from "../data/SupplierFields";
import styles from "./page.module.css";

const EMPTY_FORM_DATA = {
  id_supplier: "",
  nama_supplier: "",
  alamat_supplier: "",
  no_telp_supplier: "",
};

const EMPTY_UPDATE_DATA = {
  id_supplier: "",
  nama_supplier: "",
  alamat_supplier: "",
  no_telp_supplier: "",
  status: "",
};

export default function SupplierPage() {
  const [supplier, setSupplier] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [searchIDSupplier, setSearchIDSupplier] = useState("");
  const [searchNamaSupplier, setSearchNamaSupplier] = useState("");
  const [searchStatusSupplier, setSearchStatusSupplier] = useState("");
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
      const data = await fetchSuppliers();
      setSupplier(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    let query = [];
    if (searchIDSupplier) query.push(`id_supplier=${searchIDSupplier}`);
    if (searchNamaSupplier) query.push(`nama_supplier=${searchNamaSupplier}`);
    if (searchStatusSupplier) query.push(`status=${searchStatusSupplier}`);

    if (query.length === 0) return handleFetch();
    const queryString = query.join("&");

    try {
      const data = await searchSupplier(queryString);
      setSupplier(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewID = async () => {
    try {
      const newID = await generateNewID();
      setFormData((prev) => ({ ...prev, id_supplier: newID }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSupplier = async () => {
    try {
      await addSupplier(formData);
      handleFetch();
      setShowModal(false);
      setFormData(EMPTY_FORM_DATA);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateSupplier = async () => {
    try {
      await updateSupplier(updateData);
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
      <h1>Supplier</h1>
      <p>Halaman ini menampilkan dan mengelola data supplier.</p>

      {/* Search Bar */}
      <div className={styles["search-bar"]}>
        <SearchInput
          icon={Search}
          value={searchIDSupplier}
          onKeyDown={handleSearchKeyDown}
          onChange={(e) => setSearchIDSupplier(e.target.value)}
          placeholder="ID Supplier"
        />
        <SearchInput
          icon={Search}
          value={searchNamaSupplier}
          onChange={(e) => setSearchNamaSupplier(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Nama Supplier"
        />
        <SearchInput
          icon={Search}
          value={searchStatusSupplier}
          onChange={(e) => setSearchStatusSupplier(e.target.value)}
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
                  styles[`${header === "Status" ? "status-head" : ""}`]
                }>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {supplier.map((item) => (
            <tr key={item.id_supplier}>
              <td>{item.id_supplier}</td>
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
              <td>{item.nama_supplier}</td>
              <td>{item.alamat_supplier}</td>
              <td>{item.no_telp_supplier}</td>
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
          <Modal.Title>Tambah Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 pt-2 pb-2 m-2">
          <Form>
            {SupplierFields.map((field) => (
              <Form.Group className="mb-3" key={field.name}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  type={field.type}
                  value={formData[field.name]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  disabled={field.name === "id_supplier"}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer className="p-3 m-2">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleAddSupplier}>
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
          <Modal.Title>Update Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 pt-2 pb-2 m-2">
          <Form>
            {SupplierFields.map((field) => (
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
          <Button variant="primary" onClick={handleUpdateSupplier}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
