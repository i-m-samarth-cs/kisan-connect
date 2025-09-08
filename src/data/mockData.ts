import { Product, Farmer, NGO } from '../types';
import { MarketTrend, NewsArticle } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Strawberry',
    price: 170,
    unit: 'kg',
    quantity: 50,
    location: 'Maharashtra, India',
    image: 'https://images.pexels.com/photos/89778/strawberries-frisch-ripe-sweet-89778.jpeg?auto=compress&cs=tinysrgb&w=400',
    farmerId: '1',
    farmerName: 'Rajesh Kumar',
    rating: 4.8,
    description: 'Fresh, sweet strawberries grown organically',
    category: 'Fruits'
  },
  {
    id: '2',
    name: 'Radish',
    price: 75,
    unit: 'kg',
    quantity: 100,
    location: 'Punjab, India',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
    farmerId: '2',
    farmerName: 'Anita Desai',
    rating: 4.7,
    description: 'Crisp and fresh radishes',
    category: 'Vegetables'
  },
  {
    id: '3',
    name: 'Apple',
    price: 125,
    unit: 'kg',
    quantity: 75,
    location: 'Himachal Pradesh, India',
    image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=400',
    farmerId: '3',
    farmerName: 'Sanjay Patel',
    rating: 4.9,
    description: 'Sweet and juicy apples from the hills',
    category: 'Fruits'
  },
  {
    id: '4',
    name: 'Carrot',
    price: 90,
    unit: 'kg',
    quantity: 120,
    location: 'Tamil Nadu, India',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
    farmerId: '4',
    farmerName: 'Lakshmi Rajan',
    rating: 4.6,
    description: 'Fresh and crunchy carrots',
    category: 'Vegetables'
  },
  {
    id: '5',
    name: 'Tomato',
    price: 60,
    unit: 'kg',
    quantity: 200,
    location: 'Karnataka, India',
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400',
    farmerId: '1',
    farmerName: 'Rajesh Kumar',
    rating: 4.5,
    description: 'Ripe and juicy tomatoes',
    category: 'Vegetables'
  },
  {
    id: '6',
    name: 'Banana',
    price: 45,
    unit: 'dozen',
    quantity: 150,
    location: 'Kerala, India',
    image: 'https://images.pexels.com/photos/2238309/pexels-photo-2238309.jpeg?auto=compress&cs=tinysrgb&w=400',
    farmerId: '2',
    farmerName: 'Anita Desai',
    rating: 4.7,
    description: 'Sweet and ripe bananas',
    category: 'Fruits'
  }
];

export const mockFarmers: Farmer[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    location: 'Punjab, India',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    crops: ['Wheat', 'Rice', 'Strawberry'],
    experience: 15,
    description: 'Organic farming specialist with 15 years of experience',
    sponsored: false,
    sponsorshipAmount: 5000
  },
  {
    id: '2',
    name: 'Anita Desai',
    location: 'Maharashtra, India',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
    crops: ['Radish', 'Carrot', 'Cabbage'],
    experience: 12,
    description: 'Sustainable farming practices advocate',
    sponsored: true,
    sponsorshipAmount: 3000
  },
  {
    id: '3',
    name: 'Sanjay Patel',
    location: 'Gujarat, India',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/2379006/pexels-photo-2379006.jpeg?auto=compress&cs=tinysrgb&w=400',
    crops: ['Apple', 'Pomegranate', 'Grapes'],
    experience: 20,
    description: 'Award-winning fruit farmer',
    sponsored: false,
    sponsorshipAmount: 7000
  },
  {
    id: '4',
    name: 'Lakshmi Rajan',
    location: 'Tamil Nadu, India',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/2379007/pexels-photo-2379007.jpeg?auto=compress&cs=tinysrgb&w=400',
    crops: ['Rice', 'Coconut', 'Banana'],
    experience: 18,
    description: 'Traditional farming methods with modern techniques',
    sponsored: false,
    sponsorshipAmount: 4500
  }
];

export const mockNGOs: NGO[] = [
  {
    id: '1',
    name: 'BAIF Development Research Foundation',
    description: 'Supporting rural development and sustainable agriculture',
    state: 'Maharashtra',
    website: 'https://baif.org.in',
    contact: '+91-20-25231661'
  },
  {
    id: '2',
    name: 'Dharamitra',
    description: 'Promoting organic farming and rural livelihood',
    state: 'Maharashtra',
    contact: '+91-7218-255404'
  },
  {
    id: '3',
    name: 'WOTR (Watershed Organisation Trust)',
    description: 'Watershed development and climate resilience',
    state: 'Maharashtra',
    website: 'https://wotr.org',
    contact: '+91-20-24393065'
  },
  {
    id: '4',
    name: 'Digital Green',
    description: 'Technology for agricultural extension',
    state: 'All India',
    website: 'https://digitalgreen.org',
    contact: '+91-80-67193200'
  },
  {
    id: '5',
    name: 'Action for Social Advancement (ASA)',
    description: 'Rural development and farmer empowerment',
    state: 'All India',
    contact: '+91-11-26854390'
  },
  {
    id: '6',
    name: 'PRADAN (Professional Assistance for Development Action)',
    description: 'Livelihood promotion and capacity building',
    state: 'All India',
    website: 'https://pradan.net',
    contact: '+91-11-26963951'
  }
];

