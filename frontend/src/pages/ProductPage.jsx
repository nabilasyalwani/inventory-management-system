import React, { useState, useEffect } from "react";
import "./ProductPage.css";

const TABLE_HEADER = [
  "Nama Barang",
  "Stok",
  "Satuan",
  "Harga Beli",
  "Harga Jual",
  "ID Kategori",
  "Actions",
];

export default function ProductPage() {
  const [barang, setBarang] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/barang");

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setBarang(data);
        console.log("Fetched products:", data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-page">
      <h1>Product Page</h1>
      <p>This is the product page where you can view and manage products.</p>
      <table>
        <thead>
          <tr>
            {TABLE_HEADER.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {barang.map((item) => (
            <tr key={item.id_barang}>
              <td>{item.nama_barang}</td>
              <td>{item.stok}</td>
              <td>{item.satuan}</td>
              <td>{item.harga_beli}</td>
              <td>{item.harga_jual}</td>
              <td>{item.id_kategori}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={TABLE_HEADER.length}>
              <button>Add New Product</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
