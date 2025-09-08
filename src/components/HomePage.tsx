import React from 'react';
import { useApp } from '../contexts/AppContext';
import ProductCard from './ProductCard';

const HomePage = () => {
  const { state, dispatch } = useApp();

  const popularProducts = state.products.slice(0, 6);

  const handleShopFreshProduce = () => {
    window.location.hash = 'consumer-dashboard';
  };

  const handleBecomeFarmerPartner = () => {
    window.location.hash = 'farmer-dashboard';
  };

  return (
    <div className={`min-h-screen ${state.isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-green-800/80 z-10"></div>
        
        {/* Background Image (placeholder for video) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/2382894/pexels-photo-2382894.jpeg?auto=compress&cs=tinysrgb&w=1200')"
          }}
        ></div>
        
        {/* Content */}
        <div className="relative z-20 text-center text-white px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Bharat Ke Kheton Se,
              <br />
              <span className="text-yellow-300">Seedha Aapke Ghar Tak!</span>
            </h1>
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              From India's Fields, Directly to Your Home!
            </p>
            <p className="text-lg md:text-xl mb-8 opacity-80">
              Connect with local farmers and get fresh, organic produce delivered to your doorstep
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={handleShopFreshProduce}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 transform hover:scale-105"
              >
                Shop Fresh Produce
              </button>
              <button 
                onClick={handleBecomeFarmerPartner}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
              >
                Become a Farmer Partner
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              state.isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Shop our most popular items
            </h2>
            <p className={`text-lg ${
              state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Fresh, organic produce from local farmers across India
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={handleShopFreshProduce}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-300"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 ${
        state.isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              state.isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Why Choose KisanConnect?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🌱</span>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Fresh & Organic
              </h3>
              <p className={`${
                state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Direct from farmers, ensuring maximum freshness and quality
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🤝</span>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Support Farmers
              </h3>
              <p className={`${
                state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Direct connection between farmers and consumers for fair pricing
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🚚</span>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Fast Delivery
              </h3>
              <p className={`${
                state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Quick and reliable delivery to your doorstep
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;