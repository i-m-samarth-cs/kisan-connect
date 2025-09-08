import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useTranslation } from './TranslationProvider';
import { Search, Filter, ShoppingCart, Plus, Minus, Trash2, Eye } from 'lucide-react';
import ProductCard from './ProductCard';

const ConsumerDashboard = () => {
  const { state, dispatch } = useApp();
  const { translate } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showCart, setShowCart] = useState(false);

  const categories = ['all', 'Fruits', 'Vegetables', 'Grains', 'Dairy'];

  const filteredProducts = state.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleRemoveFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: productId, quantity } });
    }
  };

  const cartTotal = state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <div className={`min-h-screen ${state.isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            state.isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {translate('Consumer Dashboard')}
          </h1>
          <p className={`text-lg ${
            state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {translate('Discover fresh produce from local farmers')}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className={`rounded-lg p-6 mb-8 ${
          state.isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={translate('Search for products...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  state.isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Category Filter */}
            <div className="min-w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  state.isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? translate('All Categories') : translate(category)}
                  </option>
                ))}
              </select>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors relative"
            >
              <ShoppingCart size={20} />
              <span>{translate('Shopping Cart')}</span>
              {state.cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {state.cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>

          {/* Price Range Filter */}
          <div className="mt-4">
            <label className={`block text-sm font-medium mb-2 ${
              state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {translate('Price Range')}: ₹{priceRange.min} - ₹{priceRange.max}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className={`text-lg ${
                  state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {translate('No products found matching your criteria.')}
                </p>
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          {showCart && (
            <div className={`w-96 rounded-lg p-6 h-fit sticky top-24 ${
              state.isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-bold ${
                  state.isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {translate('Shopping Cart')}
                </h2>
                <button
                  onClick={() => setShowCart(false)}
                  className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${
                    state.isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500'
                  }`}
                >
                  <Eye size={16} />
                </button>
              </div>

              {state.cart.length === 0 ? (
                <p className={`text-center py-8 ${
                  state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {translate('Your cart is empty')}
                </p>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {state.cart.map((item) => (
                      <div key={item.product.id} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className={`font-medium text-sm ${
                            state.isDarkMode ? 'text-white' : 'text-gray-800'
                          }`}>
                            {item.product.name}
                          </h3>
                          <p className={`text-xs ${
                            state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            ₹{item.product.price} / {item.product.unit}
                          </p>
                          <p className={`text-xs font-medium ${
                            state.isDarkMode ? 'text-gray-200' : 'text-gray-700'
                          }`}>
                            {translate('Total')}: ₹{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className={`text-sm font-medium ${
                              state.isDarkMode ? 'text-white' : 'text-gray-800'
                            }`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                            <button
                              onClick={() => handleRemoveFromCart(item.product.id)}
                              className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                              title={translate('Remove')}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className={`font-semibold ${
                        state.isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {translate('Total')}:
                      </span>
                      <span className="text-xl font-bold text-green-600">
                        ₹{cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <button 
                      onClick={() => dispatch({ type: 'TOGGLE_CHECKOUT' })}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      {translate('Proceed to Checkout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;