const connection = require("../db/mysql");

const getAllItems = (req, res) => {
  const tableName = req.params.tableName;
  if (!tableName) {
    return res.status(400).json({ error: "Table name is required" });
  }

  let baseQuery = "";
  if (tableName === "transaksi_masuk") {
    baseQuery = `SELECT * FROM ${tableName}; SELECT SUM(Total_harga) AS grand_total FROM ${tableName}`;
  } else if (tableName === "transaksi_keluar") {
    baseQuery = `SELECT * FROM ${tableName}; SELECT SUM(Total_harga) AS grand_total FROM ${tableName}`;
  } else {
    baseQuery = `SELECT * FROM ${tableName}`;
  }

  connection.query(baseQuery, (err, results) => {
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
  if (tableName === "transaksi_masuk") {
    baseQuery = `CALL tambah_transaksi_masuk (?, ?, ?, ?, ?, ?);`;
    values = [
      data.id_petugas,
      data.id_supplier,
      data.id_barang,
      data.nama_barang,
      data.jumlah,
      data.tanggal_masuk,
    ];
  } else if (tableName === "transaksi_keluar") {
    baseQuery = `CALL tambah_transaksi_keluar (?, ?, ?, ?, ?, ?);`;
    values = [
      data.id_petugas,
      data.id_distributor,
      data.id_barang,
      data.nama_barang,
      data.jumlah,
      data.tanggal_keluar,
    ];
  } else if (tableName === "service") {
    baseQuery = `INSERT INTO ${tableName} (id_petugas,id_kategori, jenis_barang, nama_barang, tanggal_masuk, keterangan) VALUES (?, ?, ?, ?, ?, ?)`;
    values = [
      data.id_petugas,
      data.id_kategori,
      data.jenis_barang,
      data.nama_barang,
      data.tanggal_masuk,
      data.keterangan,
    ];
  } else if (tableName === "barang") {
    baseQuery = `INSERT INTO ${tableName} (id_barang, nama_barang, stok, harga_beli, harga_jual, id_kategori) VALUES (?, ?, ?, ?, ?, ?)`;
    values = [
      data.id_barang,
      data.nama_barang,
      data.stok,
      data.harga_beli,
      data.harga_jual,
      data.id_kategori,
    ];
  } else if (tableName === "supplier" || tableName === "distributor") {
    baseQuery = `INSERT INTO ${tableName} (id_${tableName}, nama_${tableName}, alamat_${tableName}, no_telp_${tableName}) VALUES (?, ?, ?, ?)`;
    values = [...Object.values(data)];
  } else if (tableName === "petugas") {
    baseQuery = `INSERT INTO ${tableName} (id_petugas, username, password, nama_petugas, status) VALUES (?, ?, ?, ?, ?)`;
    values = [
      data.id_petugas,
      data.username,
      data.password,
      data.nama_petugas,
      data.status || "aktif",
    ];
  } else if (tableName === "kategori") {
    baseQuery = `INSERT INTO ${tableName} (id_kategori, nama_kategori, no_rak) VALUES (?, ?, ?)`;
    values = [data.id_kategori, data.nama_kategori, data.no_rak];
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
    baseQuery = `UPDATE barang_keluar SET id_petugas = ?, id_distributor = ?, tanggal_keluar = ? WHERE id_barang_keluar = ?;
    UPDATE detail_barang_keluar SET id_barang = ?, jumlah = ? WHERE id_detail_keluar = ?`;
    values = [
      data.id_petugas,
      data.id_distributor,
      data.tanggal_keluar,
      data.id_barang_keluar,
      data.id_barang,
      data.jumlah,
      data.id_detail_keluar,
    ];
  } else if (tableName === "service_detail_service") {
    baseQuery = `CALL transaksi_service(?, ?, ?);`;
    values = [data.id_service, data.nama_barang, data.tanggal_selesai];
  } else if (tableName === "service") {
    baseQuery = `CALL update_service(?, ?);`;
    values = [data.id_service, data.tanggal_keluar];
  } else if (
    tableName === "barang" ||
    tableName === "supplier" ||
    tableName === "distributor" ||
    tableName === "kategori" ||
    tableName === "petugas" ||
    tableName === "service" ||
    tableName === "transaksi_masuk" ||
    tableName === "transaksi_keluar"
  ) {
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
    tableName === "distributor"
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
  if (tableName === "laporan_transaksi_masuk") {
    baseQuery = `SELECT tm.tanggal_masuk, s.nama_supplier, b.nama_barang, k.nama_kategori, tm.jumlah, b.harga_beli, (tm.jumlah * b.harga_beli) AS Total_harga FROM transaksi_masuk AS tm
      JOIN supplier AS s ON s.id_supplier = tm.id_supplier
      JOIN barang AS b ON b.id_barang = tm.id_barang
      JOIN kategori AS k ON k.id_kategori = b.id_kategori;`;
  } else if (tableName === "laporan_transaksi_keluar") {
    baseQuery = `SELECT tk.tanggal_keluar, d.nama_distributor, b.nama_barang, k.nama_kategori, tk.jumlah, b.harga_jual, (tk.jumlah * b.harga_jual) AS Total_harga FROM transaksi_keluar AS tk
      JOIN distributor AS d ON d.id_distributor = tk.id_distributor
      JOIN barang AS b ON b.id_barang = tk.id_barang
      JOIN kategori AS k ON k.id_kategori = b.id_kategori;`;
  } else if (tableName === "laporan_service") {
    baseQuery = `SELECT s.*, p.nama_petugas FROM service AS s
      JOIN petugas AS p ON p.id_petugas = s.id_petugas;`;
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
    } else if (key.includes("status")) {
      whereClauses.push(`${key} = ?`);
      values.push(value);
    } else if (key.includes("tanggal")) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }
      whereClauses.push(`${key} = ?`);
      values.push(date.toISOString().split("T")[0]); // Format date to YYYY-MM-DD
    } else if (key.includes("harga")) {
      const range = value.split("-");
      if (range.length === 2) {
        whereClauses.push(`${key} BETWEEN ? AND ?`);
        values.push(...range.map(Number));
      } else {
        whereClauses.push(`${key} = ?`);
        values.push(value);
      }
    } else if (key.includes("id")) {
      whereClauses.push(`${key} = ?`);
      values.push(value);
    } else {
      whereClauses.push(`${key} LIKE ?`);
      values.push(`%${value}%`);
    }
  }
  const whereString = whereClauses.length
    ? " WHERE " + whereClauses.join(" AND ")
    : "";

  let baseQuery = "";
  if (tableName === "laporan_transaksi_masuk") {
    baseQuery = `SELECT tm.tanggal_masuk, s.nama_supplier, b.nama_barang, k.nama_kategori, tm.jumlah, b.harga_beli, (tm.jumlah * b.harga_beli) AS Total_harga FROM transaksi_masuk AS tm
      JOIN supplier AS s ON s.id_supplier = tm.id_supplier
      JOIN barang AS b ON b.id_barang = tm.id_barang
      JOIN kategori AS k ON k.id_kategori = b.id_kategori`;
  } else if (tableName === "laporan_transaksi_keluar") {
    baseQuery = `SELECT tk.tanggal_keluar, d.nama_distributor, b.nama_barang, k.nama_kategori, tk.jumlah, b.harga_jual, (tk.jumlah * b.harga_jual) AS Total_harga FROM transaksi_keluar AS tk
      JOIN distributor AS d ON d.id_distributor = tk.id_distributor
      JOIN barang AS b ON b.id_barang = tk.id_barang
      JOIN kategori AS k ON k.id_kategori = b.id_kategori`;
  } else if (tableName === "laporan_service") {
    baseQuery = `SELECT s.*, p.nama_petugas FROM service AS s
      JOIN petugas AS p ON p.id_petugas = s.id_petugas`;
  } else if (
    tableName === "barang" ||
    tableName === "supplier" ||
    tableName === "distributor" ||
    tableName === "kategori" ||
    tableName === "petugas" ||
    tableName === "service" ||
    tableName === "transaksi_masuk" ||
    tableName === "transaksi_keluar"
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

const handleLogin = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  connection.query(
    "SELECT * FROM petugas WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.json(results[0]);
    }
  );
};

