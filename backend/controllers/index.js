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

const getServiceDetailService = (req, res) => {
  connection.query(
    `SELECT ds.id_detail_service, ds.id_service, s.jenis_service, ds.nama_barang, s.keterangan, s.tanggal_masuk, ds.tanggal_selesai, ds.durasi_service, ds.biaya_service, s.status FROM service AS s
    INNER JOIN detail_service AS ds ON ds.id_service = s.id_service`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: "Service and Detail Service fetched successfully",
        data: results,
      });
    }
  );
};

const getTransaksiBarangMasuk = (req, res) => {
  connection.query(
    `SELECT dbm.id_detail_masuk, bm.id_petugas, bm.id_supplier, bm.tanggal_masuk, b.id_barang, b.id_kategori, b.harga_beli, dbm.jumlah, b.harga_beli * dbm.jumlah AS total_harga FROM detail_barang_masuk AS dbm 
    INNER JOIN barang_masuk AS bm ON dbm.id_barang_masuk = bm.id_barang_masuk
    INNER JOIN barang AS b ON b.id_barang = dbm.id_barang`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: "Transaksi Barang Masuk fetched successfully",
        data: results,
      });
    }
  );
};

const getTransaksiBarangKeluar = (req, res) => {
  connection.query(
    `SELECT dbk.id_detail_keluar, bk.id_petugas, bk.id_pelanggan, bk.tanggal_keluar, b.id_barang, b.id_kategori, b.harga_jual, dbk.jumlah, b.harga_jual * dbk.jumlah AS total_harga FROM detail_barang_keluar AS dbk 
    INNER JOIN barang_keluar AS bk ON dbk.id_barang_keluar = bk.id_barang_keluar
    INNER JOIN barang AS b ON b.id_barang = dbk.id_barang`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: "Transaksi Barang Keluar fetched successfully",
        data: results,
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
  getServiceDetailService,
  getTransaksiBarangMasuk,
  getTransaksiBarangKeluar,
};
