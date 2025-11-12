// src/components/ProductCard.jsx
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md transition p-4 flex flex-col">
      <Link to={`/products/${product.id}`} className="mb-4">
        <img
          src={product.images[0]} // Access the first image in the array
          alt={product.name}
          className="w-full h-48 object-cover rounded-md"
        />
      </Link>

      <div className="flex-grow">
        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
        <p className="text-gray-600 mb-2 text-sm">{product.category}</p>
        <p className="text-gray-900 font-bold">
          ${product.price.toFixed(2)}{" "}
          <span className="text-green-600 text-sm ml-2">
            Student: ${product.studentPrice.toFixed(2)}
          </span>
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          to={`/products/${product.id}`}
          className="flex-1 text-center bg-gray-200 text-gray-800 px-3 py-2 rounded hover:bg-gray-300 transition"
        >
          View
        </Link>
        <button
          onClick={() => addToCart(product)}
          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
