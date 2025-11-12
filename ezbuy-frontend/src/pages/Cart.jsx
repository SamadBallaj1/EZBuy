// src/pages/Cart.jsx
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const studentDiscount = subtotal * 0.3; // 30% discount
  const tax = (subtotal - studentDiscount) * 0.07;
  const shipping = cartItems.length > 0 ? 5 : 0;
  const total = subtotal - studentDiscount + tax + shipping;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center border-b py-4 justify-between"
              >
                <div className="flex items-center space-x-4">
                <img
                    src={item.images?.[0] || item.imageUrl || item.image || 'https://via.placeholder.com/80?text=No+Image'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                    }}
                  />
                  <div>
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="text-gray-600">${item.price}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(item.quantity - 1, 1))
                    }
                    className="px-3 py-1 border rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 border rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border rounded-lg p-6 bg-gray-50 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-gray-700">
              <p>Subtotal: ${subtotal.toFixed(2)}</p>
              <p>Student Discount: -${studentDiscount.toFixed(2)}</p>
              <p>Tax: ${tax.toFixed(2)}</p>
              <p>Shipping: ${shipping.toFixed(2)}</p>
              <hr className="my-2" />
              <p className="font-bold text-lg">
                Total: ${total.toFixed(2)}
              </p>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
