import React, { useState, useEffect } from "react";
// Import Bootstrap components
import { Button, Card, Form, Col, Row } from "react-bootstrap";
// Make sure you have react-bootstrap installed: npm install react-bootstrap bootstrap
// And include Bootstrap CSS in your main entry file (e.g., index.js): import 'bootstrap/dist/css/bootstrap.min.css';

import "./ProductPage.module.css"; // For custom page-level styles

const TABLE_HEADER = [
  // These headers are less relevant for a card layout, but kept for context.
  // The card will display these details visually.
  "ID Barang",
  "Nama Barang",
  "Stok",
  "Harga Beli",
  "Harga Jual",
  "Kategori",
  "Actions",
];

// const JENIS_SERVICE_OPTIONS = [ // This seems to be used as categories for barang
//   "Laptop",
//   "Smartphone",
//   "Audio",
//   "Display",
//   "Aksesoris",
//   "Komponen PC",
//   "Jaringan",
//   "Penyimpanan Data",
//   "Peralatan Rumah Tangga",
//   "Keamanan & Smart Home",
// ];

export default function ProductPage() {
  const [barang, setBarang] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false); // Renamed for clarity (previously showModal)
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Search states
  const [searchStok, setSearchStok] = useState("");
  // const [searchIDBarang, setSearchIDBarang] = useState("");
  const [searchNamaBarang, setSearchNamaBarang] = useState("");
  const [searchIDKategori, setSearchIDKategori] = useState(""); // Used for Kategori Barang search input

  // State for Update Modal form
  const [updateData, setUpdateData] = useState({
    id_barang: "",
    nama_barang: "",
    stok: "",
    harga_beli: "",
    harga_jual: "",
    id_kategori: "", // Added id_kategori to updateData
  });

  // State for Add Modal form
  const [addFormData, setAddFormData] = useState({
    // Renamed formData to addFormData for clarity
    id_barang: "",
    nama_barang: "",
    stok: "",
    harga_beli: "",
    harga_jual: "",
    jenis_barang: "", // Used for category selection in Add modal
    id_kategori: "", // Will be set based on jenis_barang selection
  });

  // --- Fetch Products Function ---
  const fetchProducts = async (searchParams = "") => {
    try {
      const url = `http://localhost:3000/api/barang/${
        searchParams ? "?" + searchParams : ""
      }`;
      const res = await fetch(url);
      if (!res.ok)
        throw new Error(`Failed to fetch products: ${res.statusText}`);
      const data = await res.json();
      setBarang(data);
      console.log("Fetched products:", data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const searchProducts = async (searchParams = "") => {
    try {
      const url = `http://localhost:3000/api/join/find/barang/${
        searchParams ? "?" + searchParams : ""
      }`;
      const res = await fetch(url);
      if (!res.ok)
        throw new Error(`Failed to fetch products: ${res.statusText}`);
      const data = await res.json();
      setBarang(data);
      console.log("Fetched products:", data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // --- Search Handlers ---
  const handleSearch = async () => {
    const queryParams = new URLSearchParams();
    // if (searchIDBarang) queryParams.append("id_barang", searchIDBarang);
    if (searchIDKategori) queryParams.append("id_kategori", searchIDKategori);
    if (searchNamaBarang) queryParams.append("nama_barang", searchNamaBarang);
    if (searchStok) queryParams.append("stok", searchStok);

    if (!searchIDKategori || !searchNamaBarang || !searchStok) fetchProducts();
    searchProducts(queryParams.toString());
  };

  // --- Add Modal Input Change Handler ---
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // If 'jenis_barang' (category name) changes, fetch its corresponding id_kategori
    if (name === "jenis_barang" && value) {
      handleSearchIDKategoriByName(value); // Changed to handle fetching by name
    } else if (name === "jenis_barang" && !value) {
      setAddFormData((prevData) => ({
        ...prevData,
        id_kategori: "", // Clear id_kategori if no category selected
      }));
    }
  };

  // Function to fetch id_kategori based on category name
  const handleSearchIDKategoriByName = async (categoryName) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/join/find/kategori?jenis_barang=${categoryName}`
      );
      if (!res.ok) throw new Error("Failed to fetch category ID");
      const data = await res.json();
      const id_kategori =
        Array.isArray(data) && data.length > 0 ? data[0].id_kategori : "";
      setAddFormData((prevData) => ({
        ...prevData,
        id_kategori: id_kategori,
      }));
    } catch (error) {
      console.error("Error fetching category ID:", error);
      setAddFormData((prevData) => ({
        ...prevData,
        id_kategori: "", // Clear on error
      }));
    }
  };

  // --- Add Product Handler ---
  const handleAddProduk = async () => {
    console.log("Adding new product with data:", addFormData);
    // Client-side validation
    if (
      !addFormData.id_barang ||
      !addFormData.nama_barang ||
      !addFormData.stok ||
      !addFormData.harga_beli ||
      !addFormData.harga_jual ||
      !addFormData.id_kategori
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/barang", {
        // Your API endpoint for adding barang
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_barang: addFormData.id_barang,
          nama_barang: addFormData.nama_barang,
          stok: parseInt(addFormData.stok), // Ensure stock is an integer
          harga_beli: parseFloat(addFormData.harga_beli), // Ensure numerical types
          harga_jual: parseFloat(addFormData.harga_jual), // Ensure numerical types
          id_kategori: addFormData.id_kategori,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text(); // Get raw error message
        throw new Error(`Failed to add product: ${errorText}`);
      }
      alert("Product added successfully!");
      fetchProducts(); // Refresh data
      setShowAddModal(false);
      setAddFormData({
        // Reset form
        id_barang: "",
        nama_barang: "",
        stok: "",
        harga_beli: "",
        harga_jual: "",
        jenis_barang: "",
        id_kategori: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      alert(`Failed to add product: ${error.message}`);
    }
  };

  // --- Update Product Handlers ---
  const handleUpdateClick = (item) => {
    // When opening update modal, set updateData with all relevant fields
    setUpdateData({
      id_barang: item.id_barang,
      nama_barang: item.nama_barang,
      stok: item.stok,
      harga_beli: item.harga_beli,
      harga_jual: item.harga_jual,
      // Assuming 'Kategori' in table is 'id_kategori' from API for update
      id_kategori: item.id_kategori,
    });
    setShowUpdateModal(true);
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateBarang = async () => {
    // Client-side validation for update form
    if (
      !updateData.id_barang ||
      !updateData.nama_barang ||
      !updateData.stok ||
      !updateData.harga_beli ||
      !updateData.harga_jual ||
      !updateData.id_kategori
    ) {
      alert("Please fill in all fields for update.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/join/barang", {
        // Your API endpoint for updating barang
        method: "PUT", // Or PATCH, depending on your API
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_barang: updateData.id_barang,
          nama_barang: updateData.nama_barang,
          stok: parseInt(updateData.stok),
          harga_beli: parseFloat(updateData.harga_beli),
          harga_jual: parseFloat(updateData.harga_jual),
          id_kategori: updateData.id_kategori,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update product: ${errorText}`);
      }
      alert("Product updated successfully!");
      fetchProducts(); // Refresh data
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Error updating product:", error);
      alert(`Failed to update product: ${error.message}`);
    }
  };

  // --- Delete Product Handler ---
  const handleDeleteBarang = async (id_barang) => {
    if (
      window.confirm(
        `Are you sure you want to delete product with ID: ${id_barang}?`
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/barang/${id_barang}`,
          {
            // Your API endpoint for deleting barang
            method: "DELETE",
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete product: ${errorText}`);
        }
        alert("Product deleted successfully!");
        fetchProducts(); // Refresh data
      } catch (error) {
        console.error("Error deleting product:", error);
        alert(`Failed to delete product: ${error.message}`);
      }
    }
  };

  // --- Form Validation for Add Modal ---
  const isAddFormValid = Object.values(addFormData).every((value) => {
    // Exclude 'id_kategori' from direct check if it's derived, but ensure jenis_barang is selected
    if (value === addFormData.jenis_barang) {
      return addFormData.id_kategori !== ""; // Only check id_kategori if jenis_barang is selected
    }
    return String(value).trim() !== "";
  });

  // --- Form Validation for Update Modal ---
  const isUpdateFormValid = Object.values(updateData).every(
    (value) => String(value).trim() !== ""
  );

  const handleSearchKeyDown = (e) => {
    // e.preventDefault();
    console.log("Key pressed:", e.key);
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="product-page-container">
      {" "}
      {/* Renamed for specific styling */}
      <h1 className="page-title">Product Page</h1>
      <p className="page-description">
        This is the product page where you can view and manage products.
      </p>
      {/* Search Input Section */}
      <div className="search-bar-container">
        <span className="search-by-label">Search by:</span>
        <div className="search-input-group">
          {/* <label htmlFor="searchNamaBarang">Nama Barang:</label> */}
          <input
            type="text"
            id="searchNamaBarang"
            placeholder="Nama Barang"
            value={searchNamaBarang}
            onChange={(e) => setSearchNamaBarang(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
        <div className="search-input-group">
          {/* <label htmlFor="searchIDKategori">ID Kategori:</label> */}
          <input
            type="text"
            id="searchIDKategori"
            placeholder="ID Kategori"
            value={searchIDKategori}
            onChange={(e) => setSearchIDKategori(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
        <div className="search-input-group">
          {/* <label htmlFor="searchStok">Stok (XX-XX):</label> */}
          <input
            type="text"
            id="searchStok"
            placeholder="Stok (XX-XX)"
            value={searchStok}
            onChange={(e) => setSearchStok(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
        <button className="add-button" onClick={() => setShowAddModal(true)}>
          + Add Product
        </button>
      </div>
      <hr className="divider" />
      {/* Card Layout for Products */}
      <div className="product-cards-grid">
        {barang.length > 0 ? (
          barang.map((item) => (
            <Card key={item.id_barang} className="product-card">
              {/* Menggunakan className="card-img-top" untuk styling dari CSS */}
              <Card.Img
                variant="top"
                src={`/dummy_img.jpeg`}
                className="card-img-top"
              />
              <Card.Body className="card-body">
                {" "}
                {/* Tambahkan className="card-body" untuk styling flexbox di CSS */}
                {/* Kategori Produk (kecil, abu-abu) */}
                <p className="product-category">
                  {item.nama_kategori || item.id_kategori}
                </p>{" "}
                {/* Default jika nama_kategori kosong */}
                {/* Nama Produk (lebih besar, hitam) */}
                <h5 className="product-name">{item.nama_barang}</h5>
                {/* ID Barang sebagai teks kecil abu-abu di bawah nama produk */}
                <p className="product-id-small">ID: {item.id_barang}</p>
                {/* Informasi Harga Jual, Harga Beli, dan Stok */}
                {/* Menggunakan div product-details untuk flexbox menempatkan harga dan stok terpisah */}
                <div className="product-details">
                  <div className="product-price-info">
                    {/* Harga Beli */}
                    <div className="price-item">
                      <span className="price-label">Harga Beli:</span>
                      <span className="product-price-value">
                        Rp {parseFloat(item.harga_beli).toLocaleString("id-ID")}
                      </span>
                    </div>
                    {/* Harga Jual */}
                    <div className="price-item">
                      <span className="price-label">Harga Jual:</span>
                      <span className="product-price-value">
                        Rp {parseFloat(item.harga_jual).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                  {/* Stok */}
                  <span className="product-stock">
                    Stok: {item.stok} {item.satuan}
                  </span>{" "}
                  {/* Menambahkan satuan di sini */}
                </div>
                {/* Tombol Update dan Delete */}
                {/* Menggunakan kelas CSS yang sudah didefinisikan untuk tombol */}
                <div className="card-actions">
                  <Button
                    className="btn-action btn-update"
                    onClick={() => handleUpdateClick(item)}>
                    Update
                  </Button>
                  <Button
                    className="btn-action btn-delete"
                    onClick={() => handleDeleteBarang(item.id_barang)}>
                    Delete
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
      {/* Add Product Modal (using React Bootstrap components) */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Tambah Barang</h2>
            <div className="modal-body-scrollable">
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddProduk();
                }}>
                {" "}
                {/* Wrap with Form for onSubmit */}
                <Form.Group className="mb-3" controlId="formIdBarang">
                  <Form.Label>ID Barang:</Form.Label>
                  <Form.Control
                    type="text"
                    name="id_barang"
                    placeholder="BRG001"
                    value={addFormData.id_barang}
                    onChange={handleAddInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formNamaBarang">
                  <Form.Label>Nama Barang:</Form.Label>
                  <Form.Control
                    type="text"
                    name="nama_barang"
                    placeholder="Apple Watch"
                    value={addFormData.nama_barang}
                    onChange={handleAddInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formStok">
                  <Form.Label>Stok:</Form.Label>
                  <Form.Control
                    type="number"
                    name="stok"
                    placeholder="XX"
                    min="0"
                    value={addFormData.stok}
                    onChange={handleAddInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formHargaBeli">
                  <Form.Label>Harga Beli:</Form.Label>
                  <Form.Control
                    type="number"
                    name="harga_beli"
                    placeholder="10000.00"
                    step="0.01"
                    min="0"
                    value={addFormData.harga_beli}
                    onChange={handleAddInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formHargaJual">
                  <Form.Label>Harga Jual:</Form.Label>
                  <Form.Control
                    type="number"
                    name="harga_jual"
                    placeholder="10000.00"
                    step="0.01"
                    min="0"
                    value={addFormData.harga_jual}
                    onChange={handleAddInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formJenisBarang">
                  <Form.Label>Kategori:</Form.Label>
                  <Form.Select
                    name="jenis_barang"
                    value={addFormData.jenis_barang}
                    onChange={handleAddInputChange}
                    required>
                    {/* <option value="">-- Pilih Kategori --</option>
                    {JENIS_SERVICE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))} */}
                  </Form.Select>
                </Form.Group>
                {addFormData.id_kategori && (
                  <p className="text-muted small">
                    ID Kategori: {addFormData.id_kategori}
                  </p>
                )}
                <div className="modal-buttons">
                  <Button
                    variant="secondary"
                    onClick={() => setShowAddModal(false)}
                    className="cancel-button">
                    Batal
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    className="submit-button"
                    disabled={!isAddFormValid}>
                    Selesai
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      )}
      {/* Update Product Modal (using React Bootstrap components) */}
      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Update Barang</h2>
            <div className="modal-body-scrollable">
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateBarang();
                }}>
                {" "}
                {/* Wrap with Form for onSubmit */}
                <Form.Group className="mb-3" controlId="updateFormIdBarang">
                  <Form.Label>ID Barang:</Form.Label>
                  <Form.Control
                    type="text"
                    name="id_barang"
                    value={updateData.id_barang}
                    disabled
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="updateFormNamaBarang">
                  <Form.Label>Nama Barang:</Form.Label>
                  <Form.Control
                    type="text"
                    name="nama_barang"
                    value={updateData.nama_barang}
                    onChange={handleUpdateInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="updateFormStok">
                  <Form.Label>Stok:</Form.Label>
                  <Form.Control
                    type="number"
                    name="stok"
                    min="0"
                    value={updateData.stok}
                    onChange={handleUpdateInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="updateFormHargaBeli">
                  <Form.Label>Harga Beli:</Form.Label>
                  <Form.Control
                    type="number"
                    name="harga_beli"
                    step="0.01"
                    min="0"
                    value={updateData.harga_beli}
                    onChange={handleUpdateInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="updateFormHargaJual">
                  <Form.Label>Harga Jual:</Form.Label>
                  <Form.Control
                    type="number"
                    name="harga_jual"
                    step="0.01"
                    min="0"
                    value={updateData.harga_jual}
                    onChange={handleUpdateInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="updateFormIdKategori">
                  <Form.Label>ID Kategori:</Form.Label>
                  <Form.Control
                    type="text"
                    name="id_kategori"
                    value={updateData.id_kategori}
                    onChange={handleUpdateInputChange}
                    required
                  />
                </Form.Group>
                <div className="modal-buttons">
                  <Button
                    variant="secondary"
                    onClick={() => setShowUpdateModal(false)}
                    className="cancel-button">
                    Batal
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    className="submit-button"
                    disabled={!isUpdateFormValid}>
                    Selesai
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
