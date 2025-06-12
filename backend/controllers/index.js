const connection = require("../db/mysql");

const getItems = (req, res) => {
  connection.query("SELECT * FROM barang", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
    console.log(results);
  });
};

const createItem = (req, res) => {
  res.json({ message: "createItem called" });
};

const updateItem = (req, res) => {
  res.json({ message: "updateItem called" });
};

const deleteItem = (req, res) => {
  res.json({ message: "deleteItem called" });
};

module.exports = {
  getItems,
  createItem,
  updateItem,
  deleteItem,
};
