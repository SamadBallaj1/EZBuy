import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const subtotal = cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
    const studentDiscount = subtotal * 0.3;
    const shipping = subtotal > 0 ? 5.99 : 0;
    const tax = subtotal * 0.07;
    const total = subtotal - studentDiscount + shipping + tax;

    try {
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 1,
          items: cartItems,
          total_amount: total,
          shipping_address: form.address
        })
      });

      if (!response.ok) throw new Error('Order failed');

      const order = await response.json();

      clearCart();
      navigate("/confirmation", { 
        state: { 
          order,
          items: cartItems,
          customerInfo: form,
          totals: { subtotal, studentDiscount, shipping, tax, total }
        } 
      });
    } catch (error) {
      console.error('Order failed:', error);
      alert("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const studentDiscount = subtotal * 0.3;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.07;
  const total = subtotal - studentDiscount + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-10">
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="John Doe"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Shipping Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="123 Main St, City, State ZIP"
              />
            </div>

            <button
              type="submit"
              disabled={loading || cartItems?.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Complete Purchase'}
            </button>
          </form>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-fit sticky top-24">
          <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
          
          <div className="space-y-4 mb-6">
            {cartItems?.map((item) => (
              <div key={item.id} className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                  <p className="text-blue-600 font-semibold text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-gray-300 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Student Discount (30%)</span>
              <span>-${studentDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-3">
              <span>Total</span>
              <span className="text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;