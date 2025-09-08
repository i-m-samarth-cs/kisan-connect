import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { ExternalLink, Phone, Mail, MapPin } from 'lucide-react';

const NGOSupport = () => {
  const { state } = useApp();
  const [selectedState, setSelectedState] = useState('All India');
  const [showQuickApply, setShowQuickApply] = useState(false);

  const states = [
    'All India',
    'Maharashtra',
    'Punjab',
    'Gujarat',
    'Karnataka',
    'Tamil Nadu',
    'Uttar Pradesh',
    'Rajasthan',
    'Madhya Pradesh',
    'West Bengal'
  ];

  const filteredNGOs = state.ngos.filter(ngo => 
    selectedState === 'All India' || ngo.state === selectedState
  );

  const handleQuickApply = () => {
    setShowQuickApply(true);
  };

  return (
    <div className={`min-h-screen ${state.isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${
            state.isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            NGO Support Dashboard
          </h1>
          <p className={`text-lg max-w-3xl mx-auto ${
            state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Connect with NGOs that support farmers and sustainable agriculture
          </p>
        </div>

        {/* Quick Apply Section */}
        <div className={`rounded-lg p-8 mb-8 text-center ${
          state.isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 ${
            state.isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Quick Apply
          </h2>
          <p className={`text-lg mb-6 ${
            state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Apply to all participating NGOs with a single form
          </p>
          <button
            onClick={handleQuickApply}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Quick Apply
          </button>
        </div>

        {/* Custom Apply Section */}
        <div className={`rounded-lg p-8 ${
          state.isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className={`text-2xl font-bold mb-6 ${
            state.isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Custom Apply
          </h2>
          <p className={`text-lg mb-6 ${
            state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Choose specific NGOs to learn about and apply directly
          </p>

          {/* State Filter */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${
              state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Filter by State:
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                state.isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {states.map(state => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* NGO Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Maharashtra NGOs */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                NGOs in Maharashtra
              </h3>
              <div className="space-y-4">
                {filteredNGOs.filter(ngo => ngo.state === 'Maharashtra').map(ngo => (
                  <div
                    key={ngo.id}
                    className={`p-4 rounded-lg border ${
                      state.isDarkMode
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <h4 className={`font-semibold mb-2 ${
                      state.isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {ngo.name}
                    </h4>
                    <p className={`text-sm mb-3 ${
                      state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {ngo.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-green-600" />
                        <span className={state.isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {ngo.contact}
                        </span>
                      </div>
                      {ngo.website && (
                        <a
                          href={ngo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-green-600 hover:text-green-700"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          <span>Visit Website</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All India NGOs */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                NGOs working across India
              </h3>
              <div className="space-y-4">
                {filteredNGOs.filter(ngo => ngo.state === 'All India').map(ngo => (
                  <div
                    key={ngo.id}
                    className={`p-4 rounded-lg border ${
                      state.isDarkMode
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <h4 className={`font-semibold mb-2 ${
                      state.isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {ngo.name}
                    </h4>
                    <p className={`text-sm mb-3 ${
                      state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {ngo.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-green-600" />
                        <span className={state.isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {ngo.contact}
                        </span>
                      </div>
                      {ngo.website && (
                        <a
                          href={ngo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-green-600 hover:text-green-700"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          <span>Visit Website</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Apply Modal */}
        {showQuickApply && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-lg p-6 w-full max-w-md ${
              state.isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Quick Apply Form
              </h3>
              <p className={`text-sm mb-6 ${
                state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Fill out this form to apply to all participating NGOs at once.
              </p>
              
              <form className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
                    Email
                  </label>
                  <input
                    type="email"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
                    Farm Location
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      state.isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuickApply(false)}
                    className={`flex-1 border py-2 px-4 rounded-md transition-colors ${
                      state.isDarkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NGOSupport;