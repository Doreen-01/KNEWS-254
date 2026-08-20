import { Article, NewsCategory } from '../types';

export interface SeoMetadataOptions {
  title?: string;
  description?: string;
  category?: NewsCategory | string;
  article?: Article | null;
  searchQuery?: string;
  imageUrl?: string;
  url?: string;
}

export interface SeoMetadataResult {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  og: {
    title: string;
    description: string;
    url: string;
    type: 'website' | 'article';
    image: string;
    siteName: string;
    locale: string;
    publishedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  twitter: {
    card: 'summary_large_image';
    site: string;
    title: string;
    description: string;
    image: string;
  };
  jsonLd: Record<string, any>[];
}

const configuredBaseUrl = typeof import.meta !== 'undefined'
  ? String((import.meta as any).env?.VITE_APP_URL || '')
  : '';
const DEFAULT_BASE_URL = (configuredBaseUrl || 'https://knews254.co.ke').replace(/\/+$/, '');
const DEFAULT_BRAND_IMAGE = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80';

const CATEGORY_LABEL_MAP: Record<string, { name: string; desc: string }> = {
  home: {
    name: 'Kenya & East Africa News Ecosystem',
    desc: 'East Africa premier digital news network delivering live breaking Kenya news, 47 counties hyper-local coverage, 2027 Election portal, investigational journalism, and live economic tickers.'
  },
  breaking: {
    name: 'Breaking News Bulletins',
    desc: 'Live continuous breaking news alerts across Kenya, East Africa, and global frontiers 24/7.'
  },
  politics: {
    name: 'Politics & Governance',
    desc: 'In-depth coverage of Parliament, Cabinet affairs, State House dispatches, and county political developments in Kenya.'
  },
  elections: {
    name: '2027 Kenya General Election Hub',
    desc: 'IEBC updates, presidential candidate polls, constituency tracking, voter registration guides, and 2027 election coverage.'
  },
  business: {
    name: 'Business, Markets & Economy',
    desc: 'Nairobi Securities Exchange (NSE) tickers, Central Bank of Kenya (CBK) directives, inflation figures, and East African commercial news.'
  },
  technology: {
    name: 'Silicon Savannah Tech & Innovation',
    desc: 'East Africa fintech developments, M-Pesa innovations, telecom infrastructure, and tech startup coverage.'
  },
  ai: {
    name: 'Artificial Intelligence & Newsroom Tech',
    desc: 'Generative AI advancements, machine learning research, and tech policy across Kenya and Africa.'
  },
  sports: {
    name: 'Sports & Athletics',
    desc: 'FKF Premier League, World Athletics marathon champions, Kenya Rugby Sevens, and Safari Rally coverage.'
  },
  county: {
    name: '47 Counties Devolution Explorer',
    desc: 'Hyper-local dispatches, county assembly legislation, governor pressers, and local infrastructure projects across all 47 Kenyan counties.'
  },
  investigations: {
    name: 'Investigative Journalism Desk',
    desc: 'Exclusives, procurement audit exposes, anti-corruption inquiries, and in-depth investigative reports.'
  },
  diaspora: {
    name: 'Global Kenya Diaspora',
    desc: 'News, economic remittance dispatches, consular notices, and community spotlights for Kenyans living abroad.'
  },
  opinion: {
    name: 'Editorial & Opinion Columns',
    desc: 'Perspectives and analytical commentaries from Kenya leading policy experts, economists, and legal minds.'
  },
  'fact-checking': {
    name: 'Knews254 Verify Fact-Check Unit',
    desc: 'Forensic fact-checking and debunking viral political misinformation, fake news, and altered digital media.'
  },
  podcasts: {
    name: 'Knews254 Audio Briefings & Podcasts',
    desc: 'Daily audio news dispatches, analyst interviews, and investigative podcasts.'
  },
  videos: {
    name: 'Video Bulletins & Documentaries',
    desc: 'High-definition video reports, field dispatches, and investigative mini-documentaries.'
  }
};

/**
 * generateMetadata - Main SEO metadata builder function
 */
export function generateMetadata(options: SeoMetadataOptions = {}): SeoMetadataResult {
  const {
    category = 'home',
    article = null,
    searchQuery = '',
    url = DEFAULT_BASE_URL,
    imageUrl = DEFAULT_BRAND_IMAGE
  } = options;

  const currentUrl = article 
    ? `${DEFAULT_BASE_URL}/?article=${article.slug || article.id}`
    : category !== 'home'
    ? `${DEFAULT_BASE_URL}/?cat=${category}`
    : url;

  let pageTitle = 'KNews 254 | Kenya, East Africa & Global News Ecosystem';
  let pageDescription = 'KNews 254 is East Africa premier digital news network delivering live breaking Kenya news, 47 counties hyper-local coverage, 2027 Election portal, investigational journalism, and live economic tickers.';
  let keywords = [
    'Kenya News',
    'Nairobi News',
    '47 Counties',
    'East Africa',
    'Knews254',
    'Kelly Muthomi Kinoti',
    'Elections 2027',
    'Fact Check Kenya',
    'NSE Stocks',
    'Sheng News'
  ];

  if (article) {
    pageTitle = `${article.title} | Knews254 Special Report`;
    pageDescription = article.summary || article.content.substring(0, 160);
    if (article.tags && article.tags.length > 0) {
      keywords = [...article.tags, 'Kenya News', 'Knews254 Investigative', article.category];
    }
  } else if (searchQuery) {
    pageTitle = `Search results for "${searchQuery}" | Knews254`;
    pageDescription = `Read verified news, reports, and county articles matching "${searchQuery}" on Knews254.`;
    keywords.push(searchQuery);
  } else if (category && CATEGORY_LABEL_MAP[category]) {
    const catInfo = CATEGORY_LABEL_MAP[category];
    pageTitle = `${catInfo.name} | Knews254 Kenya`;
    pageDescription = catInfo.desc;
    keywords = [catInfo.name, category, 'Kenya News', 'Knews254 Coverage'];
  }

  const articleImage = article?.imageUrl || imageUrl || DEFAULT_BRAND_IMAGE;

  // Build JSON-LD Schema objects
  const jsonLdSchemas: Record<string, any>[] = [];

  // 1. Organization & NewsMediaOrganization Schema
  jsonLdSchemas.push({
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    '@id': `${DEFAULT_BASE_URL}/#organization`,
    name: 'Knews254',
    legalName: 'Knews254 Media Group Ltd',
    url: DEFAULT_BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: DEFAULT_BRAND_IMAGE,
      width: 1200,
      height: 630
    },
    founder: {
      '@type': 'Person',
      name: 'Kelly Muthomi Kinoti',
      jobTitle: 'Executive Chairman & Chief Architect'
    },
    editor: {
      '@type': 'Person',
      name: 'Muchui Mwirigi',
      jobTitle: 'Editor-in-Chief'
    },
    sameAs: [
      'https://twitter.com/KellyMuthomi254',
      'https://facebook.com/Knews254',
      'https://linkedin.com/company/knews254'
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nairobi',
      addressCountry: 'KE'
    },
    publishingPrinciples: `${DEFAULT_BASE_URL}/?cat=editorial-policy`,
    correctionsPolicy: `${DEFAULT_BASE_URL}/?cat=corrections-policy`,
    ethicsPolicy: `${DEFAULT_BASE_URL}/?cat=ethics-policy`,
    diversityPolicy: `${DEFAULT_BASE_URL}/?cat=transparency-report`
  });

