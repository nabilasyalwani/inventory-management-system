export async function fetchSuppliers() {
  try {
    const res = await fetch("http://localhost:3000/api/supplier");
    if (!res.ok) throw new Error("Failed to fetch suppliers");
    const data = await res.json();
    console.log("Fetched suppliers:", data);
    return data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
  }
}

export async function addSupplier(supplierData) {
  try {
    const res = await fetch("http://localhost:3000/api/join/supplier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(supplierData),
    });
    if (!res.ok) throw new Error("Failed to add supplier");
    const data = await res.json();
    console.log("Added supplier:", data);
    return data;
  } catch (error) {
    console.error("Error adding supplier:", error);
  }
}

export async function updateSupplier(supplierData) {
  try {
    const res = await fetch("http://localhost:3000/api/supplier", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(supplierData),
    });
    if (!res.ok) throw new Error("Failed to update supplier");
    const data = await res.json();
    console.log("Updated supplier:", data);
    return data;
  } catch (error) {
    console.error("Error updating supplier:", error);
  }
}

export async function searchSupplier(query) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/join/find/supplier?${query}`
    );
    if (!res.ok) throw new Error("Failed to search suppliers");
    const data = await res.json();
    console.log("Search results:", data);
    return data;
  } catch (error) {
    console.error("Search error:", error);
  }
}

export async function generateNewID() {
  try {
    const res = await fetch("http://localhost:3000/api/find/lastID/supplier");
    if (!res.ok) throw new Error("Failed to fetch last ID");
    const data = await res.json();
    console.log("Last ID data:", data);
    const lastID = data?.id_supplier || "SUP000";
    const newIDNumber = parseInt(lastID.replace("SUP", "")) + 1;
    const newID = `SUP${newIDNumber.toString().padStart(3, "0")}`;
    console.log("New ID generated:", newID);
    return newID;
  } catch (error) {
    console.error("Error fetching last ID:", error);
    return "SUP100";
  }
}
