const connection = require("../db/mysql");

const getAllItems = (req, res) => {
  const tableName = req.params.tableName;
  if (!tableName) {
    return res.status(400).json({ error: "Table name is required" });
  }
  connection.query(`SELECT * FROM ${tableName}`, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

const getItemById = (req, res) => {
  const id = req.params.id;
  const tableName = req.params.tableName;
  if (!tableName || !id) {
    return res.status(400).json({ error: "Request param is required" });
  }

  let idColumn = `id_${tableName}`;
  if (tableName === "detail_barang_keluar") {
    idColumn = "id_detail_keluar";
  } else if (tableName === "detail_barang_masuk") {
    idColumn = "id_detail_masuk";
  }

  connection.query(
    `SELECT * FROM ${tableName} WHERE ${idColumn} = "${id}"`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(results[0]);
    }
  );
};

const createItem = (req, res) => {
  const { id_detail_keluar, id_barang_keluar, id_barang, jumlah } = req.body;
  if (!id_detail_keluar || !id_barang_keluar || !id_barang || !jumlah) {
    return res.status(400).json({ error: "All fields are required" });
  }
  connection.query(
    "INSERT INTO detail_barang_keluar VALUES (?, ?, ?, ?)",
    [id_detail_keluar, id_barang_keluar, id_barang, jumlah],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Item created" });
    }
  );
};

const updateItem = (req, res) => {
  const id = req.params.id;
  const { stok } = req.body;
  if (!id || !stok) {
    return res.status(400).json({ error: "ID and stok are required" });
  }
  connection.query(
    "UPDATE barang SET stok = ? WHERE id_barang = ?",
    [stok, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json({ message: "Item updated" });
    }
  );
};

const deleteItem = (req, res) => {
  const id = req.params.id;
  const tableName = req.params.tableName;
  if (!tableName || !id) {
    return res.status(400).json({ error: "Request param is required" });
  }

  let idColumn = `id_${tableName}`;
  if (tableName === "detail_barang_keluar") {
    idColumn = "id_detail_keluar";
  } else if (tableName === "detail_barang_masuk") {
    idColumn = "id_detail_masuk";
  }

  connection.query(
    `DELETE FROM ${tableName} WHERE ${idColumn} = "${id}"`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json({
        message: `Item with id ${id} deleted successfully from ${tableName}`,
      });
    }
  );
};

module.exports = {
  createItem,
  updateItem,
  deleteItem,
  getAllItems,
  getItemById,
};
