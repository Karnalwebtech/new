import Head from 'next/head';
import { useSEO } from '../hooks/useSEO';

interface SEOProps {
    pageSlug: string;
    pageType?: string;
    defaultTitle?: string;
    defaultDescription?: string;
    defaultImage?: string;
    children?: React.ReactNode;
}

export default function SEO({
    pageSlug,
    pageType,
    defaultTitle = 'Your Website',
    defaultDescription = 'Your website description',
    defaultImage = '/default-og-image.jpg',
    children
}: SEOProps) {
    const { seoData, metaTagsHTML, structuredData, loading } = useSEO(pageSlug, pageType);

    // If no SEO data found, use defaults
    const title = seoData?.meta_title || defaultTitle;
    const description = seoData?.meta_description || defaultDescription;
    const ogImage = seoData?.og_image || defaultImage;
    const canonicalUrl = seoData?.meta_canonical_url;
    const robots = seoData?.robots || 'index, follow';

    return (
        <>
            <Head>
                {/* Basic Meta Tags */}
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="robots" content={robots} />

                {/* Keywords */}
                {seoData?.keywords && seoData.keywords.length > 0 && (
                    <meta name="keywords" content={seoData.keywords.join(', ')} />
                )}

                {/* Canonical URL */}
                {canonicalUrl && (
                    <link rel="canonical" href={canonicalUrl} />
                )}

                {/* Open Graph */}
                <meta property="og:title" content={seoData?.og_title || title} />
                <meta property="og:description" content={seoData?.og_description || description} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:type" content={seoData?.og_type || 'website'} />

                {seoData?.og_url && (
                    <meta property="og:url" content={seoData.og_url} />
                )}

                {seoData?.og_site_name && (
                    <meta property="og:site_name" content={seoData.og_site_name} />
                )}

                {/* Twitter Card */}
                <meta name="twitter:card" content={seoData?.twitter_card || 'summary_large_image'} />
                <meta name="twitter:title" content={seoData?.twitter_title || title} />
                <meta name="twitter:description" content={seoData?.twitter_description || description} />

                {seoData?.twitter_image && (
                    <meta name="twitter:image" content={seoData.twitter_image} />
                )}

                {seoData?.twitter_site && (
                    <meta name="twitter:site" content={seoData.twitter_site} />
                )}

                {seoData?.twitter_creator && (
                    <meta name="twitter:creator" content={seoData.twitter_creator} />
                )}

                {/* Viewport */}
                <meta name="viewport" content={seoData?.viewport || 'width=device-width, initial-scale=1'} />

                {/* Additional Meta Tags from API */}
                {!loading && metaTagsHTML && (
                    <div dangerouslySetInnerHTML={{ __html: metaTagsHTML }} />
                )}

                {/* Structured Data */}
                {!loading && structuredData && (
                    <div dangerouslySetInnerHTML={{ __html: structuredData }} />
                )}
            </Head>

            {/* Page Content */}
            {children}
        </>
    );
}