import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { TranslationProvider } from './components/TranslationProvider';
import { supabase, getCurrentUser, getProducts, getMarketTrends, testConnection } from './lib/supabase';
import Header from './components/Header';
import HomePage from './components/HomePage';
import AuthModal from './components/AuthModal';
import FarmerDashboard from './components/FarmerDashboard';
import ConsumerDashboard from './components/ConsumerDashboard';
import AdoptAFarm from './components/AdoptAFarm';
import NGOSupport from './components/NGOSupport';
import ChatBot from './components/ChatBot';
import CheckoutModal from './components/CheckoutModal';
import MarketTrends from './components/MarketTrends';
import FarmerNews from './components/FarmerNews';
import { mockFarmers, mockNGOs, mockNewsArticles } from './data/mockData';

const AppContent = () => {
  const { state, dispatch } = useApp();
  const [currentPage, setCurrentPage] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
    // Test database connection and initialize app
    const initializeApp = async () => {
      try {
        // Test database connection
        const connected = await testConnection();
        setDbConnected(connected);
        
        if (connected) {
          console.log('✅ Database connected successfully');
          
          // Load real data from Supabase
          const [products, marketTrends] = await Promise.all([
            getProducts(),
            getMarketTrends()
          ]);
          
          dispatch({ type: 'SET_PRODUCTS', payload: products });
          dispatch({ type: 'SET_MARKET_TRENDS', payload: marketTrends });
        } else {
          console.log('⚠️ Database not connected, using mock data');
          // Fallback to mock data if database is not connected
          const { mockProducts, mockMarketTrends } = await import('./data/mockData');
          dispatch({ type: 'SET_PRODUCTS', payload: mockProducts });
          dispatch({ type: 'SET_MARKET_TRENDS', payload: mockMarketTrends });
        }
        
        // Initialize other mock data
        dispatch({ type: 'SET_FARMERS', payload: mockFarmers });
        dispatch({ type: 'SET_NGOS', payload: mockNGOs });
        dispatch({ type: 'SET_NEWS_ARTICLES', payload: mockNewsArticles });
        
        // Check for existing user session
        const user = await getCurrentUser();
        if (user) {
          dispatch({ type: 'SET_USER', payload: user });
          console.log('✅ User session restored:', user.name, `(${user.role})`);
        }
        
      } catch (error) {
        console.error('❌ App initialization error:', error);
        // Fallback to mock data on error
        const { mockProducts, mockMarketTrends } = await import('./data/mockData');
        dispatch({ type: 'SET_PRODUCTS', payload: mockProducts });
        dispatch({ type: 'SET_MARKET_TRENDS', payload: mockMarketTrends });
        dispatch({ type: 'SET_FARMERS', payload: mockFarmers });
        dispatch({ type: 'SET_NGOS', payload: mockNGOs });
        dispatch({ type: 'SET_NEWS_ARTICLES', payload: mockNewsArticles });
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeApp();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          const user = await getCurrentUser();
          if (user) {
            dispatch({ type: 'SET_USER', payload: user });
            console.log('✅ User signed in:', user.name, `(${user.role})`);
          }
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: 'SET_USER', payload: null });
          dispatch({ type: 'CLEAR_CART' });
          console.log('✅ User signed out');
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    // Hash-based routing
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setCurrentPage(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // Apply dark mode class to body
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  const renderCurrentPage = () => {
    // Check authentication for protected routes
    if (!state.user && (currentPage === 'farmer-dashboard' || currentPage === 'consumer-dashboard')) {
      setShowAuthModal(true);
      return <HomePage />;
    }

    // Check role-based access
    if (state.user) {
      if (currentPage === 'farmer-dashboard' && state.user.role !== 'farmer') {
        return (
          <div className={`min-h-screen flex items-center justify-center ${
            state.isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <div className="text-center">
              <h2 className={`text-2xl font-bold mb-4 ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Access Denied
              </h2>
              <p className={`mb-4 ${
                state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Only farmers can access the Farmer Dashboard.
              </p>
              <button
                onClick={() => window.location.hash = 'home'}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        );
      }
      
      if (currentPage === 'consumer-dashboard' && state.user.role !== 'consumer') {
        return (
          <div className={`min-h-screen flex items-center justify-center ${
            state.isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <div className="text-center">
              <h2 className={`text-2xl font-bold mb-4 ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Access Denied
              </h2>
              <p className={`mb-4 ${
                state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Only consumers can access the Consumer Dashboard.
              </p>
              <button
                onClick={() => window.location.hash = 'home'}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        );
      }
    }

    switch (currentPage) {
      case 'farmer-dashboard':
        return <FarmerDashboard />;
      case 'consumer-dashboard':
        return <ConsumerDashboard />;
      case 'adopt-farm':
        return <AdoptAFarm />;
      case 'ngo-support':
        return <NGOSupport />;
      case 'market-trends':
        return <MarketTrends />;
      case 'news':
        return <FarmerNews />;
      default:
        return <HomePage />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading KisanConnect...</p>
          {!dbConnected && (
            <p className="text-sm text-yellow-600 mt-2">
              Database connection in progress...
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      state.isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Database Status Indicator */}
      {!dbConnected && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                Database not connected. Using demo data. Please configure Supabase connection.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <Header onShowAuth={() => setShowAuthModal(true)} />
      {renderCurrentPage()}
      <ChatBot />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <CheckoutModal />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <TranslationProvider>
        <AppContent />
      </TranslationProvider>
    </AppProvider>
  );
}

export default App;