// src/pages/Checkout.jsx
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "credit-card",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normally, you'd call Stripe API or backend here
    alert("✅ Purchase completed successfully!");
    clearCart();
    navigate("/confirmation"); // redirect after purchase
  };

  // Calculate totals
  const subtotal = cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const studentDiscount = subtotal * 0.3;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.07;
  const total = subtotal - studentDiscount + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Progress Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-4 text-gray-600 text-sm">
          <span className="text-blue-600 font-semibold">Cart</span>
          <span>→</span>
          <span className="text-blue-600 font-semibold">Checkout</span>
          <span>→</span>
          <span>Confirmation</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Left: Shipping Form */}
        <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full border border-gray-300 rounded-lg p-2"
              ></textarea>
            </div>

            {/* Payment Section */}
            <div>
              <label className="block font-medium mb-1">Payment Method</label>
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="credit-card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Complete Purchase
            </button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-gray-50 shadow-md rounded-lg p-6 h-fit">
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
          <div className="space-y-3">
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${((item.studentPrice || item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Your cart is empty</p>
            )}
          </div>

          <div className="mt-6 border-t pt-4 space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Student Discount (30%)</span>
              <span>-${studentDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-3">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;