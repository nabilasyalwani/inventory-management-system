export default function Product({ product }) {
  return (
    <div className="product">
      <h2>{product.name}</h2>
      <p>Price: ${product.price}</p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
