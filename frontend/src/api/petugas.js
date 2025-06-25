export async function fetchPetugas() {
  try {
    const res = await fetch("http://localhost:3000/api/petugas");
    if (!res.ok) throw new Error("Failed to fetch petugas");
    const data = await res.json();
    console.log("Fetched petugas:", data);
    return data;
  } catch (error) {
    console.error("Error fetching petugas:", error);
  }
}

export async function addPetugas(petugasData) {
  try {
    const res = await fetch("http://localhost:3000/api/join/petugas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(petugasData),
    });
    if (!res.ok) throw new Error("Failed to add petugas");
    const data = await res.json();
    console.log("Added petugas:", data);
    return data;
  } catch (error) {
    console.error("Error adding petugas:", error);
  }
}

export async function updatePetugas(petugasData) {
  try {
    const res = await fetch("http://localhost:3000/api/petugas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(petugasData),
    });
    if (!res.ok) throw new Error("Failed to update petugas");
    const data = await res.json();
    console.log("Updated petugas:", data);
    return data;
  } catch (error) {
    console.error("Error updating petugas:", error);
  }
}

export async function searchPetugas(query) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/join/find/petugas?${query}`
    );
    if (!res.ok) throw new Error("Failed to search petugas");
    const data = await res.json();
    console.log("Search results:", data);
    return data;
  } catch (error) {
    console.error("Search error:", error);
  }
}

export async function generateNewID() {
  try {
    const res = await fetch("http://localhost:3000/api/find/lastID/petugas");
    if (!res.ok) throw new Error("Failed to fetch last ID");
    const data = await res.json();
    console.log("Last ID data:", data);
    const lastID = data?.id_petugas || "PTG000";
    const newIDNumber = parseInt(lastID.replace("PTG", "")) + 1;
    const newID = `PTG${newIDNumber.toString().padStart(3, "0")}`;
    console.log("New ID generated:", newID);
    return newID;
  } catch (error) {
    console.error("Error fetching last ID:", error);
    return "PTG100";
  }
}