const handleRegister = (req, res) => {
  const { username, password, nama_petugas } = req.body;
  if (!username || !password || !nama_petugas) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Get the last id_petugas
  connection.query(
    "SELECT id_petugas FROM petugas ORDER BY id_petugas DESC LIMIT 1",
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
        console.error("Error fetching last id_petugas:", err);
      }
      let newId = "PTG001";
      if (results.length > 0) {
        const lastId = results[0].id_petugas;
        const num = parseInt(lastId.replace("PTG", ""), 10) + 1;
        newId = "PTG" + num.toString().padStart(3, "0");
      }

      connection.query(
        "INSERT INTO petugas (id_petugas, username, password, nama_petugas, status) VALUES (?, ?, ?, ?, ?)",
        [newId, username, password, nama_petugas, "aktif"],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
            console.error("Error inserting new user:", err);
          }
          res.status(201).json({
            message: "User registered successfully",
            id_petugas: newId,
          });
        }
      );
    }
  );
};

const findLastID = (req, res) => {
  const tableName = req.params.tableName;
  if (!tableName) {
    return res.status(400).json({ error: "Table name is required" });
  }
  const idColumn = `id_${tableName}`;
  if (tableName === "detail_barang_keluar") {
    idColumn = "id_detail_keluar";
  } else if (tableName === "detail_barang_masuk") {
    idColumn = "id_detail_masuk";
  }
  connection.query(
    `SELECT ${idColumn} FROM ${tableName} ORDER BY ${idColumn} DESC LIMIT 1`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "No items found" });
      }
      res.json(results[0]);
    }
  );
};

module.exports = {
  findLastID,
  handleLogin,
  handleRegister,
  createItem,
  updateItem,
  deleteItem,
  updateItem,
  getAllItems,
  getItemById,
  findItemByAttr,
  getJoinedTable,
  createItemInJoinTable,
  deleteItemInJoinTable,
};
