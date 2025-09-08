export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'consumer';
  location: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  location: string;
  image: string;
  farmerId: string;
  farmerName: string;
  rating: number;
  description?: string;
  category: string;
}

export interface Farmer {
  id: string;
  name: string;
  location: string;
  rating: number;
  image: string;
  crops: string[];
  experience: number;
  description: string;
  sponsored: boolean;
  sponsorshipAmount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface NGO {
  id: string;
  name: string;
  description: string;
  state: string;
  website?: string;
  contact: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
  language: string;
}

export interface PricePredictor {
  crop: string;
  currentPrice: number;
  predictedPrice: number;
  recommendation: 'sell' | 'hold' | 'wait';
  confidence: number;
  reasons: string[];
}

export interface MarketTrend {
  id: string;
  cropName: string;
  currentPrice: number;
  predictedPrice: number;
  priceChange: number;
  demandLevel: 'low' | 'medium' | 'high';
  supplyLevel: 'low' | 'medium' | 'high';
  recommendation: 'sell' | 'hold' | 'wait';
  confidence: number;
  factors: string[];
  date: string;
  historicalData?: {
    date: string;
    price: number;
  }[];
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  forecast: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedDate: string;
  category: 'technology' | 'policy' | 'market' | 'weather' | 'success-story';
  image: string;
  readTime: number;
  tags: string[];
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  orderDate: string;
  deliveryAddress: string;
  paymentMethod: string;
}

export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}