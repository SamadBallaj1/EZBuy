import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ clientSecret, orderDetails, shippingInfo }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart, cartItems } = useCart();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      try {
        const response = await fetch('http://localhost:3001/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            items: cartItems,
            total_amount: orderDetails.total,
            student_discount_applied: orderDetails.studentDiscount,
            shipping_address: shippingInfo.address,
          }),
        });

        const order = await response.json();
        
        toast.success("Payment successful!");
        clearCart();
        navigate("/confirmation", { 
          state: { 
            order,
            orderDetails,
            shippingInfo
          } 
        });
      } catch (err) {
        toast.error("Order creation failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-gray-900">Payment Details</h3>
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
          loading || !stripe ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl hover:scale-105'
        } text-white`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          `Pay $${orderDetails.total.toFixed(2)}`
        )}
      </button>

      <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span className="font-semibold">Secured by Stripe</span>
      </div>
    </form>
  );
}

const Checkout = () => {
  const { cartItems } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: user?.full_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (!user) {
      toast.error("Please login to checkout");
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const studentDiscount = user?.is_student ? subtotal * 0.3 : 0;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.07;
  const total = subtotal - studentDiscount + shipping + tax;

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    if (!user) return;

    const createPaymentIntent = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            items: cartItems,
            user_id: user.id,
            shipping_address: form.address,
          }),
        });

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        toast.error('Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (!user || cartItems.length === 0) return null;

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#2563eb',
      colorBackground: '#ffffff',
      colorText: '#1e293b',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
    },
  };

  const options = { clientSecret, appearance };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">Cart</span>
            <span>→</span>
            <span className="text-blue-600 font-bold">Checkout</span>
            <span>→</span>
            <span className="text-gray-400">Confirmation</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                Shipping Information
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block font-bold text-gray-900 mb-2">Full Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="John Doe" />
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-2">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="you@example.com" />
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-2">Phone Number</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="(555) 123-4567" />
                </div>

                <div>
                  <label className="block font-bold text-gray-900 mb-2">Shipping Address</label>
                  <textarea name="address" value={form.address} onChange={handleChange} required rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
                    placeholder="123 Main St, City, State ZIP" />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20 flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 font-semibold">Loading payment...</p>
                </div>
              </div>
            ) : clientSecret ? (
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm clientSecret={clientSecret} orderDetails={{ subtotal, studentDiscount, shipping, tax, total }} shippingInfo={form} />
              </Elements>
            ) : null}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <h3 className="text-2xl font-black text-white">Order Summary</h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cartItems?.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg border-2 border-gray-100" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{item.name}</p>
                        <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                        <p className="text-blue-600 font-black text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>

                  {user?.is_student && (
                    <div className="flex justify-between text-sm bg-green-50 -mx-6 px-6 py-3 border-y border-green-100">
                      <span className="text-green-700 font-bold flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        Student Discount (30%)
                      </span>
                      <span className="font-black text-green-600">−${studentDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Shipping</span>
                    <span className="font-bold text-gray-900">${shipping.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Tax (7%)</span>
                    <span className="font-bold text-gray-900">${tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t-2 border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total</span>
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        ${total.toFixed(2)}
                      </span>
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

export default Checkout;