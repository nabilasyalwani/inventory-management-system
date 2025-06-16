import React, { useState, useEffect } from "react";
import "./ProductPage.css";

const TABLE_HEADER = [
  "ID Supplier",
  "Nama Supplier",
  "Alamat",
  "No Telpon",
  // "Actions",
];

export default function SupplierPage() {
  const [supplier, setSupplier] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showModal, setShowModal] = useState(false); // ✅ Tambah ini
  const [searchIDSupplier, setSearchIDSupplier] = useState("");
  const [searchNamaSupplier, setSearchNamaSupplier] = useState("");
  const [updateData, setUpdateData] = useState({
    id_supplier: "",
    nama_supplier: "",
    alamat_supplier: "",
    no_telp_supplier: "",
  });

  const [formData, setFormData] = useState({
    // ✅ Tambah ini
    id_supplier: "",
    nama_supplier: "",
    alamat_supplier: "",
    no_telp_supplier: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/supplier");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setSupplier(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // const handleUpdateClick = (item) => {
  //   setUpdateData(item);
  //   setShowUpdateModal(true);
  // };

  const handleUpdateService = () => {
    console.log("Update submitted:", updateData);
    setShowUpdateModal(false);
    // TODO: Tambahkan logika PUT ke backend
  };

  const handleAddService = () => {
    console.log("Data baru:", formData);
    setShowModal(false);
    // TODO: Tambahkan logika POST ke backend
  };

  const handleSearch = async () => {
    let searchString = "";
    if (searchIDSupplier) {
      searchString += `id_supplier=${searchIDSupplier}&`;
    }
    if (searchNamaSupplier) {
      searchString += `nama_supplier=${searchNamaSupplier}&`;
    }

    if (searchString === "") {
      console.log("No search criteria provided, fetching all products.");
      fetchProducts();
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/api/join/find/supplier?" + searchString
      );
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await res.json();
      setSupplier(data);
      console.log("Fetched products:", data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // const handleDelete = (id_supplier) => {
  //   console.log("Deleting:", id_supplier); // ✅ Ganti dari id_barang ke id_supplier
  //   // TODO: Tambahkan logika DELETE ke backend
  // };

  const isUpdateFormValid =
    updateData.id_supplier &&
    updateData.nama_supplier &&
    updateData.alamat_supplier &&
    updateData.no_telp_supplier;

  return (
    <div className="product-page">
      <h1>Supplier Page</h1>
      <p>
        This is the supplier page where you can view and manage supplier's data.
      </p>

      <div className="search-bar">
        <p>Search by:</p>
        <input
          type="text"
          placeholder="ID Supplier"
          value={searchIDSupplier}
          onChange={(e) => setSearchIDSupplier(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nama Supplier"
          value={searchNamaSupplier}
          onChange={(e) => setSearchNamaSupplier(e.target.value)}
        />
        <button className="search-button" onClick={() => handleSearch()}>
          Search
        </button>
        {/* <button className="add-button" onClick={() => setShowModal(true)}>
          + Add
        </button> */}
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
          {supplier.map((item) => (
            <tr key={item.id_supplier}>
              <td>{item.id_supplier}</td>
              <td>{item.nama_supplier}</td>
              <td>{item.alamat_supplier}</td>
              <td>{item.no_telp_supplier}</td>
              {/* <td>
                <button onClick={() => handleUpdateClick(item)}>Update</button>
                <button
                  onClick={() => handleDelete(item.id_supplier)}
                  style={{
                    marginLeft: "6px",
                    backgroundColor: "#e53e3e",
                    color: "white",
                  }}>
                  Delete
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Tambah */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Tambah Supplier</h2>
            <div className="form-group">
              <label>ID Supplier:</label>
              <input
                type="text"
                placeholder="SUP001"
                value={formData.id_supplier}
                onChange={(e) =>
                  setFormData({ ...formData, id_supplier: e.target.value })
                }
              />
              <label>Nama:</label>
              <input
                type="text"
                placeholder="Nama Supplier"
                value={formData.nama_supplier}
                onChange={(e) =>
                  setFormData({ ...formData, nama_supplier: e.target.value })
                }
              />
              <label>Alamat:</label>
              <input
                type="text"
                value={formData.alamat_supplier}
                onChange={(e) =>
                  setFormData({ ...formData, alamat_supplier: e.target.value })
                }
              />
              <label>No Telepon:</label>
              <input
                type="text"
                value={formData.no_telp_supplier}
                onChange={(e) =>
                  setFormData({ ...formData, no_telp_supplier: e.target.value })
                }
              />
            </div>
            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)}>Batal</button>
              <button onClick={handleAddService}>Selesai</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Update */}
      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Update Supplier</h2>
            <div className="form-group">
              <label>ID Supplier:</label>
              <input type="text" value={updateData.id_supplier} disabled />
              <label>Nama Supplier:</label>
              <input
                type="text"
                value={updateData.nama_supplier}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    nama_supplier: e.target.value,
                  })
                }
              />
              <label>Alamat:</label>
              <input
                type="text"
                value={updateData.alamat_supplier}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    alamat_supplier: e.target.value,
                  })
                }
              />
              <label>No Telpon:</label>
              <input
                type="text"
                value={updateData.no_telp_supplier}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    no_telp_supplier: e.target.value,
                  })
                }
              />
              <div className="modal-buttons">
                <button onClick={() => setShowUpdateModal(false)}>Batal</button>
                <button
                  onClick={handleUpdateService}
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
