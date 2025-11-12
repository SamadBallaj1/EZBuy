import { useState, useEffect } from "react";
import HeroBanner from "../components/HeroBanner";
import CategoryNav from "../components/CategoryNav";
import ProductCard from "../components/ProductCard";
import { getTrendingProducts, getBestSellers } from "../services/productService";

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [trendingData, bestSellersData] = await Promise.all([
          getTrendingProducts(),
          getBestSellers(),
        ]);
        setTrending(trendingData);
        setBestSellers(bestSellersData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroBanner />
      <CategoryNav />

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Trending Products</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Best Sellers</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;