export const mockMarketTrends: MarketTrend[] = [
  {
    id: '1',
    cropName: 'Tomato',
    currentPrice: 60,
    predictedPrice: 75,
    priceChange: 25,
    demandLevel: 'high',
    supplyLevel: 'medium',
    recommendation: 'sell',
    confidence: 85,
    factors: [
      'Seasonal demand increase expected in next 2 weeks',
      'Weather conditions favorable for higher prices',
      'Low supply reported in nearby markets',
      'Festival season approaching'
    ],
    date: new Date().toISOString(),
    historicalData: [
      { date: '2024-01-01', price: 45 },
      { date: '2024-01-02', price: 48 },
      { date: '2024-01-03', price: 52 },
      { date: '2024-01-04', price: 55 },
      { date: '2024-01-05', price: 58 },
      { date: '2024-01-06', price: 60 },
      { date: '2024-01-07', price: 62 }
    ]
  },
  {
    id: '2',
    cropName: 'Onion',
    currentPrice: 40,
    predictedPrice: 35,
    priceChange: -12.5,
    demandLevel: 'medium',
    supplyLevel: 'high',
    recommendation: 'hold',
    confidence: 72,
    factors: [
      'Oversupply in major markets',
      'Import restrictions lifted',
      'Storage costs increasing',
      'Better prices expected in 3-4 weeks'
    ],
    date: new Date().toISOString(),
    historicalData: [
      { date: '2024-01-01', price: 50 },
      { date: '2024-01-02', price: 48 },
      { date: '2024-01-03', price: 45 },
      { date: '2024-01-04', price: 43 },
      { date: '2024-01-05', price: 41 },
      { date: '2024-01-06', price: 40 },
      { date: '2024-01-07', price: 39 }
    ]
  },
  {
    id: '3',
    cropName: 'Potato',
    currentPrice: 25,
    predictedPrice: 30,
    priceChange: 20,
    demandLevel: 'high',
    supplyLevel: 'low',
    recommendation: 'wait',
    confidence: 78,
    factors: [
      'Cold storage stocks depleting',
      'Processing industry demand high',
      'Export opportunities emerging',
      'Price spike expected in 2 weeks'
    ],
    date: new Date().toISOString(),
    historicalData: [
      { date: '2024-01-01', price: 20 },
      { date: '2024-01-02', price: 21 },
      { date: '2024-01-03', price: 22 },
      { date: '2024-01-04', price: 23 },
      { date: '2024-01-05', price: 24 },
      { date: '2024-01-06', price: 25 },
      { date: '2024-01-07', price: 26 }
    ]
  },
  {
    id: '4',
    cropName: 'Rice',
    currentPrice: 45,
    predictedPrice: 48,
    priceChange: 6.7,
    demandLevel: 'medium',
    supplyLevel: 'medium',
    recommendation: 'sell',
    confidence: 68,
    factors: [
      'Government procurement active',
      'Export demand steady',
      'Monsoon forecast positive',
      'Stable market conditions'
    ],
    date: new Date().toISOString(),
    historicalData: [
      { date: '2024-01-01', price: 42 },
      { date: '2024-01-02', price: 43 },
      { date: '2024-01-03', price: 43 },
      { date: '2024-01-04', price: 44 },
      { date: '2024-01-05', price: 44 },
      { date: '2024-01-06', price: 45 },
      { date: '2024-01-07', price: 45 }
    ]
  },
  {
    id: '5',
    cropName: 'Wheat',
    currentPrice: 35,
    predictedPrice: 38,
    priceChange: 8.6,
    demandLevel: 'high',
    supplyLevel: 'medium',
    recommendation: 'sell',
    confidence: 82,
    factors: [
      'Flour mill demand increasing',
      'Export quotas available',
      'Quality premium for good grades',
      'Storage costs rising'
    ],
    date: new Date().toISOString(),
    historicalData: [
      { date: '2024-01-01', price: 32 },
      { date: '2024-01-02', price: 33 },
      { date: '2024-01-03', price: 33 },
      { date: '2024-01-04', price: 34 },
      { date: '2024-01-05', price: 34 },
      { date: '2024-01-06', price: 35 },
      { date: '2024-01-07', price: 36 }
    ]
  },
  {
    id: '6',
    cropName: 'Apple',
    currentPrice: 125,
    predictedPrice: 140,
    priceChange: 12,
    demandLevel: 'high',
    supplyLevel: 'low',
    recommendation: 'wait',
    confidence: 90,
    factors: [
      'Premium variety demand high',
      'Cold storage capacity limited',
      'Export orders pending',
      'Festival season premium expected'
    ],
    date: new Date().toISOString(),
    historicalData: [
      { date: '2024-01-01', price: 110 },
      { date: '2024-01-02', price: 115 },
      { date: '2024-01-03', price: 118 },
      { date: '2024-01-04', price: 120 },
      { date: '2024-01-05', price: 122 },
      { date: '2024-01-06', price: 125 },
      { date: '2024-01-07', price: 128 }
    ]
  }
];

