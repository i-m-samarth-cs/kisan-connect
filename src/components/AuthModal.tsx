import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useTranslation } from './TranslationProvider';
import { X, User, Sprout, Eye, EyeOff } from 'lucide-react';
import { signUp, signIn } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useApp();
  const { translate } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'farmer' | 'consumer'>('consumer');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        // Sign in existing user
        console.log('🔄 Attempting sign in...', { email: formData.email });
        const { user } = await signIn(formData.email, formData.password);
        
        if (user) {
          // Get user profile from getCurrentUser function
          const { getCurrentUser } = await import('../lib/supabase');
          const profile = await getCurrentUser();
          
          if (profile) {
            dispatch({ 
              type: 'SET_USER', 
              payload: profile
            });
            
            showNotification(`${translate('Welcome back')}, ${profile.name}!`, 'success');
            onClose();
            resetForm();
          }
        }
      } else {
        // Sign up new user
        console.log('🔄 Attempting sign up...', { 
          email: formData.email, 
          role: userType,
          name: formData.name 
        });
        
        const userData = {
          email: formData.email,
          name: formData.name,
          role: userType,
          location: formData.location,
          phone: formData.phone
        };
        
        const { user } = await signUp(formData.email, formData.password, userData);
        
        if (user) {
          dispatch({ 
            type: 'SET_USER', 
            payload: {
              id: user.id,
              name: formData.name,
              email: formData.email,
              role: userType,
              location: formData.location,
              phone: formData.phone
            }
          });
          
          showNotification(`${translate('Welcome to KisanConnect')}, ${formData.name}!`, 'success');
          onClose();
          resetForm();
        }
      }
    } catch (error: any) {
      console.error('❌ Auth error:', error);
      let errorMessage = translate('Authentication failed. Please try again.');
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = translate('Invalid email or password. Please check your credentials.');
      } else if (error.message?.includes('User already registered')) {
        errorMessage = translate('This email is already registered. Please sign in instead.');
      } else if (error.message?.includes('Password should be at least 6 characters')) {
        errorMessage = translate('Password should be at least 6 characters long.');
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = translate('Please enter a valid email address.');
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    } text-white`;
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <span class="${type === 'success' ? 'text-green-600' : 'text-red-600'} text-sm">
            ${type === 'success' ? '✓' : '✕'}
          </span>
        </div>
        <div class="font-semibold">${message}</div>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 4000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      location: '',
      phone: ''
    });
    setError('');
    setShowPassword(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto ${
        state.isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${
            state.isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {isLogin ? translate('Sign In') : translate('Create Account')}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
              state.isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* User Type Selection - Only for Sign Up */}
        {!isLogin && (
          <div className="mb-6">
            <p className={`text-sm mb-3 ${
              state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {translate('I am a:')}
            </p>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setUserType('consumer')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md border-2 transition-colors ${
                  userType === 'consumer'
                    ? 'border-green-600 bg-green-50 text-green-600'
                    : state.isDarkMode
                    ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <User size={16} />
                <span>{translate('Consumer')}</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('farmer')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md border-2 transition-colors ${
                  userType === 'farmer'
                    ? 'border-green-600 bg-green-50 text-green-600'
                    : state.isDarkMode
                    ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <Sprout size={16} />
                <span>{translate('Farmer')}</span>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {translate('Full Name')} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  state.isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
                placeholder={translate('Enter your full name')}
              />
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {translate('Email Address')} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                state.isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
              placeholder={translate('Enter your email address')}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {translate('Password')} *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  state.isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
                minLength={6}
                placeholder={translate('Enter your password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {!isLogin && (
              <p className={`text-xs mt-1 ${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {translate('Password must be at least 6 characters long')}
              </p>
            )}
          </div>

          {!isLogin && (
            <>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {translate('Location')} *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder={translate('e.g., Mumbai, Maharashtra')}
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
                  {translate('Phone Number')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isLogin ? translate('Signing In...') : translate('Creating Account...')}
              </>
            ) : (
              isLogin ? translate('Sign In') : translate('Create Account')
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className={`text-sm ${
            state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {isLogin ? translate("Don't have an account?") : translate("Already have an account?")}
            <button
              onClick={toggleMode}
              className="ml-1 text-green-600 hover:text-green-700 font-medium"
            >
              {isLogin ? translate('Sign Up') : translate('Sign In')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;