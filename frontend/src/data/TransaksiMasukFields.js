export const TABLE_HEADER = ["Tanggal", "Nama Barang", "Jumlah", "Total Harga"];

export const EMPTY_FORM_DATA = {
  id_petugas: "",
  id_supplier: "",
  id_barang: "",
  nama_barang: "",
  jumlah: "",
  tanggal_masuk: "",
};

export const TransaksiMasukFields = [
  {
    label: "Tanggal Masuk",
    name: "tanggal_masuk",
    type: "date",
  },

  {
    label: "Nama Barang",
    name: "nama_barang",
    type: "text",
  },

  {
    label: "Jumlah",
    name: "jumlah",
    type: "number",
  },
];
