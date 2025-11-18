import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    addToCart(product);
    
    setTimeout(() => setIsAdding(false), 600);
  };

  const savings = parseFloat(product.price) - parseFloat(product.student_price);
  const savingsPercent = ((savings / parseFloat(product.price)) * 100).toFixed(0);

  return (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:border-blue-200/50 hover:-translate-y-2">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
          )}
          
          <img
            src={product.image_url || 'https://via.placeholder.com/400'}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1.5 rounded-full shadow-xl backdrop-blur-md border border-white/20 transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-xs font-black text-white drop-shadow-md">
                Save {savingsPercent}%
              </span>
            </div>
            
            {product.stock < 10 && (
              <div className="bg-gradient-to-r from-red-500 to-orange-500 px-3 py-1.5 rounded-full shadow-xl backdrop-blur-md border border-white/20">
                <span className="text-xs font-black text-white drop-shadow-md">
                  Low Stock
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="p-6 relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
          <p className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 uppercase tracking-wider">
            {product.category_name || product.category}
          </p>
        </div>
        
        <Link to={`/products/${product.id}`}>
          <h3 className="text-base font-bold mb-3 text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 line-clamp-2 min-h-[3rem] leading-tight">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-end gap-3 mb-5">
          <div className="flex flex-col">
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              ${parseFloat(product.student_price).toFixed(2)}
            </span>
            <span className="text-xs text-gray-400 line-through font-semibold">
              ${parseFloat(product.price).toFixed(2)}
            </span>
          </div>
          <div className="bg-green-50 px-2 py-1 rounded-lg border border-green-200">
            <p className="text-xs font-bold text-green-700">
              Save ${savings.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 text-center bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-800 px-4 py-3 rounded-xl font-bold transition-all duration-300 text-sm border border-gray-200 hover:border-gray-300 hover:shadow-md active:scale-95"
          >
            Details
          </Link>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all duration-300 text-sm flex items-center justify-center gap-2 border border-blue-500/20 active:scale-95 ${
              isAdding 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white scale-105 shadow-lg shadow-green-500/50' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-600/50'
            }`}
          >
            {isAdding ? (
              <>
                <svg className="w-4 h-4 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Added
              </>
            ) : (
              <>
                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                Add
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-700 pointer-events-none" />
    </div>
  );
};

export default ProductCard;