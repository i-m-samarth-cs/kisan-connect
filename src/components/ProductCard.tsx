import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Star, MapPin, ShoppingCart, Heart, Eye, User } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showAddToCart = true }) => {
  const { state, dispatch } = useApp();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!state.user) {
      // Show login prompt
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = 'Please login to add items to cart';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
      return;
    }

    if (state.user.role !== 'consumer') {
      // Show role restriction message
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = 'Only consumers can add items to cart';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
      return;
    }

    dispatch({ type: 'ADD_TO_CART', payload: product });
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    notification.textContent = `${product.name} added to cart!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 2000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!state.user) {
      // Show login prompt
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = 'Please login to purchase items';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
      return;
    }

    if (state.user.role !== 'consumer') {
      // Show role restriction message
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = 'Only consumers can purchase items';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
      return;
    }

    dispatch({ type: 'ADD_TO_CART', payload: product });
    dispatch({ type: 'TOGGLE_CHECKOUT' });
  };

  return (
    <>
      <div
        className={`relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
          state.isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isFlipped ? 'scale-110' : 'scale-100'
            }`}
          />
          
          {/* Overlay on hover */}
          <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
            isFlipped ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickView(true);
                }}
                className="bg-white text-gray-800 p-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Eye size={20} />
              </button>
              <button
                onClick={handleAddToCart}
                className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors"
              >
                <ShoppingCart size={20} />
              </button>
              <button className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors">
                <Heart size={20} />
              </button>
            </div>
          </div>

          {/* Quality Badge */}
          <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            Fresh
          </div>

          {/* Discount Badge */}
          {Math.random() > 0.7 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              -15%
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className={`font-semibold text-lg mb-2 ${
            state.isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {product.name}
          </h3>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className={`ml-2 text-sm ${
              state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              ({product.rating})
            </span>
          </div>

          <div className="flex items-center mb-2">
            <User size={14} className="text-gray-500" />
            <span className={`ml-1 text-sm ${
              state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {product.farmerName}
            </span>
          </div>

          <div className="flex items-center mb-4">
            <MapPin size={14} className="text-gray-500" />
            <span className={`ml-1 text-sm ${
              state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {product.location}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-green-600">
                ₹{product.price}
              </span>
              <span className={`text-sm ml-1 ${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                / {product.unit}
              </span>
            </div>
            <span className={`text-sm ${
              state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {product.quantity} {product.unit} available
            </span>
          </div>

          {showAddToCart && (
            <div className="flex space-x-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <ShoppingCart size={16} />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Buy Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
            state.isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-bold ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {product.name}
              </h2>
              <button
                onClick={() => setShowQuickView(false)}
                className={`text-gray-500 hover:text-gray-700 text-2xl ${
                  state.isDarkMode ? 'hover:text-gray-300' : ''
                }`}
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              
              <div>
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`ml-2 ${
                    state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    ({product.rating})
                  </span>
                </div>

                <p className={`mb-4 ${
                  state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {product.description || 'Fresh, high-quality produce directly from the farm.'}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className={state.isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Farmer:
                    </span>
                    <span className={state.isDarkMode ? 'text-white' : 'text-gray-800'}>
                      {product.farmerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={state.isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Location:
                    </span>
                    <span className={state.isDarkMode ? 'text-white' : 'text-gray-800'}>
                      {product.location}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={state.isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Available:
                    </span>
                    <span className={state.isDarkMode ? 'text-white' : 'text-gray-800'}>
                      {product.quantity} {product.unit}
                    </span>
                  </div>
                </div>

                <div className="text-3xl font-bold text-green-600 mb-4">
                  ₹{product.price} / {product.unit}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart size={16} />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;