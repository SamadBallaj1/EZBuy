import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showStudentPrice, setShowStudentPrice] = useState(false);
  const { addToCart } = useCart();

  const searchQuery = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || 'all';

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, categoryFilter, sortBy, priceRange, showStudentPrice]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products'); // FIXED: Changed from 3000 to 3001
      const data = await response.json();
      console.log('Fetched products:', data);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.specs && product.specs.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (categoryFilter !== 'all') {
      const categoryMap = {
        'electronics': 1,
        'accessories': 2,
        'audio': 3,
        'fashion': 2,
        'home': 2,
        'student': 2,
        'coffee': 2
      };
      const categoryId = categoryMap[categoryFilter];
      if (categoryId) {
        filtered = filtered.filter(product => product.category_id === categoryId);
      }
    }

    filtered = filtered.filter(product => {
      const price = showStudentPrice ? product.student_price : product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = showStudentPrice ? a.student_price : a.price;
          const priceB = showStudentPrice ? b.student_price : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = showStudentPrice ? a.student_price : a.price;
          const priceB = showStudentPrice ? b.student_price : b.price;
          return priceB - priceA;
        });
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'discount':
        filtered.sort((a, b) => {
          const discountA = ((a.price - a.student_price) / a.price) * 100;
          const discountB = ((b.price - b.student_price) / b.price) * 100;
          return discountB - discountA;
        });
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const calculateDiscount = (regular, student) => {
    return Math.round(((regular - student) / regular) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          {searchQuery ? (
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">
                Search Results for "{searchQuery}"
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
            </div>
          ) : categoryFilter !== 'all' ? (
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-2 capitalize">
                {categoryFilter.replace('-', ' & ')}
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">
                All Products
              </h1>
              <p className="text-gray-600">
                Discover {filteredProducts.length} amazing products
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-wrap items-center gap-6 justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowStudentPrice(!showStudentPrice)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                  showStudentPrice ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${
                    showStudentPrice ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
              <div>
                <p className="text-sm font-bold text-gray-900">Student Pricing</p>
                <p className="text-xs text-gray-500">Save up to 30%</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">Price:</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-20 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2 font-medium"
                  placeholder="Min"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-20 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2 font-medium"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
              >
                <Link to={`/products/${product.id}`}>
                  <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Product+Image';
                      }}
                    />
                    {showStudentPrice && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        {calculateDiscount(product.price, product.student_price)}% OFF
                      </div>
                    )}
                    {product.stock < 20 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        Only {product.stock} left
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-5">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-1 mb-4 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="line-clamp-1">{product.specs}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    {showStudentPrice ? (
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-blue-600">
                            ${product.student_price.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-green-600 font-semibold">
                          Student price
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-2xl font-black text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                        <p className="text-xs text-gray-500 font-medium">
                          ${product.student_price.toFixed(2)} with student discount
                        </p>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}