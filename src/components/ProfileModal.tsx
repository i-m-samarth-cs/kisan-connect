import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { X, User, Mail, MapPin, Phone, Camera, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: state.user?.name || '',
    email: state.user?.email || '',
    location: state.user?.location || '',
    phone: state.user?.phone || '',
    avatar_url: state.user?.avatar || ''
  });

  const handleSave = async () => {
    if (!state.user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          location: profileData.location,
          phone: profileData.phone,
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', state.user.id);

      if (error) throw error;

      // Update local state
      dispatch({
        type: 'SET_USER',
        payload: {
          ...state.user,
          name: profileData.name,
          location: profileData.location,
          phone: profileData.phone,
          avatar: profileData.avatar_url
        }
      });

      setIsEditing(false);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span class="text-green-600 text-sm">✓</span>
          </div>
          <div class="font-semibold">Profile updated successfully!</div>
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);

    } catch (error) {
      console.error('Profile update error:', error);
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg z-50';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span class="text-red-600 text-sm">✕</span>
          </div>
          <div class="font-semibold">Failed to update profile</div>
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

  if (!isOpen || !state.user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg p-6 w-full max-w-md ${
        state.isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${
            state.isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Profile
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
              state.isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profileData.avatar_url ? (
                  <img
                    src={profileData.avatar_url}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  profileData.name.charAt(0).toUpperCase()
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors">
                  <Camera size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Role Badge */}
          <div className="text-center">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              state.user.role === 'farmer'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {state.user.role === 'farmer' ? '🌾 Farmer' : '🛒 Consumer'}
            </span>
          </div>

          {/* Profile Fields */}
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <User size={16} className="inline mr-2" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              ) : (
                <p className={`px-3 py-2 ${
                  state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {profileData.name}
                </p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Mail size={16} className="inline mr-2" />
                Email
              </label>
              <p className={`px-3 py-2 ${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {profileData.email} (Cannot be changed)
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <MapPin size={16} className="inline mr-2" />
                Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              ) : (
                <p className={`px-3 py-2 ${
                  state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {profileData.location}
                </p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Phone size={16} className="inline mr-2" />
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              ) : (
                <p className={`px-3 py-2 ${
                  state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {profileData.phone || 'Not provided'}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setProfileData({
                      name: state.user?.name || '',
                      email: state.user?.email || '',
                      location: state.user?.location || '',
                      phone: state.user?.phone || '',
                      avatar_url: state.user?.avatar || ''
                    });
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                    state.isDarkMode
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;