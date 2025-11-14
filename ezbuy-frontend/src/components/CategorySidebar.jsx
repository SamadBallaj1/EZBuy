import { useNavigate } from "react-router-dom";

const CategorySidebar = ({ categories, selected, onSelect }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (cat) => {
    onSelect(cat);
    if (cat === "All") {
      navigate('/products');
    } else {
      navigate(`/products?category=${cat}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h2 className="font-bold text-xl mb-6 text-gray-900">
        Categories
      </h2>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat}>
            <button
              onClick={() => handleCategoryClick(cat)}
              className={`block w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                selected === cat
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => handleCategoryClick("All")}
            className={`block w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
              selected === "All"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Products
          </button>
        </li>
      </ul>
    </div>
  );
};

export default CategorySidebar;