export const TABLE_HEADER = ["Tanggal", "Nama Barang", "Jumlah", "Total Harga"];

export const EMPTY_FORM_DATA = {
  id_petugas: "",
  id_distributor: "",
  id_barang: "",
  nama_barang: "",
  jumlah: "",
  tanggal_keluar: "",
};

export const TransaksiKeluarFields = [
  {
    label: "Tanggal Keluar",
    name: "tanggal_keluar",
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
