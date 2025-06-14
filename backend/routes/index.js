const express = require("express");
const router = express.Router();

const {
  createItem,
  updateItem,
  deleteItem,
  getAllItems,
  getItemById,
  getServiceDetailService,
  getTransaksiBarangMasuk,
  getTransaksiBarangKeluar,
} = require("../controllers/index");

// API routes
router.put("/barang/:id", updateItem);
router.post("/detail_barang_keluar", createItem);
router.delete("/:tableName/:id", deleteItem);
router.get("/join/service_detail_service", getServiceDetailService);
router.get("/join/transaksi_barang_masuk", getTransaksiBarangMasuk);
router.get("/join/transaksi_barang_keluar", getTransaksiBarangKeluar);
router.get("/:tableName", getAllItems);
router.get("/:tableName/:id", getItemById);

module.exports = router;
