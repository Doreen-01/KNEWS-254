export type NewsCategory =
  | 'home'
  | 'breaking'
  | 'latest'
  | 'blog'
  | 'politics'
  | 'elections'
  | 'business'
  | 'economy'
  | 'technology'
  | 'ai'
  | 'sports'
  | 'football'
  | 'rugby'
  | 'athletics'
  | 'entertainment'
  | 'celebrity'
  | 'lifestyle'
  | 'health'
  | 'education'
  | 'agriculture'
  | 'climate'
  | 'environment'
  | 'crime'
  | 'investigations'
  | 'opinion'
  | 'editorials'
  | 'fact-checking'
  | 'podcasts'
  | 'videos'
  | 'gallery'
  | 'live'
  | 'county'
  | 'international'
  | 'diaspora'
  | 'authors'
  | 'about'
  | 'contact'
  | 'advertise'
  | 'careers'
  | 'editorial-policy'
  | 'ethics-policy'
  | 'privacy-policy'
  | 'cookie-policy'
  | 'terms-of-service'
  | 'corrections-policy'
  | 'ai-policy'
  | 'factcheck-methodology'
  | 'anonymous-sources'
  | 'transparency-report'
  | 'funding-policy'
  | 'community-guidelines'
  | 'takedown-policy'
  | 'reviews'
  | 'how-we-review'
  | 'faq'
  | 'help-center';

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  email?: string;
  twitter?: string;
  website?: string;
  location: string;
  articlesCount: number;
  featuredBeats: string[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: NewsCategory;
  subcategory?: string;
  additionalCategories?: NewsCategory[];
  author: {
    id?: string;
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  scheduledFor?: string;
  readTime: string;
  imageUrl: string;
  imageCaption?: string;
  galleryImages?: string[];
  videoUrl?: string;
  location?: string;
  county?: string;
  isBreaking?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  isOpinion?: boolean;
  isEditorPick?: boolean;
  factCheckStatus?: 'TRUE' | 'FALSE' | 'MISLEADING' | 'UNVERIFIED' | 'PARTIALLY TRUE';
  viewCount: number;
  tags: string[];
}

export interface GalleryAlbum {
  id: string;
  title: string;
  category: string;
  photographer: string;
  date: string;
  coverImage: string;
  images: { url: string; caption: string }[];
  description: string;
}

export interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Remote';
  description: string;
  requirements: string[];
  postedDate: string;
}

export interface CmsCategoryItem {
  id: string;
  slug: NewsCategory;
  name: string;
  description: string;
  subcategories: string[];
  articleCount: number;
}

export interface CountyData {
  id: string;
  code: number;
  name: string;
  capital: string;
  governor: string;
  region: 'Nairobi' | 'Central' | 'Coast' | 'Eastern' | 'North Eastern' | 'Nyanza' | 'Rift Valley' | 'Western';
  population: string;
  keySectors: string[];
  headline: string;
  newsCount: number;
}

export interface ElectionCandidate {
  id: string;
  name: string;
  position: 'Presidential' | 'Gubernatorial' | 'Senatorial' | 'Women Rep';
  party: string;
  coalition: string;
  pollPercentage: number;
  runningMate?: string;
  keyPolicies: string[];
  photoUrl: string;
  county?: string;
}

export interface FactCheckItem {
  id: string;
  claim: string;
  claimant: string;
  claimSource: string;
  claimDate: string;
  verdict: 'TRUE' | 'FALSE' | 'MISLEADING' | 'UNVERIFIED' | 'PARTIALLY TRUE';
  explanation: string;
  evidence: string[];
  factChecker: string;
  articleLink?: string;
}

export interface LiveBlogUpdate {
  id: string;
  timestamp: string;
  title: string;
  content: string;
  author: string;
  isKeyMoment: boolean;
  imageUrl?: string;
  reactionCount: {
    like: number;
    shock: number;
    clap: number;
  };
}

export interface VideoClip {
  id: string;
  title: string;
  duration: string;
  thumbnailUrl: string;
  category: NewsCategory;
  views: string;
  publishedAt: string;
  presenter: string;
  youtubeId?: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  showName: string;
  episodeNumber: number;
  duration: string;
  coverUrl: string;
  publishedAt: string;
  summary: string;
  host: string;
  audioUrl?: string;
}

export interface PRDSectionData {
  id: number;
  title: string;
  category: string;
  iconName: string;
  overview: string;
  details: string[];
  deliverables: string[];
  architectureNotes?: string;
}
