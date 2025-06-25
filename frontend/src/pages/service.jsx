import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./Service.module.css";
import { Search, SquarePen, Trash2 } from "lucide-react";

const TABLE_HEADER = [
  "Tanggal Masuk",
  "Tanggal Selesai",
  "Nama Barang",
  "Jenis Service",
  "Biaya Service",
  "Status",
];

const JENIS_SERVICE_OPTIONS = [
  "Laptop",
  "Smartphone",
  "Audio",
  "Display",
  "Aksesoris",
  "Komponen PC",
  "Jaringan",
  "Penyimpanan Data",
  "Peralatan Rumah Tangga",
  "Keamanan & Smart Phone",
];

function SearchInput({
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
  onKeyDown,
}) {
  return (
    <div className="search-input">
      {Icon && <Icon size={20} className="search-icon" />}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

export default function Service() {
  const [service, setService] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [searchNamaBarang, setSearchNamaBarang] = useState("");
  const [searchTanggal, setSearchTanggal] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [updateData, setUpdateData] = useState({});
  const [formData, setFormData] = useState({
    id_petugas: "",
    id_kategori: "",
    jenis_barang: "",
    nama_barang: "",
    tanggal_masuk: "",
    tanggal_keluar: "",
    keterangan: "",
    status: "Proses",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/service");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setService(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }; // --- Handle Input Change for Add Form ---

  const handleSearch = async () => {
    let queryParams = [];
    if (searchNamaBarang) queryParams.push(`nama_barang=${searchNamaBarang}`);
    if (searchTanggal) queryParams.push(`tanggal_masuk=${searchTanggal}`);
    if (searchStatus) queryParams.push(`status=${searchStatus}`);

    const queryString = queryParams.join("&");
    const url = queryString
      ? `http://localhost:3000/api/join/find/service?${queryString}`
      : "http://localhost:3000/api/join/find/service";

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch filtered data");
      const data = await res.json();
      setService(data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  const handleAddService = async () => {
    // Validasi: id_petugas dan id_kategori tidak boleh kosong
    // if (!formData.id_petugas || !formData.id_kategori) {
    //   alert("ID Petugas dan ID Kategori tidak boleh kosong!");
    //   return;
    // }
    handleSearchIDKategoriByName(formData.nama_barang);
    handleSearchJenisBarangByID(formData.id_kategori);
    // Ensure id_kategori is set before sending
    // if (!formData.id_petugas || !formData.id_kategori) {
    //   alert("ID Petugas dan ID Kategori tidak boleh kosong!");
    //   return;
    // }
    try {
      const response = await fetch("http://localhost:3000/api/join/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to add transaction");
      await response.json();
      fetchProducts();
      setShowModal(false);
      setFormData({
        id_petugas: "",
        id_kategori: "",
        jenis_barang: "",
        nama_barang: "",
        tanggal_masuk: "",
        tanggal_keluar: "",
        keterangan: "",
        status: "Proses",
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleUpdateService = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/join/service", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error("Failed to update transaction");
      await response.json();
      fetchProducts();
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  // Function to fetch id_kategori based on nama_barang
  const handleSearchIDKategoriByName = async (namaBarang) => {
    console.log("Searching for id_kategori by nama_barang:", namaBarang);
    try {
      const res = await fetch(
        `http://localhost:3000/api/join/find/barang?nama_barang=${namaBarang}`
      );
      if (!res.ok) throw new Error("Failed to fetch category ID");
      const data = await res.json();
      const id_kategori =
        Array.isArray(data) && data.length > 0 ? data[0].id_kategori : "";
      setFormData((prevData) => ({
        ...prevData,
        id_kategori: id_kategori,
      }));
      console.log("Fetched id_kategori:", id_kategori);
    } catch (error) {
      console.error("Error fetching category ID:", error);
      setFormData((prevData) => ({
        ...prevData,
        id_kategori: "", // Clear on error
      }));
    }
  };

  const handleSearchJenisBarangByID = async (id) => {
    console.log("Searching for jenis_barnag by id:", id);
    try {
      const res = await fetch(
        `http://localhost:3000/api/join/find/kategori?id_kategori=${id}`
      );
      if (!res.ok) throw new Error("Failed to fetch category ID");
      const data = await res.json();
      const jenis_barang =
        Array.isArray(data) && data.length > 0 ? data[0].nama_kategori : "";
      setFormData((prevData) => ({
        ...prevData,
        jenis_barang: jenis_barang,
      }));
      console.log("Fetched jenis_barang:", jenis_barang);
    } catch (error) {
      console.error("Error fetching category ID:", error);
      setFormData((prevData) => ({
        ...prevData,
        jenis_barang: "", // Clear on error
      }));
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "nama_barang") {
      handleSearchIDKategoriByName(value);
    }
    setFormData({
      ...formData,
      [name]: value,
    });
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
    // e.preventDefault();
    console.log("Key pressed:", e.key);
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="product-page">
      <h1>Service</h1>
      <p>
        This is the service transaction page where you can view and manage
        service transactions.
      </p>

      <div className="search-bar">
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
          value={setSearchTanggal}
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
        <button className="add-button add" onClick={() => setShowModal(true)}>
          + Tambah Service
        </button>
      </div>
      {/* 
      <div className="search-bar">
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
        <input
          type="text"
          placeholder="Nama Barang"
          value={searchNamaBarang}
          onChange={(e) => setSearchNamaBarang(e.target.value)}
        />
        <input
          type="date"
          value={searchTanggal}
          onChange={(e) => setSearchTanggal(e.target.value)}
        />
        <input
          type="text"
          placeholder="Status"
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        />
        <button className="add-button" onClick={() => setShowModal(true)}>
          + Add Product
        </button>
      </div> */}

      <table>
        <thead>
          <tr>
            {TABLE_HEADER.map((header) => (
              <th key={header}>{header}</th>
            ))}
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {service.map((item) => (
            <tr key={item.id_service}>
              <td>{formatDate(item.tanggal_masuk)}</td>
              <td>{formatDate(item.tanggal_keluar)}</td>
              <td>{item.nama_barang}</td>
              <td>{item.jenis_barang}</td>
              <td>{item.biaya_service}</td>
              <td>{item.status}</td>
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
                  Update
                </button>
                {/* <button
                  onClick={() => handleDelete(item.id_service)}
                  style={{ marginLeft: "6px", backgroundColor: "#e53e3e" }}>
                  Delete
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Tambah */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Tambah Barang Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal Masuk</Form.Label>
              <Form.Control
                type="date"
                value={formData.tanggal_masuk}
                onChange={(e) =>
                  setFormData({ ...formData, tanggal_masuk: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Barang</Form.Label>
              <Form.Control
                type="text"
                name="nama_barang"
                value={formData.nama_barang}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jenis Service</Form.Label>
              <Form.Select
                value={formData.jenis_barang}
                onChange={(e) =>
                  setFormData({ ...formData, jenis_barang: e.target.value })
                }>
                {JENIS_SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ID Petugas</Form.Label>
              <Form.Control
                type="text"
                placeholder="PTG001"
                value={formData.id_petugas}
                onChange={(e) =>
                  setFormData({ ...formData, id_petugas: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
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
        dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Update Barang Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal Masuk</Form.Label>
              <Form.Control
                type="date"
                value={updateData.tanggal_masuk || ""}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    tanggal_masuk: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Barang</Form.Label>
              <Form.Control
                type="text"
                value={updateData.nama_barang || ""}
                onChange={(e) =>
                  setUpdateData({ ...updateData, nama_barang: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jenis Service</Form.Label>
              <Form.Select
                value={updateData.jenis_barang || ""}
                onChange={(e) =>
                  setUpdateData({ ...updateData, jenis_barang: e.target.value })
                }>
                {JENIS_SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal Keluar</Form.Label>
              <Form.Control
                type="date"
                value={updateData.tanggal_keluar || ""}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    tanggal_keluar: e.target.value,
                  })
                }
              />
            </Form.Group>
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
