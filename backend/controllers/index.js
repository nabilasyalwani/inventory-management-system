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

const createItemInJoinTable = (req, res) => {
  const tableName = req.params.tableName;
  const data = req.body;
  let values = [];
  if (!tableName || Object.keys(data).length === 0) {
    return res.status(400).json({ error: "Table name and data are required" });
  }
  let baseQuery = "";
  if (tableName === "transaksi_barang_masuk") {
    baseQuery = `INSERT INTO barang_masuk (id_barang_masuk, id_petugas, id_supplier, tanggal_masuk) VALUES (?, ?, ?, ?); 
    INSERT INTO detail_barang_masuk (id_detail_masuk, id_barang_masuk, id_barang, jumlah) VALUES (?, ?, ?, ?)`;
    values = [
      data.id_barang_masuk,
      data.id_petugas,
      data.id_supplier,
      data.tanggal_masuk,
      data.id_detail_masuk,
      data.id_barang_masuk,
      data.id_barang,
      data.jumlah,
    ];
  } else if (tableName === "transaksi_barang_keluar") {
    baseQuery = `INSERT INTO barang_keluar (id_barang_keluar, id_petugas, id_pelanggan, tanggal_keluar) VALUES (?, ?, ?, ?); 
    INSERT INTO detail_barang_keluar (id_detail_keluar, id_barang_keluar, id_barang, jumlah) VALUES (?, ?, ?, ?)`;
    values = [
      data.id_barang_keluar,
      data.id_petugas,
      data.id_pelanggan,
      data.tanggal_keluar,
      data.id_detail_keluar,
      data.id_barang_keluar,
      data.id_barang,
      data.jumlah,
    ];
  } else if (tableName === "service_detail_service") {
    baseQuery = `INSERT INTO service (id_service, id_pelanggan, id_petugas, jenis_service, keterangan, tanggal_masuk) VALUES (?, ?, ?, ?, ?, ?); 
    INSERT INTO detail_service (id_detail_service, id_service, nama_barang) VALUES (?, ?, ?)`;
    values = [
      data.id_service,
      data.id_pelanggan,
      data.id_petugas,
      data.jenis_service,
      data.keterangan,
      data.tanggal_masuk,
      data.id_detail_service,
      data.id_service,
      data.nama_barang,
    ];
  } else {
    return res.status(400).json({ error: "Invalid table name" });
  }

  connection.query(baseQuery, values, (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Item created in join table" });
  });
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

const updateItemInJoinTable = (req, res) => {
  const tableName = req.params.tableName;
  const data = req.body;
  console.log("Data received for update:", data);
  let values = [];
  if (!tableName || Object.keys(data).length === 0) {
    return res.status(400).json({ error: "Table name and data are required" });
  }
  let baseQuery = "";
  if (tableName === "transaksi_barang_masuk") {
    baseQuery = `UPDATE barang_masuk SET id_petugas = ?, id_supplier = ?, tanggal_masuk = ? WHERE id_barang_masuk = ?;
    UPDATE detail_barang_masuk SET id_barang = ?, jumlah = ? WHERE id_detail_masuk = ?`;
    values = [
      data.id_petugas,
      data.id_supplier,
      data.tanggal_masuk,
      data.id_barang_masuk,
      data.id_barang,
      data.jumlah,
      data.id_detail_masuk,
    ];
  } else if (tableName === "transaksi_barang_keluar") {
    baseQuery = `UPDATE barang_keluar SET id_petugas = ?, id_pelanggan = ?, tanggal_keluar = ? WHERE id_barang_keluar = ?;
    UPDATE detail_barang_keluar SET id_barang = ?, jumlah = ? WHERE id_detail_keluar = ?`;
    values = [
      data.id_petugas,
      data.id_pelanggan,
      data.tanggal_keluar,
      data.id_barang_keluar,
      data.id_barang,
      data.jumlah,
      data.id_detail_keluar,
    ];
  } else if (tableName === "service_detail_service") {
    baseQuery = `CALL transaksi_service(?, ?, ?)`;
    values = [data.id_service, data.nama_barang, data.tanggal_selesai];
  } else if (tableName === "barang") {
    baseQuery = `UPDATE ${tableName} SET ? WHERE id_${tableName} = ?`;
    values = [data, data[`id_${tableName}`]];
  } else {
    return res.status(400).json({ error: "Invalid table name" });
  }
  connection.query(baseQuery, values, (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item updated successfully", result });
  });
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

const deleteItemInJoinTable = (req, res) => {
  const tableName = req.params.tableName;
  const data = req.body;
  const values = [];
  if (!tableName || Object.keys(data).length === 0) {
    return res.status(400).json({ error: "Table name and data are required" });
  }
  if (tableName === "transaksi_barang_masuk") {
    baseQuery = `DELETE FROM detail_barang_masuk WHERE id_detail_masuk = ?`;
    values.push(data.id_detail_masuk);
  } else if (tableName === "transaksi_barang_keluar") {
    baseQuery = `DELETE FROM detail_barang_keluar WHERE id_detail_keluar = ?`;
    values.push(data.id_detail_keluar);
  } else if (tableName === "service_detail_service") {
    baseQuery = `DELETE FROM detail_service WHERE id_detail_service = ?`;
    values.push(data.id_detail_service);
  } else if (
    tableName === "barang" ||
    tableName === "supplier" ||
    tableName === "pelanggan"
  ) {
    baseQuery = `DELETE FROM ${tableName} WHERE id_${tableName} = ?`;
    values.push(data[`id_${tableName}`]);
  } else {
    return res.status(400).json({ error: "Invalid table name" });
  }
  connection.query(baseQuery, values, (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  });
};

const getJoinedTable = (req, res) => {
  const tableName = req.params.tableName;
  if (!tableName) {
    return res.status(400).json({ error: "Table name is required" });
  }
  let baseQuery = "";
  if (tableName === "transaksi_barang_masuk") {
    baseQuery = `SELECT b.nama_barang, k.jenis_barang, dbm.id_detail_masuk, bm.id_barang_masuk, bm.id_petugas, bm.id_supplier, bm.tanggal_masuk, b.id_barang, b.id_kategori, b.harga_beli, dbm.jumlah, b.harga_beli * dbm.jumlah AS total_harga FROM detail_barang_masuk AS dbm 
      INNER JOIN barang_masuk AS bm ON dbm.id_barang_masuk = bm.id_barang_masuk
      INNER JOIN barang AS b ON b.id_barang = dbm.id_barang
      INNER JOIN kategori AS k ON b.id_kategori = k.id_kategori;
      
      SELECT SUM(b.harga_beli * dbm.jumlah) AS grand_total
      FROM detail_barang_masuk AS dbm
      INNER JOIN barang AS b ON b.id_barang = dbm.id_barang;`;
  } else if (tableName === "transaksi_barang_keluar") {
    baseQuery = `SELECT b.nama_barang, k.jenis_barang, dbk.id_detail_keluar, bk.id_barang_keluar, bk.id_petugas, bk.id_pelanggan, bk.tanggal_keluar, b.id_barang, b.id_kategori, b.harga_jual, dbk.jumlah, b.harga_jual * dbk.jumlah AS total_harga FROM detail_barang_keluar AS dbk 
      INNER JOIN barang_keluar AS bk ON dbk.id_barang_keluar = bk.id_barang_keluar
      INNER JOIN barang AS b ON b.id_barang = dbk.id_barang
      INNER JOIN kategori AS k ON b.id_kategori = k.id_kategori;
      
      SELECT SUM(b.harga_jual * dbk.jumlah) AS grand_total, SUM(HitungLabaItem(dbk.jumlah, b.harga_jual, b.harga_beli)) AS total_laba
      FROM detail_barang_keluar AS dbk
      INNER JOIN barang AS b ON b.id_barang = dbk.id_barang;`;
  } else if (tableName === "service_detail_service") {
    baseQuery = `SELECT ds.id_detail_service, ds.id_service, s.id_pelanggan, s.id_petugas, s.jenis_service, ds.nama_barang, s.keterangan, s.tanggal_masuk, ds.tanggal_selesai, ds.durasi_service, ds.biaya_service, s.status FROM service AS s
      INNER JOIN detail_service AS ds ON ds.id_service = s.id_service`;
  } else {
    return res.status(400).json({ error: "Invalid table name" });
  }

  connection.query(baseQuery, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

const findItemByAttr = (req, res) => {
  const tableName = req.params.tableName;
  const queryParams = req.query;

  if (!tableName || Object.keys(queryParams).length === 0) {
    return res
      .status(400)
      .json({ error: "Table name and at least one attribute are required" });
  }

  const whereClauses = [];
  const values = [];
  for (const [key, value] of Object.entries(queryParams)) {
    if (key.includes("stok")) {
      const range = value.split("-");
      if (range.length === 2) {
        whereClauses.push(`${key} BETWEEN ? AND ?`);
        values.push(...range.map(Number));
      } else {
        whereClauses.push(`${key} = ?`);
        values.push(value);
      }
    } else {
      whereClauses.push(`${key} LIKE ?`);
      values.push(`%${value}%`);
    }
  }
  const whereString = whereClauses.length
    ? " WHERE " + whereClauses.join(" AND ")
    : "";

  let baseQuery = "";
  if (tableName === "transaksi_barang_masuk") {
    baseQuery = `SELECT b.nama_barang, k.jenis_barang, dbm.id_detail_masuk, bm.id_barang_masuk, bm.id_petugas, bm.id_supplier, bm.tanggal_masuk, b.id_barang, b.id_kategori, b.harga_beli, dbm.jumlah, 
      b.harga_beli * dbm.jumlah AS total_harga, SUM(b.harga_beli * dbm.jumlah) OVER () AS grand_total FROM detail_barang_masuk AS dbm 
      INNER JOIN barang_masuk AS bm ON dbm.id_barang_masuk = bm.id_barang_masuk
      INNER JOIN barang AS b ON b.id_barang = dbm.id_barang
      INNER JOIN kategori AS k ON b.id_kategori = k.id_kategori`;
  } else if (tableName === "transaksi_barang_keluar") {
    baseQuery = `SELECT b.nama_barang, k.jenis_barang, dbk.id_detail_keluar, bk.id_barang_keluar, bk.id_petugas, bk.id_pelanggan, bk.tanggal_keluar, b.id_barang, b.id_kategori, b.harga_jual, dbk.jumlah, 
      b.harga_jual * dbk.jumlah AS total_harga, SUM(b.harga_jual * dbk.jumlah) OVER () AS grand_total, SUM(HitungLabaItem(dbk.jumlah, b.harga_jual, b.harga_beli)) OVER () AS total_laba FROM detail_barang_keluar AS dbk 
      INNER JOIN barang_keluar AS bk ON dbk.id_barang_keluar = bk.id_barang_keluar
      INNER JOIN barang AS b ON b.id_barang = dbk.id_barang
      INNER JOIN kategori AS k ON b.id_kategori = k.id_kategori`;
  } else if (tableName === "service_detail_service") {
    baseQuery = `SELECT ds.id_detail_service, ds.id_service, s.id_pelanggan, s.id_petugas, s.jenis_service, ds.nama_barang, s.keterangan, s.tanggal_masuk, ds.tanggal_selesai, ds.durasi_service, ds.biaya_service, s.status FROM service AS s
      INNER JOIN detail_service AS ds ON ds.id_service = s.id_service`;
  } else if (
    tableName === "barang" ||
    tableName === "supplier" ||
    tableName === "pelanggan"
  ) {
    baseQuery = `SELECT * FROM ${tableName}`;
  } else {
    return res.status(400).json({ error: "Invalid table name" });
  }

  const finalQuery = baseQuery + whereString + ";";

  connection.query(finalQuery, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

module.exports = {
  createItem,
  updateItem,
  deleteItem,
  getAllItems,
  getItemById,
  findItemByAttr,
  getJoinedTable,
  createItemInJoinTable,
  deleteItemInJoinTable,
  updateItemInJoinTable,
};
