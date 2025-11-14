import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <Link to={`/products/${product.id}`} className="block relative">
        <div className="aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.image_url || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        <div className="absolute top-3 right-3 bg-green-500 px-3 py-1.5 rounded-full shadow-lg">
          <span className="text-xs font-bold text-white">Save 30%</span>
        </div>
      </Link>

      <div className="p-5 relative">
        <p className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">
          {product.category_name || product.category}
        </p>
        
        <Link to={`/products/${product.id}`}>
          <h3 className="text-base font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-black text-gray-900">
            ${parseFloat(product.student_price).toFixed(2)}
          </span>
          <span className="text-sm text-gray-400 line-through">
            ${parseFloat(product.price).toFixed(2)}
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm"
          >
            View
          </Link>
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;