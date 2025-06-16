const express = require("express");
const router = express.Router();

const {
  createItem,
  deleteItem,
  getAllItems,
  getItemById,
  getJoinedTable,
  findItemByAttr,
  createItemInJoinTable,
  deleteItemInJoinTable,
  updateItemInJoinTable,
} = require("../controllers/index");

// API routes
router.put("/join/:tableName", updateItemInJoinTable);
router.get("/join/find/:tableName", findItemByAttr);
router.get("/join/:tableName", getJoinedTable);
router.get("/:tableName", getAllItems);
router.get("/:tableName/:id", getItemById);
router.post("/detail_barang_keluar", createItem);
router.post("/join/:tableName", createItemInJoinTable);
router.delete("/join/:tableName", deleteItemInJoinTable);
router.delete("/:tableName/:id", deleteItem);

module.exports = router;
