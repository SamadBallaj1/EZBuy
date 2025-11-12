// src/pages/Home.jsx
import HeroBanner from "../components/HeroBanner";
import CategoryNav from "../components/CategoryNav";
import ProductCard from "../components/ProductCard";
import { getTrendingProducts, getBestSellers } from "../services/productService";

const Home = () => {
  const trending = getTrendingProducts();
  const bestSellers = getBestSellers();

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroBanner />
      <CategoryNav />

      {/* Trending Products */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Trending Products</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
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