export const mockNewsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Digital Revolution in Indian Agriculture: How Technology is Transforming Farming',
    summary: 'Explore how digital tools, AI, and IoT are revolutionizing traditional farming practices across India.',
    content: 'The agricultural sector in India is experiencing a digital transformation like never before. From precision farming using drones to AI-powered crop monitoring systems, technology is helping farmers increase productivity while reducing costs. Smart irrigation systems are saving water, while mobile apps are connecting farmers directly to markets, eliminating middlemen and ensuring better prices for their produce.',
    author: 'Dr. Rajesh Sharma',
    publishedDate: '2024-01-15',
    category: 'technology',
    image: 'https://images.pexels.com/photos/2382894/pexels-photo-2382894.jpeg?auto=compress&cs=tinysrgb&w=600',
    readTime: 5,
    tags: ['Digital Agriculture', 'AI', 'IoT', 'Precision Farming']
  },
  {
    id: '2',
    title: 'New Government Scheme Provides ₹50,000 Subsidy for Organic Farming',
    summary: 'The Ministry of Agriculture announces a new subsidy scheme to promote organic farming practices.',
    content: 'The Government of India has launched a comprehensive subsidy scheme offering up to ₹50,000 per hectare for farmers transitioning to organic farming. This initiative aims to promote sustainable agriculture practices, reduce chemical dependency, and improve soil health. Farmers can apply through their local agricultural offices or online portal.',
    author: 'Ministry of Agriculture',
    publishedDate: '2024-01-12',
    category: 'policy',
    image: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=600',
    readTime: 3,
    tags: ['Government Scheme', 'Organic Farming', 'Subsidy', 'Sustainable Agriculture']
  },
  {
    id: '3',
    title: 'Tomato Prices Surge 40% Due to Unseasonal Rains in Maharashtra',
    summary: 'Heavy rainfall in key growing regions has disrupted tomato supply, leading to significant price increases.',
    content: 'Tomato prices have increased by 40% in major markets following unseasonal rains in Maharashtra and Karnataka. The weather disruption has affected crop quality and reduced supply. Market experts suggest prices may remain elevated for the next 2-3 weeks until fresh supplies arrive from other regions.',
    author: 'Market Analysis Team',
    publishedDate: '2024-01-10',
    category: 'market',
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=600',
    readTime: 4,
    tags: ['Market Prices', 'Tomato', 'Weather Impact', 'Supply Chain']
  },
  {
    id: '4',
    title: 'Weather Alert: Monsoon Forecast Predicts Above-Normal Rainfall This Season',
    summary: 'IMD forecasts above-normal monsoon rainfall, which could benefit Kharif crops but may pose challenges.',
    content: 'The India Meteorological Department (IMD) has predicted above-normal monsoon rainfall for this season. While this is good news for Kharif crops like rice, sugarcane, and cotton, farmers are advised to prepare for potential flooding in low-lying areas. Proper drainage systems and crop insurance are recommended.',
    author: 'Weather Bureau',
    publishedDate: '2024-01-08',
    category: 'weather',
    image: 'https://images.pexels.com/photos/1463917/pexels-photo-1463917.jpeg?auto=compress&cs=tinysrgb&w=600',
    readTime: 3,
    tags: ['Monsoon', 'Weather Forecast', 'Kharif Crops', 'Farming Tips']
  },
  {
    id: '5',
    title: 'Success Story: Punjab Farmer Doubles Income Through Direct Marketing',
    summary: 'Meet Gurpreet Singh, who transformed his farming business by selling directly to consumers.',
    content: 'Gurpreet Singh from Punjab has doubled his farming income by bypassing traditional middlemen and selling directly to consumers through online platforms. By focusing on organic vegetables and building a brand around quality, he now supplies to over 500 families in nearby cities. His success story demonstrates the power of direct marketing in agriculture.',
    author: 'Success Stories Team',
    publishedDate: '2024-01-05',
    category: 'success-story',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
    readTime: 6,
    tags: ['Success Story', 'Direct Marketing', 'Organic Farming', 'Income Growth']
  },
  {
    id: '6',
    title: 'Drone Technology Reduces Pesticide Use by 30% in Karnataka Farms',
    summary: 'Precision spraying using drones is helping farmers reduce chemical usage while maintaining crop health.',
    content: 'Farmers in Karnataka are adopting drone technology for precision pesticide spraying, resulting in a 30% reduction in chemical usage. The technology allows for targeted application, reducing environmental impact and costs. The state government is providing subsidies for drone purchases under the Digital Agriculture Mission.',
    author: 'Technology Reporter',
    publishedDate: '2024-01-03',
    category: 'technology',
    image: 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=600',
    readTime: 4,
    tags: ['Drone Technology', 'Precision Agriculture', 'Pesticide Reduction', 'Karnataka']
  }
];