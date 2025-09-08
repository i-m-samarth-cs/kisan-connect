import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Calendar, Clock, User, Tag, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

const FarmerNews = () => {
  const { state } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All News', color: 'bg-gray-500' },
    { id: 'technology', name: 'Technology', color: 'bg-blue-500' },
    { id: 'policy', name: 'Policy', color: 'bg-green-500' },
    { id: 'market', name: 'Market', color: 'bg-yellow-500' },
    { id: 'weather', name: 'Weather', color: 'bg-indigo-500' },
    { id: 'success-story', name: 'Success Stories', color: 'bg-purple-500' }
  ];

  const filteredArticles = state.newsArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'bg-gray-500';
  };

  const selectedArticleData = selectedArticle 
    ? state.newsArticles.find(article => article.id === selectedArticle)
    : null;

  if (selectedArticleData) {
    return (
      <div className={`min-h-screen ${state.isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => setSelectedArticle(null)}
            className="mb-6 flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <span>←</span>
            <span>Back to News</span>
          </button>

          <article className={`max-w-4xl mx-auto rounded-lg p-8 ${
            state.isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                  getCategoryColor(selectedArticleData.category)
                }`}>
                  {categories.find(c => c.id === selectedArticleData.category)?.name}
                </span>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar size={16} />
                  <span>{format(new Date(selectedArticleData.publishedDate), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>{selectedArticleData.readTime} min read</span>
                </div>
              </div>

              <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {selectedArticleData.title}
              </h1>

              <div className="flex items-center space-x-2 mb-6">
                <User size={16} className="text-gray-500" />
                <span className={`text-sm ${
                  state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  By {selectedArticleData.author}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <img
                src={selectedArticleData.image}
                alt={selectedArticleData.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>

            <div className={`prose max-w-none ${
              state.isDarkMode ? 'prose-invert' : ''
            }`}>
              <p className={`text-lg leading-relaxed mb-6 ${
                state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {selectedArticleData.summary}
              </p>
              
              <div className={`text-base leading-relaxed ${
                state.isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {selectedArticleData.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {selectedArticleData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                  >
                    <Tag size={12} />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${state.isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${
            state.isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Farmer News & Updates
          </h1>
          <p className={`text-lg max-w-3xl mx-auto ${
            state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Stay updated with the latest news, policies, market trends, and success stories from the agricultural sector
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className={`rounded-lg p-6 mb-8 ${
          state.isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search news articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  state.isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter size={20} className={state.isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  state.isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? `${category.color} text-white`
                    : state.isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* News Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className={`rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                state.isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
              onClick={() => setSelectedArticle(article.id)}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                    getCategoryColor(article.category)
                  }`}>
                    {categories.find(c => c.id === article.category)?.name}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>{article.readTime} min</span>
                  </div>
                </div>

                <h2 className={`font-bold text-lg mb-3 line-clamp-2 ${
                  state.isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {article.title}
                </h2>

                <p className={`text-sm mb-4 line-clamp-3 ${
                  state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {article.summary}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User size={14} className="text-gray-500" />
                    <span className={`text-xs ${
                      state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {article.author}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} className="text-gray-500" />
                    <span className={`text-xs ${
                      state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {format(new Date(article.publishedDate), 'MMM dd')}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1">
                  {article.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {article.tags.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{article.tags.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-lg ${
              state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              No articles found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerNews;