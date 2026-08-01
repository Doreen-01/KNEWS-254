import React, { useState } from 'react';
import { Globe, Code, ShieldCheck, Check } from 'lucide-react';
import { NewsCategory, Article } from '../types';

interface SeoHeadProps {
  category: NewsCategory;
  article?: Article;
  subCategory?: string;
}

export const SeoHead: React.FC<SeoHeadProps> = ({ category, article, subCategory }) => {
  const [showSchemaInspector, setShowSchemaInspector] = useState(false);

  const getPageTitle = () => {
    if (article) return `${article.title} | Knews254 Kenya`;
    if (category === 'home') return 'Knews254 - Kenya Breaking News, Politics, 47 Counties & Business';
    const catName = category.charAt(0).toUpperCase() + category.slice(1);
    return `${catName} News Kenya - Knews254 Digital Media`;
  };

  const getMetaDescription = () => {
    if (article) return article.summary;
    return `Latest ${category} updates from Kenya, East Africa, and Diaspora. Live coverage, verified reports, investigative pieces, and expert opinion on Knews254.`;
  };

  const canonicalUrl = `https://knews254.co.ke/${category}${article ? `/${article.slug}` : ''}`;

  const jsonLdSchema = article
    ? {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title,
        image: [article.imageUrl],
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        author: {
          '@type': 'Person',
          name: article.author.name,
          jobTitle: article.author.role,
        },
        publisher: {
          '@type': 'NewsMediaOrganization',
          name: 'Knews254 Digital Media',
          url: 'https://knews254.co.ke',
          logo: {
            '@type': 'ImageObject',
            url: 'https://knews254.co.ke/logo.png',
          },
        },
        description: article.summary,
        articleSection: article.category,
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: getPageTitle(),
        description: getMetaDescription(),
        url: canonicalUrl,
        publisher: {
          '@type': 'NewsMediaOrganization',
          name: 'Knews254 Digital Media',
        },
      };

  return (
    <div className="bg-slate-950 border-b border-slate-800 py-1.5 px-4 text-xs font-mono text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-slate-300 font-semibold truncate">{getPageTitle()}</span>
          <span className="hidden sm:inline-block text-slate-600">•</span>
          <span className="hidden sm:inline-block text-slate-500 text-[11px] truncate">
            {canonicalUrl}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-slate-900 border border-slate-800 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            SEO & OpenGraph Ready
          </span>

          <button
            onClick={() => setShowSchemaInspector(!showSchemaInspector)}
            className="text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"
          >
            <Code className="w-3 h-3 text-red-400" />
            {showSchemaInspector ? 'Hide Schema' : 'JSON-LD Schema'}
          </button>
        </div>
      </div>

      {/* JSON-LD Schema Inspector Modal / Collapsible */}
      {showSchemaInspector && (
        <div className="mt-3 p-3 bg-slate-900 border border-slate-800 rounded-lg text-[11px] overflow-x-auto text-emerald-300">
          <p className="text-slate-400 font-bold mb-1 flex items-center justify-between">
            <span>Structured Data Schema (Google Search Engine Compliant)</span>
            <span className="text-slate-500 font-normal">JSON-LD</span>
          </p>
          <pre className="whitespace-pre-wrap">{JSON.stringify(jsonLdSchema, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
