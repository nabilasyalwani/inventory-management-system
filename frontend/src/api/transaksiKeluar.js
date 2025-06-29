export async function fetchTransaksiKeluar() {
  try {
    const res = await fetch("http://localhost:3000/api/transaksi_keluar");
    if (!res.ok) throw new Error("Failed to fetch transaksi_keluar");
    const data = await res.json();
    console.log("Fetched transaksi_keluar:", data);
    return data;
  } catch (error) {
    console.error("Error fetching transaksi_keluar:", error);
  }
}

export async function addTransaksiKeluar(transaksi_keluar) {
  try {
    const res = await fetch("http://localhost:3000/api/join/transaksi_keluar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaksi_keluar),
    });
    if (!res.ok) throw new Error("Failed to add transaksi_keluar");
    const data = await res.json();
    console.log("Added transaksi_keluar:", data);
    return data;
  } catch (error) {
    console.error("Error adding transaksi_keluar:", error);
  }
}

export async function updateTransaksiKeluar(transaksi_keluarData) {
  try {
    const res = await fetch("http://localhost:3000/api/transaksi_keluar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaksi_keluarData),
    });
    if (!res.ok) throw new Error("Failed to update transaksi_keluar");
    const data = await res.json();
    console.log("Updated transaksi_keluar:", data);
    return data;
  } catch (error) {
    console.error("Error updating transaksi_keluar:", error);
  }
}

export async function searchTransaksiKeluar(query) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/join/find/transaksi_keluar?${query}`
    );
    if (!res.ok) throw new Error("Failed to search transaksi_keluar");
    const data = await res.json();
    console.log("Search results:", data);
    return data;
  } catch (error) {
    console.error("Search error:", error);
  }
}

export async function searchIDBarang(namaBarang) {
  console.log("Searching for id_barang by nama_barang:", namaBarang);
  try {
    const res = await fetch(
      `http://localhost:3000/api/join/find/barang?nama_barang=${namaBarang}`
    );
    if (!res.ok) throw new Error("Failed to fetch category ID");
    const data = await res.json();
    const id_barang =
      Array.isArray(data) && data.length > 0 ? data[0].id_barang : "";
    console.log("Found id_barang:", id_barang);
    if (!id_barang) {
      console.warn("No id_barang found for nama_barang:", namaBarang);
      return null;
    }
    return id_barang;
  } catch (error) {
    console.error("Search ID kategori error:", error);
  }
}

export async function generateNewID() {
  try {
    const res = await fetch(
      "http://localhost:3000/api/find/lastID/transaksi_keluar"
    );
    if (!res.ok) throw new Error("Failed to fetch last ID");
    const data = await res.json();
    console.log("Last ID data:", data);
    const lastID = data?.id_transaksi_keluar || "DTB000";
    const newIDNumber = parseInt(lastID.replace("DTB", "")) + 1;
    const newID = `DTB${newIDNumber.toString().padStart(3, "0")}`;
    console.log("New ID generated:", newID);
    return newID;
  } catch (error) {
    console.error("Error fetching last ID:", error);
    return "DTB100";
  }
}

export async function deleteTransaksiKeluar(id_transaksi_keluar) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/transaksi_keluar/${id_transaksi_keluar}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!res.ok) throw new Error("Failed to delete transaksi_keluar");
    const data = await res.json();
    console.log("Deleted transaksi_keluar:", data);
    return data;
  } catch (error) {
    console.error("Error deleting transaksi_keluar:", error);
  }
}
