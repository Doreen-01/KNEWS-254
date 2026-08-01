import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { NewsCategory } from '../types';

interface BreadcrumbsProps {
  category: NewsCategory;
  subcategory?: string;
  articleTitle?: string;
  onSelectCategory: (cat: NewsCategory) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  category,
  subcategory,
  articleTitle,
  onSelectCategory,
}) => {
  const formatCategoryName = (cat: NewsCategory) => {
    if (cat === 'home') return 'Home';
    if (cat === 'fact-checking') return 'Fact Check';
    if (cat === 'ai') return 'Artificial Intelligence';
    if (cat === 'elections') return 'Elections 2027';
    if (cat === 'editorial-policy') return 'Editorial Policy';
    if (cat === 'privacy-policy') return 'Privacy Policy';
    if (cat === 'cookie-policy') return 'Cookie Policy';
    if (cat === 'terms-of-service') return 'Terms of Service';
    if (cat === 'corrections-policy') return 'Corrections Policy';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <nav aria-label="Breadcrumb" className="py-2.5 px-4 bg-slate-900/60 border-b border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 flex-wrap text-slate-400">
        <button
          onClick={() => onSelectCategory('home')}
          className="flex items-center gap-1 hover:text-white transition font-medium"
        >
          <Home className="w-3.5 h-3.5 text-slate-400" />
          <span>Home</span>
        </button>

        {category !== 'home' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <button
              onClick={() => onSelectCategory(category)}
              className={`hover:text-white transition font-semibold ${
                !subcategory && !articleTitle ? 'text-red-400 font-bold' : ''
              }`}
            >
              {formatCategoryName(category)}
            </button>
          </>
        )}

        {subcategory && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className={`font-semibold ${!articleTitle ? 'text-red-400 font-bold' : ''}`}>
              {subcategory}
            </span>
          </>
        )}

        {articleTitle && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="text-slate-200 font-medium truncate max-w-xs sm:max-w-md">
              {articleTitle}
            </span>
          </>
        )}
      </div>
    </nav>
  );
};
