import React, { useEffect } from 'react';
import { NewsCategory, Article } from '../types';
import { generateMetadata } from '../utils/seo';

interface SeoHeadProps {
  category: NewsCategory;
  article?: Article | null;
  subCategory?: string;
  language?: 'en' | 'sw' | 'sheng';
}

export const SeoHead: React.FC<SeoHeadProps> = ({ category, article }) => {
  const metadata = generateMetadata({
    category,
    article,
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Update Document Title
    document.title = metadata.title;

    // 2. Helper to set or create meta tag
    const setMeta = (nameOrProp: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${nameOrProp}"]` : `meta[name="${nameOrProp}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) el.setAttribute('property', nameOrProp);
        else el.setAttribute('name', nameOrProp);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', metadata.description);
    setMeta('keywords', metadata.keywords.join(', '));
    setMeta('og:title', metadata.og.title, true);
    setMeta('og:description', metadata.og.description, true);
    setMeta('og:url', metadata.og.url, true);
    setMeta('og:type', metadata.og.type, true);
    setMeta('og:image', metadata.og.image, true);
    setMeta('og:site_name', metadata.og.siteName, true);
    setMeta('twitter:card', metadata.twitter.card);
    setMeta('twitter:site', metadata.twitter.site);
    setMeta('twitter:title', metadata.twitter.title);
    setMeta('twitter:description', metadata.twitter.description);
    setMeta('twitter:image', metadata.twitter.image);

    // 3. Set Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', metadata.canonicalUrl);

    // 4. Set hreflang Links for International Search Engines
    const setHreflang = (lang: string, href: string) => {
      let link = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', lang);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    const baseUrl = metadata.canonicalUrl;
    setHreflang('en', `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}lang=en`);
    setHreflang('sw', `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}lang=sw`);
    setHreflang('sw-KE', `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}lang=sw`);
    setHreflang('x-default', baseUrl);

    // 5. Inject JSON-LD Schema Script Tag
    let scriptTag = document.querySelector('#knews254-jsonld-schema') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'knews254-jsonld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(metadata.jsonLd);

  }, [metadata]);

  // Hidden from public visual layout as requested by Chairman & Super Administrator and Manus AI audit recommendation
  return null;
};
