import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await new Promise(r => setTimeout(r, 400));
    addToCart(product, quantity);
    setIsAdding(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return <p className="text-center mt-10 text-xl">Product not found</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
                <img
                  src={product.image_url || 'https://via.placeholder.com/600'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-4 right-4 bg-green-500 px-4 py-2 rounded-full shadow-lg">
                <span className="text-sm font-bold text-white">Save 30%</span>
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">
                {product.category_name || 'Product'}
              </p>
              <h1 className="text-4xl font-black text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">{product.description}</p>
              {product.specs && (
                <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl mb-6">{product.specs}</p>
              )}

              <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ${parseFloat(product.student_price).toFixed(2)}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  💰 Save ${(parseFloat(product.price) - parseFloat(product.student_price)).toFixed(2)}
                </p>
              </div>

              <div className="mb-6">
                <label className="block font-bold text-gray-900 mb-3">Quantity:</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-xl transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-20 h-12 text-center border-2 border-gray-300 rounded-xl font-bold text-lg"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-xl transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  isAdding
                    ? 'bg-green-500 scale-95'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                } text-white`}
              >
                {isAdding ? (
                  <>
                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>🛒 Add to Cart</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;


 