import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useTranslation } from './TranslationProvider';
import { addProduct, getFarmerProducts, getFarmerOrders } from '../lib/supabase';
import { Plus, TrendingUp, Package, BarChart3, Activity, Upload } from 'lucide-react';
import { Product } from '../types';

const FarmerDashboard = () => {
  const { state, dispatch } = useApp();
  const { translate } = useTranslation();
  const [activeTab, setActiveTab] = useState('add-crop');
  const [farmerProducts, setFarmerProducts] = useState<Product[]>([]);
  const [farmerOrders, setFarmerOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cropForm, setCropForm] = useState({
    name: '',
    quantity: '',
    price: '',
    location: '',
    unit: 'kg',
    description: '',
    category: 'Vegetables'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (state.user?.role === 'farmer') {
      loadFarmerData();
    }
  }, [state.user]);

  const loadFarmerData = async () => {
    if (!state.user) return;
    
    try {
      const [products, orders] = await Promise.all([
        getFarmerProducts(state.user.id),
        getFarmerOrders(state.user.id)
      ]);
      
      setFarmerProducts(products);
      setFarmerOrders(orders);
    } catch (error) {
      console.error('Error loading farmer data:', error);
    }
  };

  const handleCropSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.user) {
      alert('Please log in to add products');
      return;
    }
    
    setIsLoading(true);
    
    const newProduct = {
      name: cropForm.name,
      price: parseFloat(cropForm.price),
      unit: cropForm.unit,
      quantity: parseInt(cropForm.quantity),
      location: cropForm.location,
      image: imagePreview || 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=400',
      farmer_id: state.user.id,
      farmer_name: state.user.name,
      rating: 4.5,
      description: cropForm.description,
      category: cropForm.category
    };

    try {
      const addedProduct = await addProduct(newProduct);
      
      // Add to local state
      dispatch({ type: 'ADD_PRODUCT', payload: {
        id: addedProduct.id,
        name: addedProduct.name,
        price: addedProduct.price,
        unit: addedProduct.unit,
        quantity: addedProduct.quantity,
        location: addedProduct.location,
        image: addedProduct.image,
        farmerId: addedProduct.farmer_id,
        farmerName: addedProduct.farmer_name,
        rating: addedProduct.rating,
        description: addedProduct.description,
        category: addedProduct.category
      }});
      
      // Reload farmer products
      await loadFarmerData();
    
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span class="text-green-600 text-sm">✓</span>
          </div>
          <div>
            <div class="font-semibold">Product Added Successfully!</div>
            <div class="text-sm opacity-90">${cropForm.name} is now available for sale</div>
          </div>
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);

      // Reset form
      setCropForm({
        name: '',
        quantity: '',
        price: '',
        location: '',
        unit: 'kg',
        description: '',
        category: 'Vegetables'
      });
      setImageFile(null);
      setImagePreview('');
      
    } catch (error) {
      console.error('Error adding product:', error);
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg z-50';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span class="text-red-600 text-sm">✕</span>
          </div>
          <div class="font-semibold">Failed to add product. Please try again.</div>
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCropForm({
      ...cropForm,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'add-crop', label: translate('Add New Crop'), icon: Plus },
    { id: 'manage-listings', label: translate('Manage Listings'), icon: Package },
    { id: 'price-prediction', label: translate('Quick Price Check'), icon: TrendingUp },
    { id: 'order-management', label: translate('Order Management'), icon: BarChart3 },
    { id: 'ai-crop-health', label: translate('AI Crop Health Analysis'), icon: Activity }
  ];

  const pricePredictor = {
    crop: 'Tomato',
    currentPrice: 60,
    predictedPrice: 75,
    recommendation: 'wait' as const,
    confidence: 85,
    reasons: [
      'Seasonal demand increase expected in next 2 weeks',
      'Weather conditions favorable for higher prices',
      'Low supply reported in nearby markets'
    ]
  };

  return (
    <div className={`min-h-screen ${state.isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            state.isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {translate('Farmer Dashboard')}
          </h1>
          <p className={`text-lg ${
            state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {translate('Manage your crops and connect with buyers')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap mb-8 space-x-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors mb-2 ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white'
                    : state.isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className={`rounded-lg p-6 ${
          state.isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {activeTab === 'add-crop' && (
            <div>
              <h2 className={`text-2xl font-bold mb-6 text-center ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Add New Crop Listing
              </h2>
              
              <form onSubmit={handleCropSubmit} className="max-w-2xl mx-auto space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Crop Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={cropForm.name}
                    onChange={handleInputChange}
                    placeholder="Enter crop name"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      state.isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Category
                  </label>
                  <select
                    name="category"
                    value={cropForm.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      state.isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Dairy">Dairy</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={cropForm.quantity}
                      onChange={handleInputChange}
                      placeholder="Enter quantity"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        state.isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Unit
                    </label>
                    <select
                      name="unit"
                      value={cropForm.unit}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        state.isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="kg">Kilogram (kg)</option>
                      <option value="g">Gram (g)</option>
                      <option value="quintal">Quintal</option>
                      <option value="ton">Ton</option>
                      <option value="dozen">Dozen</option>
                      <option value="piece">Piece</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Price (₹ per {cropForm.unit})
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={cropForm.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      state.isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={cropForm.location}
                    onChange={handleInputChange}
                    placeholder="Enter your location"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      state.isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={cropForm.description}
                    onChange={(e) => setCropForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your product (quality, farming methods, etc.)"
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      state.isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Upload Image
                  </label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        state.isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    {imagePreview && (
                      <div className="mt-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding Product...
                    </>
                  ) : (
                    translate('Add Crop')
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'manage-listings' && (
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {translate('Manage Your Listings')}
              </h2>
              
              {farmerProducts.length === 0 ? (
                <p className={`text-center py-12 ${
                  state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {translate("You haven't added any products yet. Click 'Add New Crop' to get started.")}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {farmerProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`rounded-lg overflow-hidden shadow-lg ${
                        state.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className={`font-semibold text-lg mb-2 ${
                          state.isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {product.name}
                        </h3>
                        <p className={`text-sm mb-2 ${
                          state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {product.quantity} {product.unit} available
                        </p>
                        <p className="text-lg font-bold text-green-600 mb-3">
                          ₹{product.price} / {product.unit}
                        </p>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors">
                            {translate('Edit')}
                          </button>
                          <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm transition-colors">
                            {translate('Remove')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'price-prediction' && (
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Quick Price Check
              </h2>
              
              <div className="mb-6">
                <p className={`text-center mb-4 ${
                  state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Get instant price insights for your crops. For detailed market analysis and trends, 
                  <a href="#market-trends" className="text-green-600 hover:text-green-700 font-medium ml-1">
                    visit our Market Trends section
                  </a>
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <div className={`p-6 rounded-lg border-2 ${
                  pricePredictor.recommendation === 'sell' 
                    ? 'border-green-500 bg-green-50' 
                    : pricePredictor.recommendation === 'wait'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-red-500 bg-red-50'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {pricePredictor.crop}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      pricePredictor.recommendation === 'sell'
                        ? 'bg-green-600 text-white'
                        : pricePredictor.recommendation === 'wait'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}>
                      {pricePredictor.recommendation.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Current Price</p>
                      <p className="text-2xl font-bold text-gray-800">
                        ₹{pricePredictor.currentPrice}/kg
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Predicted Price</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{pricePredictor.predictedPrice}/kg
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Confidence: {pricePredictor.confidence}%
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${pricePredictor.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Reasons:</p>
                    <ul className="space-y-1">
                      {pricePredictor.reasons.map((reason, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-300">
                    <a 
                      href="#market-trends"
                      className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <TrendingUp size={16} />
                      <span>View Detailed Market Analysis</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}


          {activeTab === 'order-management' && (
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {translate('Order Management')}
              </h2>
              
              {farmerOrders.length === 0 ? (
                <p className={`text-center py-12 ${
                  state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {translate('No orders yet. Orders from customers will appear here.')}
                </p>
              ) : (
                <div className="space-y-4">
                  {farmerOrders.map((order) => (
                    <div
                      key={order.id}
                      className={`p-6 rounded-lg border ${
                        state.isDarkMode
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className={`font-semibold text-lg ${
                            state.isDarkMode ? 'text-white' : 'text-gray-800'
                          }`}>
                            {translate('Order')} #{order.id}
                          </h3>
                          <p className={`text-sm ${
                            state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between">
                            <span className={state.isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                              {item.name} × {item.quantity}
                            </span>
                            <span className={state.isDarkMode ? 'text-white' : 'text-gray-800'}>
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t">
                        <span className={`font-semibold ${
                          state.isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {translate('Total')}: ₹{order.total}
                        </span>
                        <div className="space-x-2">
                          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors">
                            {translate('Accept')}
                          </button>
                          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors">
                            {translate('Decline')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai-crop-health' && (
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                AI Crop Health Analysis
              </h2>
              
              <div className="max-w-2xl mx-auto">
                <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  state.isDarkMode
                    ? 'border-gray-600 bg-gray-700'
                    : 'border-gray-300 bg-gray-50'
                }`}>
                  <Upload size={48} className={`mx-auto mb-4 ${
                    state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <h3 className={`text-lg font-semibold mb-2 ${
                    state.isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    Upload Crop Images
                  </h3>
                  <p className={`mb-4 ${
                    state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Upload images of your crops for AI-powered health analysis and disease detection
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="crop-images"
                  />
                  <label
                    htmlFor="crop-images"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors inline-block"
                  >
                    Choose Images
                  </label>
                </div>
                
                <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">AI Analysis Features:</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Disease detection and identification</li>
                    <li>• Pest infestation analysis</li>
                    <li>• Nutrient deficiency assessment</li>
                    <li>• Growth stage monitoring</li>
                    <li>• Treatment recommendations</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;