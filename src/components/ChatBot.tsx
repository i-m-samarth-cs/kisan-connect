import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { MessageCircle, X, Send } from 'lucide-react';
import { ChatMessage } from '../types';

const ChatBot = () => {
  const { state, dispatch } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'Hello! How can I help you today?',
      isUser: false,
      timestamp: new Date(),
      language: 'en'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      isUser: true,
      timestamp: new Date(),
      language: state.currentLanguage
    };

    setMessages(prev => [...prev, userMessage]);

    // Mock bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: getBotResponse(inputMessage),
        isUser: false,
        timestamp: new Date(),
        language: state.currentLanguage
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputMessage('');
  };

  const getBotResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return 'You can check current prices on our marketplace. Prices vary by location and season. Would you like me to help you find specific products?';
    }
    
    if (lowerMessage.includes('farmer') || lowerMessage.includes('farm')) {
      return 'We connect you directly with local farmers. You can browse farmer profiles, adopt a farm, or purchase fresh produce. What would you like to know about our farmers?';
    }
    
    if (lowerMessage.includes('organic') || lowerMessage.includes('quality')) {
      return 'All our farmers follow sustainable practices. We ensure quality through regular inspections and direct farmer partnerships. Each product has quality ratings from previous buyers.';
    }
    
    if (lowerMessage.includes('delivery') || lowerMessage.includes('shipping')) {
      return 'We offer fast delivery from local farms to your doorstep. Delivery times vary by location but typically range from 1-3 days for fresh produce.';
    }
    
    if (lowerMessage.includes('ngo') || lowerMessage.includes('support')) {
      return 'Our NGO support section helps farmers connect with organizations that provide training, funding, and resources. You can apply through our Quick Apply feature or contact specific NGOs directly.';
    }
    
    return 'I can help you with information about our farmers, products, pricing, delivery, and NGO support. What specific information are you looking for?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_CHAT' })}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 ${
          state.isChatOpen
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-green-600 hover:bg-green-700'
        } text-white`}
      >
        {state.isChatOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {state.isChatOpen && (
        <div className={`fixed bottom-24 right-6 w-80 h-96 rounded-lg shadow-xl flex flex-col z-50 ${
          state.isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Header */}
          <div className="bg-green-600 text-white p-4 rounded-t-lg">
            <h3 className="font-semibold">KisaanConnect Support</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-green-600 text-white'
                      : state.isDarkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  state.isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <button
                onClick={handleSendMessage}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;