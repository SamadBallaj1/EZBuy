// src/pages/Confirmation.jsx
import { Link } from "react-router-dom";

const Confirmation = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        🎉 Order Confirmed!
      </h1>
      <p className="text-gray-700 mb-6">
        Thank you for your purchase! A confirmation email has been sent to you.
      </p>

      <div className="border-t border-gray-300 my-8"></div>

      <div className="flex flex-col items-center space-y-3">
        <Link
          to="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
        <Link
          to="/"
          className="text-gray-600 underline hover:text-gray-900 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Confirmation;
