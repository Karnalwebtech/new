"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL =  'http://localhost:8000/api';

interface SEODashboardProps {
  token?: string;
}

export default function SEODashboard({ token }: SEODashboardProps) {
  const [seoEntries, setSeoEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const fetchSEOEntries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
        ...(selectedType && { type: selectedType })
      });
      
      const response = await axios.get(`${API_BASE_URL}/seo?${params}`);
      
      if (response.data.success) {
        setSeoEntries(response.data.data);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching SEO entries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSEOEntries();
  }, [page, search, selectedType]);

  const pageTypes = [
    'product', 'collection', 'category', 'page', 
    'home', 'blog', 'article', 'landing', 'custom'
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">SEO Management Dashboard</h1>
      
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search SEO entries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Types</option>
          {pageTypes.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        
        <button
          onClick={() => fetchSEOEntries()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
      
      {/* SEO Entries Table */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">Title</th>
                  <th className="py-2 px-4 border">Page Type</th>
                  <th className="py-2 px-4 border">Slug</th>
                  <th className="py-2 px-4 border">SEO Score</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {seoEntries.map((entry) => (
                  <tr key={entry._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border">{entry.meta_title}</td>
                    <td className="py-2 px-4 border">
                      <span className={`px-2 py-1 rounded text-sm ${
                        entry.page_type === 'home' ? 'bg-blue-100 text-blue-800' :
                        entry.page_type === 'product' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {entry.page_type}
                      </span>
                    </td>
                    <td className="py-2 px-4 border">{entry.page_slug || 'N/A'}</td>
                    <td className="py-2 px-4 border">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              entry.seo_score >= 80 ? 'bg-green-500' :
                              entry.seo_score >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${entry.seo_score || 0}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm">{entry.seo_score || 0}%</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 border">
                      <span className={`px-2 py-1 rounded text-sm ${
                        entry.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {entry.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => window.location.href = `/admin/seo/edit/${entry._id}`}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this SEO entry?')) {
                            await axios.delete(`${API_BASE_URL}/seo/${entry._id}`);
                            fetchSEOEntries();
                          }
                        }}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 mx-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, page - 2) + i;
              if (pageNum > totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-4 py-2 mx-1 border rounded ${
                    page === pageNum ? 'bg-blue-500 text-white' : ''
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 mx-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}