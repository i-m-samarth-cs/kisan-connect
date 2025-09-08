import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Star, MapPin, Award, Heart } from 'lucide-react';

const AdoptAFarm = () => {
  const { state } = useApp();
  const { dispatch } = useApp();

  const handleSponsorFarm = (farmerId: string) => {
    if (!state.user) {
      // Show login prompt
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-yellow-600 text-white px-6 py-4 rounded-lg shadow-lg z-50';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span class="text-yellow-600 text-sm">!</span>
          </div>
          <div class="font-semibold">Please login to sponsor a farm</div>
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
      return;
    }
    dispatch({ type: 'SPONSOR_FARMER', payload: farmerId });
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <span class="text-green-600 text-sm">✓</span>
        </div>
        <div>
          <div class="font-semibold">Farm Sponsored!</div>
          <div class="text-sm opacity-90">Thank you for supporting sustainable farming</div>
        </div>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  return (
    <div className={`min-h-screen ${state.isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${
            state.isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Adopt a Farm
          </h1>
          <p className={`text-lg max-w-3xl mx-auto ${
            state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Support local farmers by adopting their farms. Your monthly subscription helps them maintain sustainable farming practices and ensures a steady income regardless of market fluctuations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {state.farmers.map((farmer) => (
            <div
              key={farmer.id}
              className={`rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                state.isDarkMode ? 'bg-gray-800' : 'bg-white'
              } ${farmer.sponsored ? 'ring-2 ring-green-500' : ''}`}
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={farmer.image}
                  alt={farmer.name}
                  className="w-full h-full object-cover"
                />
                {farmer.sponsored && (
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Sponsored
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-2 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {farmer.name}
                </h3>
                
                <div className="flex items-center mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className={`ml-1 text-sm ${
                    state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {farmer.location}
                  </span>
                </div>
                
                <div className="flex items-center mb-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className={`ml-1 text-sm ${
                    state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {farmer.rating} rating
                  </span>
                  <div className="flex items-center ml-4">
                    <Award className="w-4 h-4 text-blue-500" />
                    <span className={`ml-1 text-sm ${
                      state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {farmer.experience} years exp.
                    </span>
                  </div>
                </div>
                
                <p className={`text-sm mb-4 ${
                  state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {farmer.description}
                </p>
                
                <div className="mb-4">
                  <p className={`text-sm font-medium mb-2 ${
                    state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Specializes in:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {farmer.crops.map((crop, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${
                      state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Monthly Support
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      ₹{farmer.sponsorshipAmount.toLocaleString()}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleSponsorFarm(farmer.id)}
                    disabled={farmer.sponsored}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      farmer.sponsored
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${farmer.sponsored ? 'fill-current' : ''}`} />
                    <span>{farmer.sponsored ? 'Sponsored' : 'Sponsor'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* How it Works Section */}
        <div className={`mt-16 rounded-lg p-8 ${
          state.isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className={`text-2xl font-bold mb-6 text-center ${
            state.isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            How Farm Adoption Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Choose a Farmer
              </h3>
              <p className={`text-sm ${
                state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Browse through farmer profiles and select one that resonates with you
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Monthly Support
              </h3>
              <p className={`text-sm ${
                state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Provide monthly financial support to help them maintain their farm
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Get Updates
              </h3>
              <p className={`text-sm ${
                state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Receive regular updates about your adopted farm and exclusive produce
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdoptAFarm;