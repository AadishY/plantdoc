import { useEffect } from 'react';

/**
 * Helper to safely find or create a meta tag in document.head
 */
function setOrCreateMeta(attrName: 'name' | 'property', attrValue: string, content: string) {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Helper to safely find or create a link tag in document.head
 */
function setOrCreateLink(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

/**
 * Hook to dynamically update document title, canonical link, OpenGraph, Twitter, and SEO/GEO meta tags
 */
export function useDocumentTitle(
  title: string,
  description?: string,
  canonicalPath?: string,
  keywords?: string,
  ogImage?: string,
  ogType: string = 'website'
) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    // Update og:title and twitter:title
    setOrCreateMeta('property', 'og:title', title);
    setOrCreateMeta('name', 'twitter:title', title);

    if (description) {
      setOrCreateMeta('name', 'description', description);
      setOrCreateMeta('property', 'og:description', description);
      setOrCreateMeta('name', 'twitter:description', description);
    }

    if (keywords) {
      setOrCreateMeta('name', 'keywords', keywords);
    }

    // Set og:type
    setOrCreateMeta('property', 'og:type', ogType);

    // Resolve absolute image URL for social previews
    const resolvedImage = ogImage 
      ? (ogImage.startsWith('http') ? ogImage : `https://plantdoc.ai${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`)
      : 'https://plantdoc.ai/bannerr.jpg';

    setOrCreateMeta('property', 'og:image', resolvedImage);
    setOrCreateMeta('property', 'og:image:secure_url', resolvedImage);
    setOrCreateMeta('name', 'twitter:image', resolvedImage);

    // Update Canonical and OpenGraph / Twitter URLs
    const currentUrl = canonicalPath 
      ? `https://plantdoc.ai${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
      : window.location.href;

    setOrCreateLink('canonical', currentUrl);
    setOrCreateMeta('property', 'og:url', currentUrl);
    setOrCreateMeta('name', 'twitter:url', currentUrl);

    return () => {
      document.title = previousTitle;
    };
  }, [title, description, canonicalPath, keywords, ogImage, ogType]);
}

