import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useTranslation } from './TranslationProvider';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Filter,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from 'lucide-react';
import { format } from 'date-fns';

const MarketTrends = () => {
  const { state } = useApp();
  const { translate } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [timeRange, setTimeRange] = useState('7d');

  const filteredTrends = selectedCrop === 'all' 
    ? state.marketTrends 
    : state.marketTrends.filter(trend => trend.cropName.toLowerCase() === selectedCrop.toLowerCase());

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'sell': return 'text-green-600 bg-green-100';
      case 'hold': return 'text-yellow-600 bg-yellow-100';
      case 'wait': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'sell': return <CheckCircle size={16} />;
      case 'hold': return <Clock size={16} />;
      case 'wait': return <AlertTriangle size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getDemandSupplyColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const pieData = state.marketTrends.map(trend => ({
    name: trend.cropName,
    value: trend.currentPrice,
    recommendation: trend.recommendation
  }));

  const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6', '#8b5cf6', '#f59e0b'];

  return (
    <div className={`min-h-screen ${state.isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            state.isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {translate('Market Trends & Analytics')}
          </h1>
          <p className={`text-lg ${
            state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {translate('Real-time market data and AI-powered insights to optimize your selling decisions')}
          </p>
        </div>

        {/* Filters and Controls */}
        <div className={`rounded-lg p-6 mb-8 ${
          state.isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter size={20} className={state.isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  state.isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">{translate('All Crops')}</option>
                {state.marketTrends.map(trend => (
                  <option key={trend.id} value={trend.cropName.toLowerCase()}>
                    {trend.cropName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar size={20} className={state.isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  state.isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="7d">{translate('Last 7 Days')}</option>
                <option value="30d">{translate('Last 30 Days')}</option>
                <option value="90d">{translate('Last 3 Months')}</option>
                <option value="1y">{translate('Last Year')}</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`text-sm ${state.isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {translate('Chart Type')}:
              </span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setChartType('line')}
                  className={`p-2 rounded-lg transition-colors ${
                    chartType === 'line'
                      ? 'bg-green-600 text-white'
                      : state.isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <LineChartIcon size={16} />
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`p-2 rounded-lg transition-colors ${
                    chartType === 'bar'
                      ? 'bg-green-600 text-white'
                      : state.isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <BarChart3 size={16} />
                </button>
                <button
                  onClick={() => setChartType('pie')}
                  className={`p-2 rounded-lg transition-colors ${
                    chartType === 'pie'
                      ? 'bg-green-600 text-white'
                      : state.isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <PieChartIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredTrends.map((trend) => (
            <div
              key={trend.id}
              className={`rounded-lg p-6 ${
                state.isDarkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${
                  state.isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {trend.cropName}
                </h3>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  getRecommendationColor(trend.recommendation)
                }`}>
                  {getRecommendationIcon(trend.recommendation)}
                  <span className="uppercase">{trend.recommendation}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${
                    state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {translate('Current Price')}
                  </span>
                  <span className={`font-bold ${
                    state.isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    ₹{trend.currentPrice}/kg
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`text-sm ${
                    state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {translate('Predicted Price')}
                  </span>
                  <span className="font-bold text-green-600">
                    ₹{trend.predictedPrice}/kg
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`text-sm ${
                    state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {translate('Price Change')}
                  </span>
                  <div className="flex items-center space-x-1">
                    {trend.priceChange > 0 ? (
                      <TrendingUp size={16} className="text-green-600" />
                    ) : (
                      <TrendingDown size={16} className="text-red-600" />
                    )}
                    <span className={`font-medium ${
                      trend.priceChange > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trend.priceChange > 0 ? '+' : ''}{trend.priceChange.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-xs mb-2">
                    <span className={state.isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {translate('Demand')}
                    </span>
                    <span className={state.isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {translate('Supply')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getDemandSupplyColor(trend.demandLevel)}`}></div>
                      <span className="text-xs capitalize">{trend.demandLevel}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getDemandSupplyColor(trend.supplyLevel)}`}></div>
                      <span className="text-xs capitalize">{trend.supplyLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs ${
                      state.isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {translate('Confidence')}
                    </span>
                    <span className="text-xs font-medium">{trend.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${trend.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className={`rounded-lg p-6 mb-8 ${
          state.isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className={`text-2xl font-bold mb-6 ${
            state.isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {translate('Price Trends Analysis')}
          </h2>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' && (
                <LineChart data={filteredTrends[0]?.historicalData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={state.isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="date" 
                    stroke={state.isDarkMode ? '#9ca3af' : '#6b7280'}
                    tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                  />
                  <YAxis stroke={state.isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: state.isDarkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${state.isDarkMode ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      color: state.isDarkMode ? '#ffffff' : '#000000'
                    }}
                    labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                    formatter={(value: any) => [`₹${value}/kg`, 'Price']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
                  />
                </LineChart>
              )}

              {chartType === 'bar' && (
                <BarChart data={filteredTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke={state.isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="cropName" 
                    stroke={state.isDarkMode ? '#9ca3af' : '#6b7280'}
                  />
                  <YAxis stroke={state.isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: state.isDarkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${state.isDarkMode ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      color: state.isDarkMode ? '#ffffff' : '#000000'
                    }}
                    formatter={(value: any) => [`₹${value}/kg`, 'Current Price']}
                  />
                  <Bar dataKey="currentPrice" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}

              {chartType === 'pie' && (
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ₹${value}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: state.isDarkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${state.isDarkMode ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      color: state.isDarkMode ? '#ffffff' : '#000000'
                    }}
                    formatter={(value: any) => [`₹${value}/kg`, 'Price']}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Insights */}
        <div className={`rounded-lg p-6 ${
          state.isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className={`text-2xl font-bold mb-6 ${
            state.isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {translate('AI Market Insights')}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTrends.map((trend) => (
              <div
                key={trend.id}
                className={`p-4 rounded-lg border ${
                  state.isDarkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <h3 className={`font-semibold mb-3 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {trend.cropName} - {translate('Market Factors')}
                </h3>
                <ul className="space-y-2">
                  {trend.factors.map((factor, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className={`text-sm ${
                        state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {factor}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTrends;