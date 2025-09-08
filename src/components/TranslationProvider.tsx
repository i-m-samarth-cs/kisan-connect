import React, { createContext, useContext, useState, useEffect } from 'react';

interface TranslationContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  translate: (text: string) => string;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Comprehensive translations for all UI elements
const translations: Record<string, Record<string, string>> = {
  hi: {
    // Header & Navigation
    'KisanConnect': 'किसान कनेक्ट',
    'Home': 'होम',
    'Market Trends': 'बाजार रुझान',
    'Farmer News': 'किसान समाचार',
    'Farmer Dashboard': 'किसान डैशबोर्ड',
    'Consumer Dashboard': 'उपभोक्ता डैशबोर्ड',
    'Adopt a Farm': 'एक फार्म अपनाएं',
    'NGO Support': 'एनजीओ सहायता',
    'Log In': 'लॉग इन',
    'Sign Up': 'साइन अप',
    'Profile': 'प्रोफ़ाइल',
    'Logout': 'लॉग आउट',
    
    // Home Page
    'Shop Fresh Produce': 'ताजा उत्पाद खरीदें',
    'Become a Farmer Partner': 'किसान पार्टनर बनें',
    'Fresh & Organic': 'ताजा और जैविक',
    'Support Farmers': 'किसानों का समर्थन करें',
    'Fast Delivery': 'तेज डिलीवरी',
    'Why Choose KisanConnect?': 'किसान कनेक्ट क्यों चुनें?',
    'Direct from farmers, ensuring maximum freshness and quality': 'किसानों से सीधे, अधिकतम ताजगी और गुणवत्ता सुनिश्चित करते हुए',
    'Direct connection between farmers and consumers for fair pricing': 'निष्पक्ष मूल्य निर्धारण के लिए किसानों और उपभोक्ताओं के बीच सीधा संपर्क',
    'Quick and reliable delivery to your doorstep': 'आपके दरवाजे तक त्वरित और विश्वसनीय डिलीवरी',
    
    // Product & Shopping
    'Add to Cart': 'कार्ट में जोड़ें',
    'Buy Now': 'अभी खरीदें',
    'Price': 'कीमत',
    'Quantity': 'मात्रा',
    'Location': 'स्थान',
    'Farmer': 'किसान',
    'Category': 'श्रेणी',
    'Description': 'विवरण',
    'Shopping Cart': 'शॉपिंग कार्ट',
    'Your cart is empty': 'आपका कार्ट खाली है',
    'Proceed to Checkout': 'चेकआउट पर जाएं',
    'Total': 'कुल',
    'Remove': 'हटाएं',
    
    // Farmer Dashboard
    'Add New Crop': 'नई फसल जोड़ें',
    'Manage Listings': 'लिस्टिंग प्रबंधित करें',
    'Quick Price Check': 'त्वरित मूल्य जांच',
    'Order Management': 'ऑर्डर प्रबंधन',
    'AI Crop Health Analysis': 'एआई फसल स्वास्थ्य विश्लेषण',
    'Add Crop': 'फसल जोड़ें',
    'Crop Name': 'फसल का नाम',
    'Unit': 'इकाई',
    'Upload Image': 'छवि अपलोड करें',
    'Edit': 'संपादित करें',
    
    // Market Trends
    'Market Trends & Analytics': 'बाजार रुझान और विश्लेषण',
    'Real-time market data and AI-powered insights to optimize your selling decisions': 'वास्तविक समय बाजार डेटा और एआई-संचालित अंतर्दृष्टि आपके बिक्री निर्णयों को अनुकूलित करने के लिए',
    'Current Price': 'वर्तमान मूल्य',
    'Predicted Price': 'अनुमानित मूल्य',
    'Price Change': 'मूल्य परिवर्तन',
    'Confidence': 'विश्वास',
    'Demand': 'मांग',
    'Supply': 'आपूर्ति',
    'Recommendation': 'सिफारिश',
    'SELL': 'बेचें',
    'HOLD': 'रोकें',
    'WAIT': 'प्रतीक्षा करें',
    
    // Authentication
    'Sign In': 'साइन इन',
    'Create Account': 'खाता बनाएं',
    'Full Name': 'पूरा नाम',
    'Email Address': 'ईमेल पता',
    'Password': 'पासवर्ड',
    'Phone Number': 'फोन नंबर',
    'I am a:': 'मैं हूं:',
    'Consumer': 'उपभोक्ता',
    'Already have an account?': 'पहले से खाता है?',
    "Don't have an account?": 'खाता नहीं है?',
    
    // Profile
    'Edit Profile': 'प्रोफ़ाइल संपादित करें',
    'Save Changes': 'परिवर्तन सहेजें',
    'Cancel': 'रद्द करें',
    
    // Orders & Checkout
    'Checkout': 'चेकआउट',
    'Order Summary': 'ऑर्डर सारांश',
    'Delivery Address': 'डिलीवरी पता',
    'Payment Details': 'भुगतान विवरण',
    'Cardholder Name': 'कार्डधारक का नाम',
    'Card Number': 'कार्ड नंबर',
    'Expiry Date': 'समाप्ति तिथि',
    'Subtotal': 'उप-योग',
    'Delivery Fee': 'डिलीवरी शुल्क',
    'Free': 'मुफ्त',
    'Back': 'वापस',
    'Continue to Delivery': 'डिलीवरी पर जारी रखें',
    'Continue to Payment': 'भुगतान पर जारी रखें',
    
    // Adopt a Farm
    'Support local farmers by adopting their farms': 'अपने खेतों को अपनाकर स्थानीय किसानों का समर्थन करें',
    'Monthly Support': 'मासिक सहायता',
    'Sponsor': 'प्रायोजक',
    'Sponsored': 'प्रायोजित',
    'How Farm Adoption Works': 'फार्म एडॉप्शन कैसे काम करता है',
    'Choose a Farmer': 'एक किसान चुनें',
    'Browse through farmer profiles and select one that resonates with you': 'किसान प्रोफाइल ब्राउज़ करें और एक का चयन करें जो आपके साथ मेल खाता हो',
    'Provide monthly financial support to help them maintain their farm': 'उनके खेत को बनाए रखने में मदद के लिए मासिक वित्तीय सहायता प्रदान करें',
    'Get Updates': 'अपडेट प्राप्त करें',
    'Receive regular updates about your adopted farm and exclusive produce': 'अपने दत्तक खेत और विशेष उत्पादन के बारे में नियमित अपडेट प्राप्त करें',
    
    // NGO Support
    'NGO Support Dashboard': 'एनजीओ सहायता डैशबोर्ड',
    'Connect with NGOs that support farmers and sustainable agriculture': 'एनजीओ से जुड़ें जो किसानों और टिकाऊ कृषि का समर्थन करते हैं',
    'Quick Apply': 'त्वरित आवेदन',
    'Apply to all participating NGOs with a single form': 'एक ही फॉर्म के साथ सभी भाग लेने वाले एनजीओ में आवेदन करें',
    'Custom Apply': 'कस्टम आवेदन',
    'Choose specific NGOs to learn about and apply directly': 'सीधे आवेदन करने और जानने के लिए विशिष्ट एनजीओ चुनें',
    'Filter by State': 'राज्य के अनुसार फ़िल्टर करें',
    'Visit Website': 'वेबसाइट पर जाएं',
    
    // News
    'Farmer News & Updates': 'किसान समाचार और अपडेट',
    'Stay updated with the latest news, policies, market trends, and success stories from the agricultural sector': 'कृषि क्षेत्र से नवीनतम समाचार, नीतियों, बाजार रुझान और सफलता की कहानियों के साथ अपडेट रहें',
    'Search news articles...': 'समाचार लेख खोजें...',
    'All News': 'सभी समाचार',
    'Technology': 'प्रौद्योगिकी',
    'Policy': 'नीति',
    'Market': 'बाजार',
    'Weather': 'मौसम',
    'Success Stories': 'सफलता की कहानियां',
    'Back to News': 'समाचार पर वापस',
    'min read': 'मिनट पढ़ें',
    
    // Common Actions
    'Search': 'खोजें',
    'Filter': 'फ़िल्टर',
    'View All': 'सभी देखें',
    'Load More': 'और लोड करें',
    'Save': 'सहेजें',
    'Delete': 'हटाएं',
    'Update': 'अपडेट',
    'Submit': 'जमा करें',
    'Close': 'बंद करें',
    'Open': 'खोलें',
    'Yes': 'हां',
    'No': 'नहीं',
    'OK': 'ठीक है',
    
    // Status & Messages
    'Loading...': 'लोड हो रहा है...',
    'Success': 'सफलता',
    'Error': 'त्रुटि',
    'Warning': 'चेतावनी',
    'Info': 'जानकारी',
    'Please wait...': 'कृपया प्रतीक्षा करें...',
    'No data available': 'कोई डेटा उपलब्ध नहीं',
    'Something went wrong': 'कुछ गलत हुआ',
    'Try again': 'पुनः प्रयास करें',
    
    // Units & Measurements
    'kg': 'किलो',
    'g': 'ग्राम',
    'quintal': 'क्विंटल',
    'ton': 'टन',
    'dozen': 'दर्जन',
    'piece': 'टुकड़ा',
    'Kilogram (kg)': 'किलोग्राम (किलो)',
    'Gram (g)': 'ग्राम (ग्राम)',
    'Quintal': 'क्विंटल',
    'Ton': 'टन',
    'Dozen': 'दर्जन',
    'Piece': 'टुकड़ा',
    
    // Categories
    'Vegetables': 'सब्जियां',
    'Fruits': 'फल',
    'Grains': 'अनाज',
    'Dairy': 'डेयरी',
    'All Categories': 'सभी श्रेणियां'
  },
  
  mr: {
    // Header & Navigation
    'KisanConnect': 'किसान कनेक्ट',
    'Home': 'मुख्यपृष्ठ',
    'Market Trends': 'बाजार प्रवृत्ती',
    'Farmer News': 'शेतकरी बातम्या',
    'Farmer Dashboard': 'शेतकरी डॅशबोर्ड',
    'Consumer Dashboard': 'ग्राहक डॅशबोर्ड',
    'Adopt a Farm': 'शेत दत्तक घ्या',
    'NGO Support': 'एनजीओ सहाय्य',
    'Log In': 'लॉग इन',
    'Sign Up': 'साइन अप',
    'Profile': 'प्रोफाइल',
    'Logout': 'लॉग आउट',
    
    // Home Page
    'Shop Fresh Produce': 'ताजे उत्पादन खरेदी करा',
    'Become a Farmer Partner': 'शेतकरी भागीदार व्हा',
    'Fresh & Organic': 'ताजे आणि सेंद्रिय',
    'Support Farmers': 'शेतकऱ्यांना पाठिंबा द्या',
    'Fast Delivery': 'जलद वितरण',
    'Why Choose KisanConnect?': 'किसान कनेक्ट का निवडावे?',
    
    // Product & Shopping
    'Add to Cart': 'कार्टमध्ये जोडा',
    'Buy Now': 'आता खरेदी करा',
    'Price': 'किंमत',
    'Quantity': 'प्रमाण',
    'Location': 'स्थान',
    'Farmer': 'शेतकरी',
    'Category': 'श्रेणी',
    'Description': 'वर्णन',
    'Shopping Cart': 'खरेदी कार्ट',
    'Your cart is empty': 'तुमची कार्ट रिकामी आहे',
    'Proceed to Checkout': 'चेकआउटला जा',
    'Total': 'एकूण',
    'Remove': 'काढा',
    
    // Authentication
    'Sign In': 'साइन इन',
    'Create Account': 'खाते तयार करा',
    'Full Name': 'पूर्ण नाव',
    'Email Address': 'ईमेल पत्ता',
    'Password': 'पासवर्ड',
    'Phone Number': 'फोन नंबर',
    'I am a:': 'मी आहे:',
    'Consumer': 'ग्राहक',
    'Already have an account?': 'आधीच खाते आहे?',
    "Don't have an account?": 'खाते नाही?',
    
    // Common terms
    'Search': 'शोधा',
    'Filter': 'फिल्टर',
    'Loading...': 'लोड होत आहे...',
    'Success': 'यश',
    'Error': 'त्रुटी',
    'Save': 'जतन करा',
    'Cancel': 'रद्द करा',
    'Edit': 'संपादित करा',
    'Delete': 'हटवा',
    'Back': 'मागे',
    'Close': 'बंद करा',
    
    // Categories
    'Vegetables': 'भाज्या',
    'Fruits': 'फळे',
    'Grains': 'धान्य',
    'Dairy': 'दुग्धजन्य पदार्थ',
    'All Categories': 'सर्व श्रेणी'
  },
  
  ta: {
    // Header & Navigation
    'KisanConnect': 'கிசான் கனெக்ட்',
    'Home': 'முகப்பு',
    'Market Trends': 'சந்தை போக்குகள்',
    'Farmer News': 'விவசாயி செய்திகள்',
    'Farmer Dashboard': 'விவசாயி டாஷ்போர்டு',
    'Consumer Dashboard': 'நுகர்வோர் டாஷ்போர்டு',
    'Adopt a Farm': 'ஒரு பண்ணையை தத்தெடுக்கவும்',
    'NGO Support': 'என்ஜிஓ ஆதரவு',
    'Log In': 'உள்நுழைய',
    'Sign Up': 'பதிவு செய்ய',
    'Profile': 'சுயவிவரம்',
    'Logout': 'வெளியேறு',
    
    // Home Page
    'Shop Fresh Produce': 'புதிய பொருட்களை வாங்கவும்',
    'Become a Farmer Partner': 'விவசாயி பங்குதாரராக மாறுங்கள்',
    'Fresh & Organic': 'புதிய மற்றும் இயற்கை',
    'Support Farmers': 'விவசாயிகளை ஆதரிக்கவும்',
    'Fast Delivery': 'வேகமான டெலிவரி',
    'Why Choose KisanConnect?': 'கிசான் கனெக்ட் ஏன் தேர்வு செய்ய வேண்டும்?',
    
    // Product & Shopping
    'Add to Cart': 'கார்ட்டில் சேர்க்கவும்',
    'Buy Now': 'இப்போது வாங்கவும்',
    'Price': 'விலை',
    'Quantity': 'அளவு',
    'Location': 'இடம்',
    'Farmer': 'விவசாயி',
    'Category': 'வகை',
    'Description': 'விளக்கம்',
    'Shopping Cart': 'ஷாப்பிங் கார்ட்',
    'Your cart is empty': 'உங்கள் கார்ட் காலியாக உள்ளது',
    'Proceed to Checkout': 'செக்அவுட்டுக்கு செல்லவும்',
    'Total': 'மொத்தம்',
    'Remove': 'அகற்று',
    
    // Authentication
    'Sign In': 'உள்நுழைய',
    'Create Account': 'கணக்கை உருவாக்கவும்',
    'Full Name': 'முழு பெயர்',
    'Email Address': 'மின்னஞ்சல் முகவரி',
    'Password': 'கடவுச்சொல்',
    'Phone Number': 'தொலைபேசி எண்',
    'I am a:': 'நான் ஒரு:',
    'Consumer': 'நுகர்வோர்',
    'Already have an account?': 'ஏற்கனவே கணக்கு உள்ளதா?',
    "Don't have an account?": 'கணக்கு இல்லையா?',
    
    // Common terms
    'Search': 'தேடு',
    'Filter': 'வடிகட்டி',
    'Loading...': 'ஏற்றுகிறது...',
    'Success': 'வெற்றி',
    'Error': 'பிழை',
    'Save': 'சேமி',
    'Cancel': 'ரத்து செய்',
    'Edit': 'திருத்து',
    'Delete': 'நீக்கு',
    'Back': 'பின்',
    'Close': 'மூடு',
    
    // Categories
    'Vegetables': 'காய்கறிகள்',
    'Fruits': 'பழங்கள்',
    'Grains': 'தானியங்கள்',
    'Dairy': 'பால் பொருட்கள்',
    'All Categories': 'அனைத்து வகைகள்'
  }
};

// Google Translate API integration
const translateWithGoogle = async (text: string, targetLang: string): Promise<string> => {
  try {
    // For demo purposes, we'll use the local translations
    // In production, you would use Google Translate API
    const langCode = targetLang.split('-')[0]; // Get base language code
    return translations[langCode]?.[text] || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const translate = (text: string): string => {
    if (currentLanguage === 'en') return text;
    
    const langCode = currentLanguage.split('-')[0];
    return translations[langCode]?.[text] || text;
  };

  const setLanguage = async (lang: string) => {
    if (lang === currentLanguage) return;
    
    setIsTranslating(true);
    console.log(`🌐 Switching language to: ${lang}`);
    
    try {
      // Simulate translation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentLanguage(lang);
      
      // Store language preference
      localStorage.setItem('kisanconnect_language', lang);
      
      console.log(`✅ Language switched to: ${lang}`);
    } catch (error) {
      console.error('❌ Language switch error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('kisanconnect_language');
    if (savedLanguage && savedLanguage !== 'en') {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  return (
    <TranslationContext.Provider value={{ 
      currentLanguage, 
      setLanguage, 
      translate, 
      isTranslating 
    }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
};