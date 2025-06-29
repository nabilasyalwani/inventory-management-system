export const TABLE_HEADER = [
  "ID Barang",
  "Nama Barang",
  "Stok",
  "Harga Beli",
  "Harga Jual",
  "Kategori",
  "Aksi",
];

export const EMPTY_FORM_DATA = {
  id_barang: "",
  nama_barang: "",
  id_kategori: "",
  harga_beli: "",
  harga_jual: "",
  stok: "",
  gambar: "",
};

export const BarangFields = [
  {
    label: "Nama Barang",
    name: "nama_barang",
    type: "text",
  },
  {
    label: "Harga Beli",
    name: "harga_beli",
    type: "number",
  },
  {
    label: "Harga Jual",
    name: "harga_jual",
    type: "number",
  },
  {
    label: "Stok",
    name: "stok",
    type: "number",
  },
];
