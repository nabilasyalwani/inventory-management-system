export const TABLE_HEADER = [
  "Tanggal Masuk",
  "Tanggal Selesai",
  "Nama Barang",
  "Jenis Service",
  "Biaya Service",
  "Status",
  "Aksi",
];

export const EMPTY_FORM_DATA = {
  id_petugas: "",
  id_kategori: "",
  jenis_barang: "",
  nama_barang: "",
  tanggal_masuk: "",
  tanggal_keluar: "",
  keterangan: "",
  status: "Proses",
};

export const addServiceFields = [
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
    label: "Keterangan",
    name: "keterangan",
    type: "text",
  },
];

export const updateServiceFields = [
  {
    label: "Tanggal Selesai",
    name: "tanggal_keluar",
    type: "date",
  },

  {
    label: "Nama Barang",
    name: "nama_barang",
    type: "text",
  },
  {
    label: "Keterangan",
    name: "keterangan",
    type: "text",
  },
];
