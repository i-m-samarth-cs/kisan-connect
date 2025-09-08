import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useTranslation } from './TranslationProvider';
import { signOut } from '../lib/supabase';
import { 
  Sun, 
  Moon, 
  Globe, 
  ShoppingCart, 
  User, 
  LogOut,
  Menu,
  X,
  Settings
} from 'lucide-react';
import ProfileModal from './ProfileModal';

interface HeaderProps {
  onShowAuth: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowAuth }) => {
  const { state, dispatch } = useApp();
  const { translate, setLanguage, currentLanguage, isTranslating } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'CLEAR_CART' });
      
      // Show logout notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg z-50';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span class="text-blue-600 text-sm">✓</span>
          </div>
          <div class="font-semibold">${translate('Logged out successfully!')}</div>
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const cartItemCount = state.cart.reduce((total, item) => total + item.quantity, 0);

  const handleLanguageChange = async (langCode: string) => {
    setIsLanguageOpen(false);
    await setLanguage(langCode);
    dispatch({ type: 'SET_LANGUAGE', payload: langCode });
  };

  // Role-based navigation items
  const getNavigationItems = () => {
    const commonItems = [
      { href: '#home', label: translate('Home') },
      { href: '#market-trends', label: translate('Market Trends') },
      { href: '#news', label: translate('Farmer News') },
      { href: '#adopt-farm', label: translate('Adopt a Farm') },
      { href: '#ngo-support', label: translate('NGO Support') }
    ];

    if (state.user?.role === 'farmer') {
      return [
        ...commonItems.slice(0, 1), // Home
        { href: '#farmer-dashboard', label: translate('Farmer Dashboard') },
        ...commonItems.slice(1) // Rest of items
      ];
    } else if (state.user?.role === 'consumer') {
      return [
        ...commonItems.slice(0, 1), // Home
        { href: '#consumer-dashboard', label: translate('Consumer Dashboard') },
        ...commonItems.slice(1) // Rest of items
      ];
    }

    return commonItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      <header className={`sticky top-0 z-50 ${
        state.isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-md transition-colors duration-300`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className={`text-xl font-bold ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {translate('KisanConnect')}
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <a 
                  key={item.href}
                  href={item.href} 
                  className={`hover:text-green-600 transition-colors ${
                    state.isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  disabled={isTranslating}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                    state.isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700'
                  } ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Globe size={16} />
                  <span className="text-sm hidden sm:inline">
                    {isTranslating ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      <>
                        {languages.find(lang => lang.code === currentLanguage)?.flag}
                        <span className="ml-1">
                          {languages.find(lang => lang.code === currentLanguage)?.name}
                        </span>
                      </>
                    )}
                  </span>
                </button>
                {isLanguageOpen && !isTranslating && (
                  <div className={`absolute top-full right-0 mt-2 w-48 rounded-md shadow-lg ${
                    state.isDarkMode ? 'bg-gray-800' : 'bg-white'
                  } border border-gray-200 z-50`}>
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                          state.isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700'
                        } ${currentLanguage === lang.code ? 'bg-green-50 text-green-600' : ''}`}
                      >
                        <span className="mr-2">{lang.flag}</span>
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
                className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
                  state.isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700'
                }`}
              >
                {state.isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Cart (for consumers only) */}
              {state.user?.role === 'consumer' && (
                <button 
                  onClick={() => dispatch({ type: 'TOGGLE_CHECKOUT' })}
                  className="relative p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <ShoppingCart size={20} className={state.isDarkMode ? 'text-gray-200' : 'text-gray-700'} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              )}

              {/* User Menu */}
              {state.user ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {state.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:block">
                      <span className={`text-sm font-medium ${state.isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {state.user.name}
                      </span>
                      <div className={`text-xs ${state.isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {state.user.role === 'farmer' ? '🌾 ' + translate('Farmer') : '🛒 ' + translate('Consumer')}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowProfile(true)}
                    className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
                      state.isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700'
                    }`}
                    title={translate('Profile')}
                  >
                    <Settings size={16} />
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
                      state.isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700'
                    }`}
                    title={translate('Logout')}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={onShowAuth}
                    className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  >
                    {translate('Log In')}
                  </button>
                  <button 
                    onClick={onShowAuth}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    {translate('Sign Up')}
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors ${
                  state.isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700'
                }`}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <a 
                    key={item.href}
                    href={item.href} 
                    className={`py-2 hover:text-green-600 transition-colors ${
                      state.isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                {!state.user && (
                  <>
                    <button 
                      onClick={() => {
                        onShowAuth();
                        setIsMenuOpen(false);
                      }}
                      className="py-2 text-left text-green-600 hover:bg-green-50 transition-colors"
                    >
                      {translate('Log In')}
                    </button>
                    <button 
                      onClick={() => {
                        onShowAuth();
                        setIsMenuOpen(false);
                      }}
                      className="py-2 text-left bg-green-600 text-white hover:bg-green-700 transition-colors rounded-md px-4"
                    >
                      {translate('Sign Up')}
                    </button>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
};

export default Header;