export async function fetchTransaksiMasuk() {
  try {
    const res = await fetch("http://localhost:3000/api/transaksi_masuk");
    if (!res.ok) throw new Error("Failed to fetch transaksi_masuk");
    const data = await res.json();
    console.log("Fetched transaksi_masuk:", data);
    return data;
  } catch (error) {
    console.error("Error fetching transaksi_masuk:", error);
  }
}



export async function addTransaksiMasuk(transaksi_masukData) {
  try {
    const res = await fetch("http://localhost:3000/api/join/transaksi_masuk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaksi_masukData),
    });
    if (!res.ok) throw new Error("Failed to add transaksi_masuk");
    const data = await res.json();
    console.log("Added transaksi_masuk:", data);
    return data;
  } catch (error) {
    console.error("Error adding transaksi_masuk:", error);
  }
}

export async function updateTransaksiMasuk(transaksi_masukData) {
  try {
    const res = await fetch("http://localhost:3000/api/transaksi_masuk", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaksi_masukData),
    });
    if (!res.ok) throw new Error("Failed to update transaksi_masuk");
    const data = await res.json();
    console.log("Updated transaksi_masuk:", data);
    return data;
  } catch (error) {
    console.error("Error updating transaksi_masuk:", error);
  }
}

export async function searchTransaksiMasuk(query) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/join/find/transaksi_masuk?${query}`
    );
    if (!res.ok) throw new Error("Failed to search transaksi_masuk");
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
      "http://localhost:3000/api/find/lastID/transaksi_masuk"
    );
    if (!res.ok) throw new Error("Failed to fetch last ID");
    const data = await res.json();
    console.log("Last ID data:", data);
    const lastID = data?.id_transaksi_masuk || "DTB000";
    const newIDNumber = parseInt(lastID.replace("DTB", "")) + 1;
    const newID = `DTB${newIDNumber.toString().padStart(3, "0")}`;
    console.log("New ID generated:", newID);
    return newID;
  } catch (error) {
    console.error("Error fetching last ID:", error);
    return "DTB100";
  }
}

export async function deleteTransaksiMasuk(id_transaksi_masuk) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/transaksi_masuk/${id_transaksi_masuk}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!res.ok) throw new Error("Failed to delete transaksi_masuk");
    const data = await res.json();
    console.log("Deleted transaksi_masuk:", data);
    return data;
  } catch (error) {
    console.error("Error deleting transaksi_masuk:", error);
  }
}
