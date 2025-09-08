import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Product, CartItem, Farmer, NGO, MarketTrend, NewsArticle, Order } from '../types';

interface AppState {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  farmers: Farmer[];
  ngos: NGO[];
  marketTrends: MarketTrend[];
  newsArticles: NewsArticle[];
  orders: Order[];
  isDarkMode: boolean;
  currentLanguage: string;
  isChatOpen: boolean;
  showCheckout: boolean;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'SPONSOR_FARMER'; payload: string }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'TOGGLE_CHAT' }
  | { type: 'TOGGLE_CHECKOUT' }
  | { type: 'SET_FARMERS'; payload: Farmer[] }
  | { type: 'SET_NGOS'; payload: NGO[] }
  | { type: 'SET_MARKET_TRENDS'; payload: MarketTrend[] }
  | { type: 'SET_NEWS_ARTICLES'; payload: NewsArticle[] };

const initialState: AppState = {
  user: null,
  products: [],
  cart: [],
  farmers: [],
  ngos: [],
  marketTrends: [],
  newsArticles: [],
  orders: [],
  isDarkMode: false,
  currentLanguage: 'en',
  isChatOpen: false,
  showCheckout: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return { ...state, cart: [...state.cart, { product: action.payload, quantity: 1 }] };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.product.id !== action.payload) };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload], cart: [] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        )
      };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'SPONSOR_FARMER':
      return {
        ...state,
        farmers: state.farmers.map(farmer =>
          farmer.id === action.payload ? { ...farmer, sponsored: true } : farmer
        )
      };
    case 'TOGGLE_DARK_MODE':
      return { ...state, isDarkMode: !state.isDarkMode };
    case 'SET_LANGUAGE':
      return { ...state, currentLanguage: action.payload };
    case 'TOGGLE_CHAT':
      return { ...state, isChatOpen: !state.isChatOpen };
    case 'TOGGLE_CHECKOUT':
      return { ...state, showCheckout: !state.showCheckout };
    case 'SET_FARMERS':
      return { ...state, farmers: action.payload };
    case 'SET_NGOS':
      return { ...state, ngos: action.payload };
    case 'SET_MARKET_TRENDS':
      return { ...state, marketTrends: action.payload };
    case 'SET_NEWS_ARTICLES':
      return { ...state, newsArticles: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}