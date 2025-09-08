import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useTranslation } from './TranslationProvider';
import { createOrder } from '../lib/supabase';
import { X, CreditCard, MapPin, User, Calendar, Lock } from 'lucide-react';
import { PaymentDetails } from '../types';

const CheckoutModal = () => {
  const { state, dispatch } = useApp();
  const { translate } = useTranslation();
  const [step, setStep] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const cartTotal = state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const deliveryFee = cartTotal > 500 ? 0 : 50;
  const finalTotal = cartTotal + deliveryFee;

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.user) {
      alert('Please log in to place an order');
      return;
    }
    
    setIsProcessing(true);

    try {
      // Create order in database
      const orderData = {
        user_id: state.user.id,
        farmer_id: state.cart[0]?.product.farmerId || '', // Assuming single farmer per order
        items: state.cart.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          unit: item.product.unit
        })),
        total: finalTotal,
        status: 'pending' as const,
        delivery_address: deliveryAddress,
        payment_method: `**** **** **** ${paymentDetails.cardNumber.slice(-4)}`
      };

      const createdOrder = await createOrder(orderData);
      
      // Add to local state
      dispatch({ type: 'ADD_ORDER', payload: {
        id: createdOrder.id,
        userId: createdOrder.user_id,
        items: state.cart,
        total: createdOrder.total,
        status: createdOrder.status,
        orderDate: createdOrder.created_at,
        deliveryAddress: createdOrder.delivery_address,
        paymentMethod: createdOrder.payment_method
      }});
      
      dispatch({ type: 'TOGGLE_CHECKOUT' });
      setStep(1);

      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span class="text-green-600 text-sm">✓</span>
          </div>
          <div>
            <div class="font-semibold">Order Confirmed!</div>
            <div class="text-sm opacity-90">Order #${createdOrder.id}</div>
          </div>
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        document.body.removeChild(notification);
      }, 5000);
      
    } catch (error) {
      console.error('Order creation error:', error);
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg z-50';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span class="text-red-600 text-sm">✕</span>
          </div>
          <div class="font-semibold">Order failed. Please try again.</div>
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!state.showCheckout) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
        state.isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${
            state.isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {translate('Checkout')}
          </h2>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_CHECKOUT' })}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
              state.isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            1
          </div>
          <div className={`flex-1 h-1 mx-2 ${
            step >= 2 ? 'bg-green-600' : 'bg-gray-300'
          }`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            2
          </div>
          <div className={`flex-1 h-1 mx-2 ${
            step >= 3 ? 'bg-green-600' : 'bg-gray-300'
          }`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            3
          </div>
        </div>

        {step === 1 && (
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              state.isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Order Summary
            </h3>
            
            <div className="space-y-4 mb-6">
              {state.cart.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      state.isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {item.product.name}
                    </h4>
                    <p className={`text-sm ${
                      state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {item.quantity} × ₹{item.product.price}
                    </p>
                  </div>
                  <span className={`font-semibold ${
                    state.isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className={state.isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Subtotal:
                </span>
                <span className={state.isDarkMode ? 'text-white' : 'text-gray-800'}>
                  ₹{cartTotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={state.isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Delivery Fee:
                </span>
                <span className={state.isDarkMode ? 'text-white' : 'text-gray-800'}>
                  {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className={state.isDarkMode ? 'text-white' : 'text-gray-800'}>
                  Total:
                </span>
                <span className="text-green-600">₹{finalTotal}</span>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors"
            >
              Continue to Delivery
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className={`text-lg font-semibold mb-4 flex items-center ${
              state.isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              <MapPin size={20} className="mr-2" />
              Delivery Address
            </h3>
            
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your complete delivery address..."
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                state.isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setStep(1)}
                className={`flex-1 py-3 rounded-lg border transition-colors ${
                  state.isDarkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!deliveryAddress.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className={`text-lg font-semibold mb-4 flex items-center ${
              state.isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              <CreditCard size={20} className="mr-2" />
              Payment Details
            </h3>
            
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <User size={16} className="inline mr-2" />
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={paymentDetails.cardholderName}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardholderName: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
                  <CreditCard size={16} className="inline mr-2" />
                  Card Number
                </label>
                <input
                  type="text"
                  value={paymentDetails.cardNumber}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    state.isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Calendar size={16} className="inline mr-2" />
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.expiryDate}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
                    <Lock size={16} className="inline mr-2" />
                    CVV
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.cvv}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                    placeholder="123"
                    maxLength={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      state.isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className={`flex-1 py-3 rounded-lg border transition-colors ${
                    state.isDarkMode
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${finalTotal}`
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;