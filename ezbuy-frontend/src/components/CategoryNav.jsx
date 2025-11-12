// src/components/CategoryNav.jsx
const categories = ["Electronics", "Books", "Clothing", "Accessories"];

const CategoryNav = () => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      {categories.map((cat) => (
        <button
          key={cat}
          className="px-4 py-2 border border-gray-300 rounded-full hover:bg-blue-600 hover:text-white transition"
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryNav;
