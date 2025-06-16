import React, { useState, useEffect } from "react";
import "./ProductPage.css";

const TABLE_HEADER = [
  "ID  pelanggan",
  "Nama  pelanggan",
  "Alamat",
  "No Telpon",
  // "Actions",
];

export default function PelangganPage() {
  const [pelanggan, setPelanggan] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showModal, setShowModal] = useState(false); // ✅ Tambah ini
  const [searchIDPelanggan, setSearchIDPelanggan] = useState("");
  const [searchNamaPelanggan, setSearchNamaPelanggan] = useState("");
  const [updateData, setUpdateData] = useState({
    id_pelanggan: "",
    nama_pelanggan: "",
    alamat: "",
    no_telp: "",
  });

  const [formData, setFormData] = useState({
    // ✅ Tambah ini
    id_pelanggan: "",
    nama_pelanggan: "",
    alamat: "",
    no_telp: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/pelanggan");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setPelanggan(data);
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
    if (searchIDPelanggan) {
      searchString += `id_pelanggan=${searchIDPelanggan}&`;
    }
    if (searchNamaPelanggan) {
      searchString += `nama_pelanggan=${searchNamaPelanggan}&`;
    }

    if (searchString === "") {
      console.log("No search criteria provided, fetching all products.");
      fetchProducts();
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/api/join/find/pelanggan?" + searchString
      );
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await res.json();
      setPelanggan(data);
      console.log("Fetched products:", data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // const handleDelete = (id_pelanggan) => {
  //   console.log("Deleting:", id_pelanggan); // ✅ Ganti dari id_barang ke id_supplier
  //   // TODO: Tambahkan logika DELETE ke backend
  // };

  const isUpdateFormValid =
    updateData.id_pelanggan &&
    updateData.nama_pelanggan &&
    updateData.alamat &&
    updateData.no_telp;

  return (
    <div className="product-page">
      <h1>Customer Page</h1>
      <p>
        This is the customer page where you can view and manage customer's data.
      </p>

      <div className="search-bar">
        <p>Search by:</p>
        <input
          type="text"
          placeholder="ID pelanggan"
          value={searchIDPelanggan}
          onChange={(e) => setSearchIDPelanggan(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nama pelanggan"
          value={searchNamaPelanggan}
          onChange={(e) => setSearchNamaPelanggan(e.target.value)}
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
          {pelanggan.map((item) => (
            <tr key={item.id_pelanggan}>
              <td>{item.id_pelanggan}</td>
              <td>{item.nama_pelanggan}</td>
              <td>{item.alamat}</td>
              <td>{item.no_telp}</td>
              {/* <td>
                <button onClick={() => handleUpdateClick(item)}>Update</button>
                <button
                  onClick={() => handleDelete(item.id_pelanggan)}
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
            <h2>Tambah pelanggan</h2>
            <div className="form-group">
              <label>ID pelanggan:</label>
              <input
                type="text"
                placeholder="PLG001"
                value={formData.id_pelanggan}
                onChange={(e) =>
                  setFormData({ ...formData, id_pelanggan: e.target.value })
                }
              />
              <label>Nama:</label>
              <input
                type="text"
                placeholder="Nama  pelanggan"
                value={formData.nama_pelanggan}
                onChange={(e) =>
                  setFormData({ ...formData, nama_pelanggan: e.target.value })
                }
              />
              <label>Alamat:</label>
              <input
                type="text"
                value={formData.alamat}
                onChange={(e) =>
                  setFormData({ ...formData, alamat: e.target.value })
                }
              />
              <label>No Telepon:</label>
              <input
                type="text"
                value={formData.no_telp}
                onChange={(e) =>
                  setFormData({ ...formData, no_telp: e.target.value })
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
            <h2>Update pelanggan</h2>
            <div className="form-group">
              <label>ID pelanggan:</label>
              <input type="text" value={updateData.id_pelanggan} disabled />
              <label>Nama pelanggan:</label>
              <input
                type="text"
                value={updateData.nama_pelanggan}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    nama_pelanggan: e.target.value,
                  })
                }
              />
              <label>Alamat:</label>
              <input
                type="text"
                value={updateData.alamat}
                onChange={(e) =>
                  setUpdateData({ ...updateData, alamat: e.target.value })
                }
              />
              <label>No Telpon:</label>
              <input
                type="text"
                value={updateData.no_telp}
                onChange={(e) =>
                  setUpdateData({ ...updateData, no_telp: e.target.value })
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
