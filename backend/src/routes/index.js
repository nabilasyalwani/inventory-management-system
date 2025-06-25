const express = require("express");
const router = express.Router();

const {
  findLastID,
  handleLogin,
  handleRegister,
  createItem,
  deleteItem,
  getAllItems,
  getItemById,
  getJoinedTable,
  findItemByAttr,
  updateItem,
  createItemInJoinTable,
  deleteItemInJoinTable,
} = require("../controllers/index");

// API routes
router.put("/:tableName", updateItem);
router.get("/find/lastID/:tableName", findLastID);
router.get("/join/:tableName", getJoinedTable);
router.get("/join/find/:tableName", findItemByAttr);
router.get("/:tableName", getAllItems);
router.get("/:tableName/:id", getItemById);
router.post("/login", handleLogin);
router.post("/register", handleRegister);
router.post("/detail_barang_keluar", createItem);
router.post("/join/:tableName", createItemInJoinTable);
router.delete("/join/:tableName", deleteItemInJoinTable);
router.delete("/:tableName/:id", deleteItem);

module.exports = router;
