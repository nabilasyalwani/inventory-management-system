import React, { useState, useEffect } from "react";
import "./Service.css";

const TABLE_HEADER = [
  "ID Detail Service",
  "ID Service",
  "ID Pelanggan",
  "ID Petugas",
  "Jenis Service",
  "Nama Barang",
  "Keterangan",
  "Tanggal Mulai",
  "Tanggal Selesai",
  "Durasi Service",
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

export default function Service() {
  const [service, setService] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [searchIDService, setSearchIDService] = useState("");
  const [searchIDDetailService, setSearchIDDetailService] = useState("");
  const [searchNamaBarang, setSearchNamaBarang] = useState("");
  const [searchTanggal, setSearchTanggal] = useState("");
  const [updateData, setUpdateData] = useState({});
  const [formData, setFormData] = useState({
    id_detail_service: "",
    id_pelanggan: "",
    id_petugas: "",
    id_service: "",
    jenis_service: "",
    nama_barang: "",
    keterangan: "",
    tanggal_masuk: "",
    status: "proses",
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/join/service_detail_service"
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      console.log("Fetched products:", data.data);
      setService(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    console.log("Search criteria changed, fetching products...", searchTanggal);
  }, [searchTanggal]);

  useEffect(() => {
    console.log("Update Data:", updateData);
  }, [updateData]);

  const handleSearch = async () => {
    let searchString = "";
    if (searchIDService) {
      searchString += `ds.id_service=${searchIDService}&`;
    }
    if (searchIDDetailService) {
      searchString += `ds.id_detail_service=${searchIDDetailService}&`;
    }
    if (searchNamaBarang) {
      searchString += `ds.nama_barang=${searchNamaBarang}&`;
    }
    if (searchTanggal) {
      searchString += `ds.tanggal_selesai=${searchTanggal}&s.tanggal_masuk=${searchTanggal}&`;
    }

    if (searchString === "") {
      console.log("No search criteria provided, fetching all products.");
      fetchProducts();
      return;
    }

    const stringgg =
      "http://localhost:3000/api/join/find/service_detail_service?" +
      searchString;
    console.log("Search URL:", stringgg);
    try {
      const res = await fetch(stringgg);
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await res.json();
      setService(data);
      console.log("Fetched products:", data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddService = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/join/service_detail_service",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }
      const newEntry = await response.json();
      console.log("New entry added:", newEntry);
      fetchProducts(); // Refresh
      // setBarang([...barang, newEntry]);
      setShowModal(false);
      setFormData({
        id_detail_service: "",
        id_pelanggan: "",
        id_petugas: "",
        id_service: "",
        jenis_service: "",
        nama_barang: "",
        keterangan: "",
        tanggal_masuk: "",
        status: "proses",
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleUpdateService = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/join/service_detail_service",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }
      const updatedItem = await response.json();
      console.log("Item Updated:", updatedItem);
      fetchProducts(); // Refresh
      setService((prev) =>
        prev.map((item) =>
          item.id_detail_service === updatedItem.id_detail_service
            ? updatedItem
            : item
        )
      );
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/join/service_detail_service",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_detail_service: id }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }
      const deleteItem = await response.json();
      console.log("Item Deleted:", deleteItem);
      fetchProducts(); // Refresh
      // setBarang([...barang, newEntry]);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  function formatDateTime(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("id-ID");
  }

  return (
    <div className="product-page">
      <h1>Service Toko "Jaya Abadi"</h1>
      <p>
        This is the service transaction page where you can view and manage
        service transactions.
      </p>

      <div className="search-bar">
        <p>Search by:</p>
        <input
          type="text"
          placeholder="ID Service"
          value={searchIDService}
          onChange={(e) => setSearchIDService(e.target.value)}
        />
        <input
          type="text"
          placeholder="ID Detail Service"
          value={searchIDDetailService}
          onChange={(e) => setSearchIDDetailService(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nama Barang"
          value={searchNamaBarang}
          onChange={(e) => setSearchNamaBarang(e.target.value)}
        />
        <input
          type="date"
          placeholder="Tanggal"
          value={searchTanggal}
          onChange={(e) => setSearchTanggal(e.target.value)}
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
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {service.map((item) => (
            <tr key={item.id_detail_service}>
              <td>{item.id_detail_service}</td>
              <td>{item.id_service}</td>
              <td>{item.id_pelanggan}</td>
              <td>{item.id_petugas}</td>
              <td>{item.jenis_service}</td>
              <td>{item.nama_barang}</td>
              <td>{item.keterangan}</td>
              <td>{formatDateTime(item.tanggal_masuk)}</td>
              <td>{formatDateTime(item.tanggal_selesai)}</td>
              <td>{item.durasi_service}</td>
              <td>{item.biaya_service}</td>
              <td>{item.status}</td>
              <td>
                <button
                  onClick={() => {
                    setShowUpdateModal(true);
                    setUpdateData(item);
                    // console.log("Selected Item for Update:", item);
                  }}>
                  Update
                </button>
                <button
                  onClick={() => handleDelete(item.id_detail_service)}
                  style={{ marginLeft: "6px", backgroundColor: "#e53e3e" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Tambah Barang Service</h2>
            <div className="form-group">
              <label>ID Detail Service:</label>
              <input
                type="text"
                placeholder="DSV001"
                value={formData.id_detail_service || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    id_detail_service: e.target.value,
                  })
                }
              />
              <label>ID Service:</label>
              <input
                type="text"
                placeholder="SVC001"
                value={formData.id_service || ""}
                onChange={(e) =>
                  setFormData({ ...formData, id_service: e.target.value })
                }
              />
              <label>ID Pelanggan:</label>
              <input
                type="text"
                placeholder="PLG001"
                value={formData.id_pelanggan || ""}
                onChange={(e) =>
                  setFormData({ ...formData, id_pelanggan: e.target.value })
                }
              />
              <label>ID Petugas:</label>
              <input
                type="text"
                placeholder="PTG001"
                value={formData.id_petugas || ""}
                onChange={(e) =>
                  setFormData({ ...formData, id_petugas: e.target.value })
                }
              />
              <label>Jenis Service:</label>
              <select
                value={formData.jenis_service || ""}
                onChange={(e) =>
                  setFormData({ ...formData, jenis_service: e.target.value })
                }>
                <option value="">Pilih Jenis Service</option>
                {JENIS_SERVICE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <label>Nama Barang:</label>
              <input
                type="text"
                value={formData.nama_barang || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nama_barang: e.target.value })
                }
              />
              <label>Keterangan:</label>
              <input
                type="text"
                value={formData.keterangan || ""}
                onChange={(e) =>
                  setFormData({ ...formData, keterangan: e.target.value })
                }
              />
              <label>Tanggal Mulai:</label>
              <input
                type="date"
                value={formData.tanggal_masuk || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tanggal_masuk: e.target.value })
                }
              />
            </div>
            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)}>Batal</button>
              <button
                onClick={handleAddService}
                // disabled={!isFormValid}
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Update Barang Service</h2>
            <div className="form-group">
              <label>ID Detail Service:</label>
              <input
                type="text"
                placeholder="DSV001"
                value={updateData.id_detail_service || ""}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    id_detail_service: e.target.value,
                  })
                }
                disabled
              />
              <label>ID Service:</label>
              <input
                type="text"
                placeholder="SVC001"
                value={updateData.id_service || ""}
                onChange={(e) =>
                  setUpdateData({ ...updateData, id_service: e.target.value })
                }
              />
              <label>Jenis Service:</label>
              <select
                value={updateData.jenis_service || ""}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    jenis_service: e.target.value,
                  })
                }>
                <option value="">Pilih Jenis Service</option>
                {JENIS_SERVICE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <label>Nama Barang:</label>
              <input
                type="text"
                value={updateData.nama_barang || ""}
                onChange={(e) =>
                  setUpdateData({ ...updateData, nama_barang: e.target.value })
                }
              />
              <label>Keterangan:</label>
              <input
                type="text"
                value={updateData.keterangan || ""}
                onChange={(e) =>
                  setUpdateData({ ...updateData, keterangan: e.target.value })
                }
              />
              <label>Tanggal Mulai:</label>
              <input
                type="date"
                value={updateData.tanggal_masuk || ""}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    tanggal_masuk: e.target.value,
                  })
                }
              />
              <label>Tanggal Selesai:</label>
              <input
                type="date"
                value={updateData.tanggal_selesai || ""}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    tanggal_selesai: e.target.value,
                  })
                }
              />
            </div>
            <div className="modal-buttons">
              <button onClick={() => setShowUpdateModal(false)}>Batal</button>
              <button
                onClick={handleUpdateService}
                // disabled={!isUpdateFormValid}
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
