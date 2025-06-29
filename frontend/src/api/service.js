export async function fetchService() {
  try {
    const res = await fetch("http://localhost:3000/api/service");
    if (!res.ok) throw new Error("Failed to fetch service");
    const data = await res.json();
    console.log("Fetched service:", data);
    return data;
  } catch (error) {
    console.error("Error fetching service:", error);
  }
}

export async function addService(serviceData) {
  try {
    const res = await fetch("http://localhost:3000/api/join/service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serviceData),
    });
    if (!res.ok) throw new Error("Failed to add service");
    const data = await res.json();
    console.log("Added service:", data);
    return data;
  } catch (error) {
    console.error("Error adding service:", error);
  }
}

export async function updateService(serviceData) {
  try {
    const res = await fetch("http://localhost:3000/api/service", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serviceData),
    });
    if (!res.ok) throw new Error("Failed to update service");
    const data = await res.json();
    console.log("Updated service:", data);
    return data;
  } catch (error) {
    console.error("Error updating service:", error);
  }
}

export async function searchService(query) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/join/find/service?${query}`
    );
    if (!res.ok) throw new Error("Failed to search service");
    const data = await res.json();
    console.log("Search results:", data);
    return data;
  } catch (error) {
    console.error("Search error:", error);
  }
}

export async function searchIDKategori(namaBarang) {
  console.log("Searching for id_kategori by nama_barang:", namaBarang);
  try {
    const res = await fetch(
      `http://localhost:3000/api/join/find/barang?nama_barang=${namaBarang}`
    );
    if (!res.ok) throw new Error("Failed to fetch category ID");
    const data = await res.json();
    const id_kategori =
      Array.isArray(data) && data.length > 0 ? data[0].id_kategori : "";
    console.log("Found id_kategori:", id_kategori);
    if (!id_kategori) {
      console.warn("No id_kategori found for nama_barang:", namaBarang);
      return null;
    }
    return id_kategori;
  } catch (error) {
    console.error("Search ID kategori error:", error);
  }
}

export async function searchJenisBarangByID(id_kategori) {
  console.log("Searching for jenis_barang by id_kategori:", id_kategori);
  try {
    const res = await fetch(
      `http://localhost:3000/api/join/find/kategori?id_kategori=${id_kategori}`
    );
    if (!res.ok) throw new Error("Failed to fetch category ID");
    const data = await res.json();
    const jenis_barang =
      Array.isArray(data) && data.length > 0 ? data[0].nama_kategori : "";
    console.log("Found jenis_barang:", jenis_barang);
    if (!jenis_barang) {
      console.warn("No jenis_barang found for id_kategori:", id_kategori);
      return null;
    }
    return jenis_barang;
  } catch (error) {
    console.error("Search jenis barang error:", error);
  }
}

export async function deleteService(id_service) {
  try {
    const res = await fetch(`http://localhost:3000/api/service/${id_service}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to delete service");
    const data = await res.json();
    console.log("Deleted service:", data);
    return data;
  } catch (error) {
    console.error("Error deleting service:", error);
  }
}