  // 2. WebSite Schema
  jsonLdSchemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${DEFAULT_BASE_URL}/#website`,
    url: DEFAULT_BASE_URL,
    name: 'Knews254 Digital Media Network',
    description: 'Premier East African digital news ecosystem covering all 47 counties of Kenya.',
    publisher: {
      '@id': `${DEFAULT_BASE_URL}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${DEFAULT_BASE_URL}/?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  });

  // 3. NewsArticle Schema (if viewing an article)
  if (article) {
    jsonLdSchemas.push({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      '@id': `${currentUrl}#article`,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': currentUrl
      },
      headline: article.title,
      description: article.summary,
      image: [article.imageUrl],
      datePublished: article.publishedAt,
      dateModified: article.publishedAt,
      author: {
        '@type': 'Person',
        name: article.author?.name || 'Knews254 Newsroom',
        jobTitle: article.author?.role || 'Senior Journalist'
      },
      publisher: {
        '@id': `${DEFAULT_BASE_URL}/#organization`
      },
      articleSection: article.category,
      keywords: article.tags ? article.tags.join(', ') : 'Kenya News',
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.article-headline', '.article-summary']
      },
      contentLocation: {
        '@type': 'Place',
        name: article.county ? `${article.county} County, Kenya` : 'Kenya'
      }
    });
  }

  // 4. BreadcrumbList Schema
  const breadcrumbs: any[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: DEFAULT_BASE_URL
    }
  ];

  if (category && category !== 'home') {
    const catName = CATEGORY_LABEL_MAP[category]?.name || category.toUpperCase();
    breadcrumbs.push({
      '@type': 'ListItem',
      position: 2,
      name: catName,
      item: `${DEFAULT_BASE_URL}/?cat=${category}`
    });
  }

  if (article) {
    breadcrumbs.push({
      '@type': 'ListItem',
      position: breadcrumbs.length + 1,
      name: article.title,
      item: currentUrl
    });
  }

  jsonLdSchemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs
  });

  // 5. CollectionPage (if viewing a category)
  if (category && category !== 'home' && !article) {
    const catInfo = CATEGORY_LABEL_MAP[category] || { name: category, desc: pageDescription };
    jsonLdSchemas.push({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${currentUrl}#webpage`,
      name: catInfo.name,
      description: catInfo.desc,
      url: currentUrl,
      isPartOf: {
        '@id': `${DEFAULT_BASE_URL}/#website`
      }
    });
  }

  return {
    title: pageTitle,
    description: pageDescription,
    keywords,
    canonicalUrl: currentUrl,
    og: {
      title: pageTitle,
      description: pageDescription,
      url: currentUrl,
      type: article ? 'article' : 'website',
      image: articleImage,
      siteName: 'Knews254 Media Network',
      locale: 'en_KE',
      publishedTime: article?.publishedAt,
      author: article?.author?.name,
      section: article?.category || category,
      tags: article?.tags
    },
    twitter: {
      card: 'summary_large_image',
      site: '@KellyMuthomi254',
      title: pageTitle,
      description: pageDescription,
      image: articleImage
    },
    jsonLd: jsonLdSchemas
  };
}
