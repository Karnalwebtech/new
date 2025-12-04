"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

interface SEOFormProps {
  entryId?: string;
  onSuccess?: () => void;
}

export default function SEOForm({ entryId, onSuccess }: SEOFormProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    meta_title: '',
    meta_description: '',
    keywords: [] as string[],
    meta_canonical_url: '',
    robots: 'index, follow',
    page_type: 'page',
    page_slug: '',
    product_id: '',
    collection_id: '',
    category_id: '',
    og_title: '',
    og_description: '',
    og_image: '',
    og_image_alt: '',
    og_type: 'website',
    og_url: '',
    og_site_name: '',
    twitter_card: 'summary_large_image',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    twitter_site: '',
    twitter_creator: '',
    structured_data: '',
    is_active: true,
    priority: 0.5
  });
  
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    if (entryId) {
      fetchEntry();
    }
  }, [entryId]);

  const fetchEntry = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/seo/${entryId}`);
      
      if (response.data.success) {
        setFormData({
          ...response.data.data,
          keywords: response.data.data.keywords || [],
          structured_data: JSON.stringify(response.data.data.structured_data || {}, null, 2)
        });
      }
    } catch (error) {
      console.error('Error fetching SEO entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      const dataToSend = {
        ...formData,
        structured_data: formData.structured_data 
          ? JSON.parse(formData.structured_data)
          : undefined
      };
      
      const url = entryId 
        ? `${API_BASE_URL}/seo/${entryId}`
        : `${API_BASE_URL}/seo`;
      
      const method = entryId ? 'put' : 'post';
      
      const response = await axios[method](url, dataToSend);
      
      if (response.data.success) {
        alert(entryId ? 'SEO updated successfully!' : 'SEO created successfully!');
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'An error occurred');
      console.error('Error saving SEO:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()]
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword)
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Basic SEO Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Meta Title */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Meta Title *</label>
            <input
              type="text"
              name="meta_title"
              value={formData.meta_title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              maxLength={60}
              required
            />
            <div className="text-sm text-gray-500 mt-1">
              {formData.meta_title.length}/60 characters
            </div>
          </div>
          
          {/* Meta Description */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Meta Description *</label>
            <textarea
              name="meta_description"
              value={formData.meta_description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
              maxLength={160}
              required
            />
            <div className="text-sm text-gray-500 mt-1">
              {formData.meta_description.length}/160 characters
            </div>
          </div>
          
          {/* Keywords */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Keywords</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Add a keyword"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.keywords.map(keyword => (
                <span
                  key={keyword}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          {/* Canonical URL */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Canonical URL</label>
            <input
              type="url"
              name="meta_canonical_url"
              value={formData.meta_canonical_url}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="https://example.com/page"
            />
          </div>
          
          {/* Robots */}
          <div>
            <label className="block text-sm font-medium mb-1">Robots Directive</label>
            <select
              name="robots"
              value={formData.robots}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="index, follow">Index, Follow</option>
              <option value="index, nofollow">Index, Nofollow</option>
              <option value="noindex, follow">Noindex, Follow</option>
              <option value="noindex, nofollow">Noindex, Nofollow</option>
              <option value="noarchive">Noarchive</option>
              <option value="nosnippet">Nosnippet</option>
            </select>
          </div>
          
          {/* Page Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Page Type *</label>
            <select
              name="page_type"
              value={formData.page_type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="page">Page</option>
              <option value="product">Product</option>
              <option value="collection">Collection</option>
              <option value="category">Category</option>
              <option value="home">Home</option>
              <option value="blog">Blog</option>
              <option value="article">Article</option>
              <option value="landing">Landing Page</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          
          {/* Page Slug */}
          <div>
            <label className="block text-sm font-medium mb-1">Page Slug</label>
            <input
              type="text"
              name="page_slug"
              value={formData.page_slug}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="about-us"
            />
          </div>
          
          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Priority: {formData.priority}
            </label>
            <input
              type="range"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              min="0"
              max="1"
              step="0.1"
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Low (0)</span>
              <span>High (1)</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Open Graph Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Open Graph (Facebook)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">OG Title</label>
            <input
              type="text"
              name="og_title"
              value={formData.og_title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              maxLength={60}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">OG Description</label>
            <textarea
              name="og_description"
              value={formData.og_description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={2}
              maxLength={200}
            />
          </div>
          
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">OG Image URL</label>
            <input
              type="url"
              name="og_image"
              value={formData.og_image}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>
      
      {/* Twitter Card Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Twitter Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Twitter Card Type</label>
            <select
              name="twitter_card"
              value={formData.twitter_card}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="summary">Summary</option>
              <option value="summary_large_image">Summary Large Image</option>
              <option value="app">App</option>
              <option value="player">Player</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Twitter Title</label>
            <input
              type="text"
              name="twitter_title"
              value={formData.twitter_title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              maxLength={70}
            />
          </div>
          
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Twitter Image URL</label>
            <input
              type="url"
              name="twitter_image"
              value={formData.twitter_image}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="https://example.com/twitter-image.jpg"
            />
          </div>
        </div>
      </div>
      
      {/* Structured Data Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Structured Data (JSON-LD)</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Schema.org Markup</label>
          <textarea
            name="structured_data"
            value={formData.structured_data}
            onChange={handleChange}
            className="w-full p-2 border rounded font-mono"
            rows={10}
            placeholder='{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page Title",
  "description": "Page Description"
}'
          />
        </div>
      </div>
      
      {/* Status Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Status</h2>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
            className="mr-2"
          />
          <label htmlFor="is_active" className="text-sm font-medium">
            Active (visible on site)
          </label>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {saving ? 'Saving...' : entryId ? 'Update SEO' : 'Create SEO'}
        </button>
      </div>
    </form>
  );
}