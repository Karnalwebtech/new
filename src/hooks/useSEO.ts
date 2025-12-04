import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

interface SEOData {
  meta_title: string;
  meta_description: string;
  keywords: string[];
  meta_canonical_url?: string;
  robots?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  og_url?: string;
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  structured_data?: any;
  [key: string]: any;
}

interface SEOHookReturn {
  seoData: SEOData | null;
  metaTagsHTML: string;
  structuredData: string;
  seoScore: number;
  loading: boolean;
  error: string | null;
  refreshSEO: () => Promise<void>;
}

export function useSEO(pageSlug: string, pageType?: string): SEOHookReturn {
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [metaTagsHTML, setMetaTagsHTML] = useState<string>('');
  const [structuredData, setStructuredData] = useState<string>('');
  const [seoScore, setSeoScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSEO = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = pageType 
        ? `${API_BASE_URL}/seo/slug/${pageSlug}?page_type=${pageType}`
        : `${API_BASE_URL}/seo/slug/${pageSlug}`;
      
      const response = await axios.get(url);
      
      if (response.data.success) {
        setSeoData(response.data.data);
        setMetaTagsHTML(response.data.meta_tags || '');
        setStructuredData(response.data.structured_data || '');
        setSeoScore(response.data.seo_score || 0);
      } else {
        setError(response.data.error || 'Failed to fetch SEO data');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Error fetching SEO:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pageSlug) {
      fetchSEO();
    }
  }, [pageSlug, pageType]);

  return {
    seoData,
    metaTagsHTML,
    structuredData,
    seoScore,
    loading,
    error,
    refreshSEO: fetchSEO
  };
}