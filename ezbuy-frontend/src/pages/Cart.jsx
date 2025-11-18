import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { useState } from "react";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = async (id) => {
    setRemovingId(id);
    await new Promise(resolve => setTimeout(resolve, 300));
    removeFromCart(id);
    setRemovingId(null);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const studentDiscount = subtotal * 0.3;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.07;
  const total = subtotal - studentDiscount + shipping + tax;

  const handleQuantityChange = (id, delta) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      updateQuantity(id, item.quantity + delta);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-3xl opacity-20 animate-pulse" />
            <svg className="w-48 h-48 mx-auto relative text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
          </div>
          
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Your cart is empty
          </h2>
          
          <p className="text-gray-600 mb-8 text-lg">
            Start adding some amazing products to your cart!
          </p>
          
          <Link
            to="/products"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl shadow-blue-500/50 hover:shadow-2xl hover:shadow-blue-600/50 hover:scale-105 active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 text-lg">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 overflow-hidden animate-fadeIn ${
                  removingId === item.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <div className="p-6 flex gap-6">
                  <Link 
                    to={`/products/${item.id}`}
                    className="relative group flex-shrink-0"
                  >
                    <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white shadow-md">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <Link to={`/products/${item.id}`}>
                        <h3 className="text-xl font-bold text-gray-900 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 mb-2 line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                      
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <>
                            <span className="text-sm text-gray-400 line-through font-semibold">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold border border-green-200">
                              Student Price
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 border border-gray-200">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="w-10 h-10 bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white rounded-lg font-bold text-xl transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 border border-gray-200"
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-black text-lg text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-10 h-10 bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white rounded-lg font-bold text-xl transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 border border-gray-200"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xl font-black text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={removingId === item.id}
                          className="text-red-500 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 p-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50 active:scale-95 group"
                        >
                          <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <h3 className="text-2xl font-black text-white">Order Summary</h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base bg-green-50 -mx-6 px-6 py-3 border-y border-green-100">
                  <span className="text-green-700 font-bold flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Student Discount (30%)
                  </span>
                  <span className="font-black text-green-600">−${studentDiscount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base">
                  <span className="text-gray-600 font-medium">Shipping</span>
                  <span className="font-bold text-gray-900">${shipping.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base">
                  <span className="text-gray-600 font-medium">Tax (7%)</span>
                  <span className="font-bold text-gray-900">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t-2 border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  <Link
                    to="/checkout"
                    className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl shadow-blue-500/50 hover:shadow-2xl hover:shadow-blue-600/50 text-center text-lg hover:scale-105 active:scale-95 mb-3"
                  >
                    Proceed to Checkout →
                  </Link>

                  <Link
                    to="/products"
                    className="block w-full text-center text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 font-bold py-3 transition-all duration-300"
                  >
                    ← Continue Shopping
                  </Link>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mt-4">
                  <div className="flex gap-3">
                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                    <div>
                      <p className="font-bold text-blue-900 text-sm mb-1">Student Verified</p>
                      <p className="text-xs text-blue-700">You're saving ${studentDiscount.toFixed(2)} with student pricing!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;