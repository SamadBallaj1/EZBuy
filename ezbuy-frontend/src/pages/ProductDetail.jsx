// src/pages/ProductDetail.jsx
import { useParams } from "react-router-dom";
import { useState } from "react";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const product = getProductById(id);
  const { addToCart } = useCart();
  const [mainImage, setMainImage] = useState(product?.images[0]);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [quantity, setQuantity] = useState(1);

  if (!product) return <p className="text-center mt-10">Product not found.</p>;

  return (
    <div className="container mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      {/* Left: Product Images */}
      <div>
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-auto rounded-lg shadow-md mb-4"
        />

        <div className="flex gap-3">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${product.name} ${index}`}
              className={`w-20 h-20 object-cover rounded-md cursor-pointer border ${
                mainImage === img ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      </div>

      {/* Right: Product Info */}
      <div>
        <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-sm text-gray-500 mb-2">{product.specs}</p>

        <div className="mb-6">
          <p className="text-xl font-semibold text-gray-900">
            ${product.price.toFixed(2)}{" "}
            <span className="text-green-600 text-lg ml-2">
              Student: ${product.studentPrice.toFixed(2)}
            </span>
          </p>
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border border-gray-300 rounded-lg w-20 text-center py-2"
          />
        </div>

        {/* Add to Cart Button */}
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          onClick={() => addToCart(product, quantity)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
