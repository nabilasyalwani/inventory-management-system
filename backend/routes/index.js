const express = require("express");
const router = express.Router();

const {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  getAllItems,
  getItemById,
} = require("../controllers/index");

// API routes
router.put("/barang/:id", updateItem);
router.post("/detail_barang_keluar", createItem);
router.delete("/:tableName/:id", deleteItem);
router.get("/:tableName", getAllItems);
router.get("/:tableName/:id", getItemById);

module.exports = router;
