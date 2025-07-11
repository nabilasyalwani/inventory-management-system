import React, { useState, useEffect } from "react";
import "./ProductPage.css";

const TABLE_HEADER = [
  "ID Barang",
  "Nama Barang",
  "Stok",
  "Satuan",
  "Harga Beli",
  "Harga Jual",
  "Kategori",
  "Actions",
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

export default function ProductPage() {
  const [barang, setBarang] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [searchStok, setSearchStok] = useState("");
  const [searchIDBarang, setSearchIDBarang] = useState("");
  const [searchNamaBarang, setSearchNamaBarang] = useState("");
  const [searchIDKategori, setSearchIDKategori] = useState("");
  const [updateData, setUpdateData] = useState({
    id_barang: "",
    nama_barang: "",
    stok: "",
    satuan: "",
    harga_beli: "",
    harga_jual: "",
  });

  const [formData, setFormData] = useState({
    id_barang: "",
    nama_barang: "",
    stok: "",
    satuan: "",
    harga_beli: "",
    harga_jual: "",
    jenis_barang: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/barang");
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      setBarang(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleUpdateClick = (item) => {
    setUpdateData(item);
    setShowUpdateModal(true);
  };

  const handleSearch = async () => {
    let searchString = "";
    if (searchIDBarang) {
      searchString += `id_barang=${searchIDBarang}&`;
    }
    if (searchIDKategori) {
      searchString += `id_kategori=${searchIDKategori}&`;
    }
    if (searchNamaBarang) {
      searchString += `nama_barang=${searchNamaBarang}&`;
    }
    if (searchStok) {
      searchString += `stok=${searchStok}&`;
    }

    if (searchString === "") {
      console.log("No search criteria provided, fetching all products.");
      fetchProducts();
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/api/join/find/barang?" + searchString
      );
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await res.json();
      setBarang(data);
      console.log("Fetched products:", data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "jenis_barang") {
      console.log("Handling search for jenis_barang:", value);
      handleSearchIDBarang(value);
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearchIDBarang = async (kategori) => {
    console.log("Searching for kategori:", kategori);
    try {
      const res = await fetch(
        `http://localhost:3000/api/join/find/kategori?jenis_barang=${kategori}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await res.json();
      const id_kategori =
        Array.isArray(data) && data.length > 0 ? data[0].id_kategori : "";
      setFormData((prevData) => ({
        ...prevData,
        id_kategori: id_kategori,
      }));
      console.log("Fetched products:", data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddProduk = async () => {
    console.log("Adding new product:", formData);
    try {
      const response = await fetch("http://localhost:3000/api/join/barang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }
      const newEntry = await response.json();
      console.log("New entry added:", newEntry);
      fetchProducts(); // Refresh
      setShowModal(false);
      setFormData({
        id_barang: "",
        nama_barang: "",
        stok: "",
        satuan: "",
        harga_beli: "",
        harga_jual: "",
        id_kategori: "",
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleUpdateBarang = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/join/barang", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
      const updatedItem = await response.json();
      console.log("Product updated:", updatedItem);
      fetchProducts(); // Refresh

      setBarang((prev) =>
        prev.map((item) =>
          item.id_barang === updatedItem.id_barang ? updatedItem : item
        )
      );
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const isUpdateFormValid =
    updateData.id_barang &&
    updateData.nama_barang &&
    updateData.stok &&
    updateData.satuan &&
    updateData.harga_beli &&
    updateData.harga_jual &&
    updateData.id_kategori;

  return (
    <div className="product-page">
      <h1>Product Page</h1>
      <p>This is the product page where you can view and manage products.</p>

      <div className="search-bar">
        <p>Search by:</p>
        <input
          type="text"
          placeholder="ID Barang"
          value={searchIDBarang}
          onChange={(e) => setSearchIDBarang(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nama Barang"
          value={searchNamaBarang}
          onChange={(e) => setSearchNamaBarang(e.target.value)}
        />
        <input
          type="text"
          placeholder="Kategori Barang"
          value={searchIDKategori}
          onChange={(e) => setSearchIDKategori(e.target.value)}
        />
        <input
          type="text"
          placeholder="XX-XX"
          value={searchStok}
          onChange={(e) => setSearchStok(e.target.value)}
        />
        <button className="search-button" onClick={() => handleSearch()}>
          Search
        </button>
        <button className="add-button" onClick={() => setShowModal(true)}>
          + Add
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
          {barang.map((item) => (
            <tr key={item.id_barang}>
              <td>{item.id_barang}</td>
              <td>{item.nama_barang}</td>
              <td>{item.stok}</td>
              <td>{item.satuan}</td>
              <td>{item.harga_beli}</td>
              <td>{item.harga_jual}</td>
              <td>{item.id_kategori}</td>
              <td>
                <button onClick={() => handleUpdateClick(item)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Tambah */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Tambah Barang</h2>
            <div className="form-group">
              <label>ID Barang:</label>
              <input
                type="text"
                name="id_barang"
                placeholder="BRG0XX"
                value={formData.id_barang}
                onChange={handleInputChange}
              />
              <label>Nama Barang:</label>
              <input
                type="text"
                name="nama_barang"
                value={formData.nama_barang}
                onChange={handleInputChange}
                placeholder="Apple Watch"
              />
              <label>Stok:</label>
              <input
                type="text"
                name="stok"
                value={formData.stok}
                onChange={handleInputChange}
                placeholder="XX"
              />
              <label>Satuan:</label>
              <input
                type="text"
                name="satuan"
                placeholder="pcs"
                value={formData.satuan}
                onChange={handleInputChange}
              />
              <label>Harga Beli:</label>
              <input
                type="text"
                name="harga_beli"
                placeholder="10000.00"
                value={formData.harga_beli}
                onChange={handleInputChange}
              />
              <label>Harga Jual:</label>
              <input
                type="text"
                name="harga_jual"
                placeholder="10000.00"
                value={formData.harga_jual}
                onChange={handleInputChange}
              />
              <label>Kategori:</label>
              <select
                name="jenis_barang"
                value={formData.jenis_barang}
                onChange={handleInputChange}>
                <option value="">-- Pilih Kategori --</option>
                {JENIS_SERVICE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)}>Batal</button>
              <button onClick={handleAddProduk}>Selesai</button>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Update Barang</h2>
            <div className="form-group">
              <label>ID Barang:</label>
              <input type="text" value={updateData.id_barang} disabled />

              <label>Nama Barang:</label>
              <input
                type="text"
                value={updateData.nama_barang}
                onChange={(e) =>
                  setUpdateData({ ...updateData, nama_barang: e.target.value })
                }
              />

              <label>Stok:</label>
              <input
                type="text"
                value={updateData.stok}
                onChange={(e) =>
                  setUpdateData({ ...updateData, stok: e.target.value })
                }
              />

              <label>Satuan:</label>
              <input
                type="text"
                value={updateData.satuan}
                onChange={(e) =>
                  setUpdateData({ ...updateData, satuan: e.target.value })
                }
              />

              <label>Harga Beli:</label>
              <input
                type="text"
                value={updateData.harga_beli}
                onChange={(e) =>
                  setUpdateData({ ...updateData, harga_beli: e.target.value })
                }
              />

              <label>Harga Jual:</label>
              <input
                type="text"
                value={updateData.harga_jual}
                onChange={(e) =>
                  setUpdateData({ ...updateData, harga_jual: e.target.value })
                }
              />

              <div className="modal-buttons">
                <button onClick={() => setShowUpdateModal(false)}>Batal</button>
                <button
                  onClick={handleUpdateBarang}
                  disabled={!isUpdateFormValid}>
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
