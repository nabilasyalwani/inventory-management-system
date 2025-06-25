export async function fetchDistributor() {
  try {
    const res = await fetch("http://localhost:3000/api/distributor");
    if (!res.ok) throw new Error("Failed to fetch distributor");
    const data = await res.json();
    console.log("Fetched distributor:", data);
    return data;
  } catch (error) {
    console.error("Error fetching distributor:", error);
  }
}

export async function addDistributor(distributorData) {
  try {
    const res = await fetch("http://localhost:3000/api/join/distributor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(distributorData),
    });
    if (!res.ok) throw new Error("Failed to add distributor");
    const data = await res.json();
    console.log("Added distributor:", data);
    return data;
  } catch (error) {
    console.error("Error adding distributor:", error);
  }
}

export async function updateDistributor(distributorData) {
  try {
    const res = await fetch("http://localhost:3000/api/distributor", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(distributorData),
    });
    if (!res.ok) throw new Error("Failed to update distributor");
    const data = await res.json();
    console.log("Updated distributor:", data);
    return data;
  } catch (error) {
    console.error("Error updating distributor:", error);
  }
}

export async function searchDistributor(query) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/join/find/distributor?${query}`
    );
    if (!res.ok) throw new Error("Failed to search distributor");
    const data = await res.json();
    console.log("Search results:", data);
    return data;
  } catch (error) {
    console.error("Search error:", error);
  }
}

export async function generateNewID() {
  try {
    const res = await fetch(
      "http://localhost:3000/api/find/lastID/distributor"
    );
    if (!res.ok) throw new Error("Failed to fetch last ID");
    const data = await res.json();
    console.log("Last ID data:", data);
    const lastID = data?.id_distributor || "DTB000";
    const newIDNumber = parseInt(lastID.replace("DTB", "")) + 1;
    const newID = `DTB${newIDNumber.toString().padStart(3, "0")}`;
    console.log("New ID generated:", newID);
    return newID;
  } catch (error) {
    console.error("Error fetching last ID:", error);
    return "DTB100";
  }
}
