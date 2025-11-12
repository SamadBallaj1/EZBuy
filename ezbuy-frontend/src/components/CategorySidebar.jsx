// src/components/CategorySidebar.jsx
const CategorySidebar = ({ categories, selected, onSelect }) => {
    return (
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="font-bold text-lg mb-4">Categories</h2>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => onSelect(cat)}
                className={`block w-full text-left px-3 py-2 rounded-md ${
                  selected === cat
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-blue-100"
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => onSelect("All")}
              className={`block w-full text-left px-3 py-2 rounded-md ${
                selected === "All"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              }`}
            >
              All
            </button>
          </li>
        </ul>
      </div>
    );
  };
  
  export default CategorySidebar;
  