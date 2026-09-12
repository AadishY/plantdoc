import { useEffect } from 'react';

/**
 * Hook to dynamically update document title, canonical link, and OpenGraph / Twitter meta tags
 */
export function useDocumentTitle(title: string, description?: string, canonicalPath?: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    // Update og:title and twitter:title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', title);

    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', description);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);

      const twitterDesc = document.querySelector('meta[name="twitter:description"]');
      if (twitterDesc) twitterDesc.setAttribute('content', description);
    }

    // Update Canonical and OpenGraph URL
    const currentUrl = canonicalPath 
      ? `https://plantdoc.ai${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
      : window.location.href;

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', currentUrl);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', currentUrl);
    }

    return () => {
      document.title = previousTitle;
    };
  }, [title, description, canonicalPath]);
}

