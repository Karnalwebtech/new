// lib/metadata.ts
import { baseUrl } from "@/config";
import type { Metadata } from "next";

interface MetaOptions {
  title: string;
  description: string;
  url?: string;
  siteName?: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
}

export function buildMetadata({
  title,
  description,
  url = baseUrl,
  siteName = "KarnalWebTech",
  image = {
    url: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=490,fit=crop,q=95/m2WrzgBy7ZcEOgWj/logo1-1-YBgynG911Bh0OWvN.png",
    width: 800,
    height: 600,
    alt: siteName,
  },
}: MetaOptions): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [image],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: `@${siteName}`,
      title,
      description,
      images: [image.url],
    },
  };
}
