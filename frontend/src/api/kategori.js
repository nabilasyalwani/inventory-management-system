export async function fetchKategori() {
  try {
    const res = await fetch("http://localhost:3000/api/kategori");
    if (!res.ok) throw new Error("Failed to fetch kategori");
    const data = await res.json();
    console.log("Fetched kategori:", data);
    return data;
  } catch (error) {
    console.error("Error fetching kategori:", error);
  }
}

export async function addKategori(kategoriData) {
  try {
    const res = await fetch("http://localhost:3000/api/join/kategori", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(kategoriData),
    });
    if (!res.ok) throw new Error("Failed to add kategori");
    const data = await res.json();
    console.log("Added kategori:", data);
    return data;
  } catch (error) {
    console.error("Error adding kategori:", error);
  }
}

export async function updateKategori(kategoriData) {
  try {
    const res = await fetch("http://localhost:3000/api/kategori", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(kategoriData),
    });
    if (!res.ok) throw new Error("Failed to update kategori");
    const data = await res.json();
    console.log("Updated kategori:", data);
    return data;
  } catch (error) {
    console.error("Error updating kategori:", error);
  }
}

export async function searchKategori(query) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/join/find/kategori?${query}`
    );
    if (!res.ok) throw new Error("Failed to search kategori");
    const data = await res.json();
    console.log("Search results:", data);
    return data;
  } catch (error) {
    console.error("Search error:", error);
  }
}

export async function searchIDKategoriByName(namaKategori) {
  if (!namaKategori) {
    console.warn("No namaKategori provided for search");
    return null;
  }
  try {
    const res = await fetch(
      `http://localhost:3000/api/join/find/kategori?nama_kategori=${namaKategori}`
    );
    if (!res.ok) throw new Error("Failed to fetch category ID");
    const data = await res.json();
    console.log("Search ID kategori data:", data);
    const id_kategori =
      Array.isArray(data) && data.length > 0 ? data[0].id_kategori : "";
    console.log("Found id_kategori:", id_kategori);
    if (!id_kategori) {
      console.warn("No id_kategori found for nama_kategori:", namaKategori);
      return null;
    }
    return id_kategori;
  } catch (error) {
    console.error("Search ID kategori error:", error);
  }
}

export async function generateNewID() {
  try {
    const res = await fetch("http://localhost:3000/api/find/lastID/kategori");
    if (!res.ok) throw new Error("Failed to fetch last ID");
    const data = await res.json();
    console.log("Last ID data:", data);
    const lastID = data?.id_kategori || "KTG000";
    const newIDNumber = parseInt(lastID.replace("KTG", "")) + 1;
    const newID = `KTG${newIDNumber.toString().padStart(3, "0")}`;
    console.log("New ID generated:", newID);
    return newID;
  } catch (error) {
    console.error("Error fetching last ID:", error);
    return "KTG100";
  }
}
