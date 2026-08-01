import { PRDSectionData } from '../types';

export const ALL_PRD_SECTIONS: PRDSectionData[] = [
  {
    id: 1,
    title: "1. Executive Summary",
    category: "Strategic Foundation",
    iconName: "FileText",
    overview: "Knews254 is designed as Africa's flagship high-performance digital news house, engineered to deliver lightning-fast breaking news, investigative journalism, election monitoring, and multimedia storytelling to over 10 million monthly active readers across Kenya, East Africa, and the global African diaspora.",
    details: [
      "Target Market: Kenya (47 Counties), East African Community (EAC), and Global Diaspora (USA, UK, EU, UAE).",
      "Technology Stack: Full-Stack React 19 + Express Node.js, Tailwind CSS v4, Server-side Gemini AI SDK (@google/genai), Cloud SQL / Firestore DB, and Cloud Run autoscaling.",
      "Primary Value Proposition: Zero-latency breaking updates, AI-assisted Kiswahili translation, verified non-partisan fact-checking ('Knews254 Verify'), and 47-county hyper-local reporting.",
      "Performance Benchmark: Sub-1.2 second LCP (Largest Contentful Paint) even on 3G rural mobile networks."
    ],
    deliverables: ["Platform PRD Document", "High-Availability Media Engine", "County & Election Real-Time Dashboards"]
  },
  {
    id: 2,
    title: "2. Vision Statement",
    category: "Strategic Foundation",
    iconName: "Compass",
    overview: "To be the most trusted, intelligent, accessible, and authoritative digital news platform in Africa, setting global benchmarks for digital journalism, algorithmic integrity, and civic engagement.",
    details: [
      "Eliminating digital media echo chambers through rigorous data-backed reporting.",
      "Championing journalistic transparency with open fact-check methodology and public correction logs.",
      "Bridging the diaspora-home county information gap through personalized hyper-local feeds."
    ],
    deliverables: ["Ethical Journalism Charter", "Diaspora Connectivity Strategy", "Algorithmic Neutrality Framework"]
  },
  {
    id: 3,
    title: "3. Mission Statement",
    category: "Strategic Foundation",
    iconName: "Target",
    overview: "To inform, empower, and connect millions of Africans and global citizens by delivering instant, verified, unbiased, and deeply investigative journalism across web, mobile, audio, and video formats.",
    details: [
      "Publishing multi-lingual news (English, Kiswahili, Sheng) instantly with AI translation.",
      "Empowering citizens during electoral cycles with real-time precinct-level data.",
      "Providing investigative reporters with encrypted whistleblowing and secure OSINT tools."
    ],
    deliverables: ["Multi-lingual Publishing Pipeline", "Whistleblower Vault Integration", "Civic Education Portal"]
  },
  {
    id: 4,
    title: "4. Brand Strategy & Visual Identity",
    category: "Strategic Foundation",
    iconName: "Palette",
    overview: "A sophisticated African media brand aesthetic balancing editorial authority with modern high-tech elegance. Moving away from generic SaaS templates toward high-contrast, eye-safe typography and vibrant culture-inspired color accents.",
    details: [
      "Primary Color Palette: Crimson Authority (#DC2626), Deep African Charcoal (#0F172A), Emerald Truth (#059669), Warm Canvas Gray (#F8FAFC).",
      "Typography Pairing: Plus Jakarta Sans for dense, readable UI and headlines paired with Playfair Display for editorial long-form journalism.",
      "Iconography: Clean 24px Lucide SVG set with custom status badges for verified news, breaking alerts, and fact-check verdicts."
    ],
    deliverables: ["Brand Style Guide", "Design System UI Kit", "Accessibility Color Tokens"]
  },
  {
    id: 5,
    title: "5. Business Goals & KPI Architecture",
    category: "Strategic Foundation",
    iconName: "TrendingUp",
    overview: "Metrics-driven growth strategy targeting tier-1 media monetization, premium subscriber retention, and high audience engagement.",
    details: [
      "Year 1 Goal: 5 Million Monthly Active Users (MAUs), 25 Million Pageviews, 150K Push Notification Subscribers.",
      "Engagement Targets: >3.5 pages per session, <35% bounce rate on organic search traffic, >2:45 minutes average time on page.",
      "Monetization KPIs: $4.50 eCPM across programmatic networks, 50,000 active newsletter subscribers, $120K annual direct sponsorship pipeline."
    ],
    deliverables: ["Analytics Dashboard Spec", "eCPM Optimization Engine", "Subscriber LTV Forecast Model"]
  },
  {
    id: 6,
    title: "6. User Personas",
    category: "Audience & UX",
    iconName: "Users",
    overview: "Comprehensive mapping of primary and secondary reader profiles across urban, rural, and diaspora demographics.",
    details: [
      "Persona 1: 'Wanjiku the Nairobi Tech Professional' (28yo, mobile-first, consumes quick business/tech briefs, election updates via push).",
      "Persona 2: 'Omondi the Kisumu Agribusiness Leader' (42yo, tracks county agricultural policy, climate forecasts, and commodity market prices).",
      "Persona 3: 'Amina the Diaspora Professional in London' (34yo, streams live parliamentary feeds, tracks KES exchange rates, county real estate investments).",
      "Persona 4: 'Kamau the Gen-Z Civic Activist' (21yo, consumes short video summaries, fact-check breakdowns, Sheng translations, and live blog threads)."
    ],
    deliverables: ["User Journey Maps", "Persona-Driven Feature Prioritization", "Customization Matrix"]
  },
  {
    id: 7,
    title: "7. Competitive Analysis",
    category: "Audience & UX",
    iconName: "BarChart3",
    overview: "Direct architectural positioning against legacy African news houses (Nation, Standard, Capital FM, BBC Africa) and global benchmarks (NYT, Guardian, Rest of World).",
    details: [
      "Nation / Standard Gap: Heavy ad clutter, slow mobile loading (6s+), paywalls blocking breaking news, lack of real-time AI summarization.",
      "Knews254 Advantage: Clean high-density layout, sub-1s load times, AI audio narration, interactive 47-county data maps, and transparent fact-check meters."
    ],
    deliverables: ["Feature Gap Analysis Matrix", "Performance Benchmark Study", "Ad-Density Optimization Protocol"]
  },
  {
    id: 8,
    title: "8. Comprehensive Feature Matrix",
    category: "Audience & UX",
    iconName: "Grid",
    overview: "Core system capabilities classified by release phase (MVP, Tier 2 Scale, Tier 3 Enterprise).",
    details: [
      "MVP Core: Breaking News Engine, 47 County Portal, 2027 Election Center, AI Summarizer, Knews254 Verify Fact Check, Live Blog, Audio Reader.",
      "Tier 2 Scale: WhatsApp Channel bot sync, User Account Bookmark Vault, Personalised Interest Feed, Native Video / Podcast player.",
      "Tier 3 Enterprise: Automated Election Result Precinct Scraper, Whistleblower Encrypted Dropbox, Ad Direct Bidding Portal."
    ],
    deliverables: ["MoSCoW Matrix Document", "System Capabilities Registry", "Release Schedule"]
  },
  {
    id: 9,
    title: "9. Product Roadmap (Phases 1-4)",
    category: "Audience & UX",
    iconName: "Milestone",
    overview: "36-month execution strategy from initial launch to pan-African market dominance.",
    details: [
      "Phase 1 (Months 1-3): Platform Launch, Kenya 47 County Engine, AI Summarization, Election Hub MVP.",
      "Phase 2 (Months 4-6): East African Expansion (Uganda, Tanzania, Rwanda desks), WhatsApp & Telegram bot automation.",
      "Phase 3 (Months 7-12): Native iOS & Android Apps with offline PWA sync, Knews254 Audio Podcast Studio.",
      "Phase 4 (Months 13-24): Pan-African Syndication Network, AI Investigative Document Parser."
    ],
    deliverables: ["Gantt Chart", "Sprint Backlog", "Resource Allocation Plan"]
  },
  {
    id: 10,
    title: "10. Information Architecture (IA)",
    category: "Architecture & Content",
    iconName: "Network",
    overview: "Structured taxnomical hierarchy designed for instant content discoverability, SEO crawl depth, and contextual navigation.",
    details: [
      "Root Level: Top Bar (Breaking Ticker + Currency + County Selector) -> Main Header -> Category Nav -> Hero Grid -> Beat Clusters -> Footer.",
      "Taxonomy Depth: Category (e.g. Politics) -> Subcategory (e.g. Parliament) -> Tag (e.g. Finance Bill 2026) -> County Context (e.g. Nairobi County).",
      "Dynamic Metadata Layer: Schema.org NewsArticle, LiveBlogPosting, FactCheck, ClaimReview JSON-LD markup on every page."
    ],
    deliverables: ["IA Diagram", "Taxonomy Registry", "URL Structuring Protocol"]
  },
  {
    id: 11,
    title: "11. Complete Sitemap",
    category: "Architecture & Content",
    iconName: "Map",
    overview: "Comprehensive URL mapping for all public, user, editorial, and administrative endpoints.",
    details: [
      "Public Pages: / (Home), /breaking, /politics, /elections, /counties, /counties/[county-slug], /business, /tech, /verify, /live/[blog-id], /video, /podcasts, /diaspora.",
      "Article Endpoint: /[category]/[year]/[month]/[article-slug].",
      "Administrative: /admin, /admin/editor, /admin/fact-check, /admin/analytics, /admin/ads."
    ],
    deliverables: ["XML Sitemap Generator", "Robots.txt Configuration", "Canonical Link Strategy"]
  },
  {
    id: 12,
    title: "12. Navigation Structure",
    category: "Architecture & Content",
    iconName: "Menu",
    overview: "Multi-tiered responsive header and drawer navigation system with persistent search and county quick-jump.",
    details: [
      "Utility Top Nav: Date/Time (EAT), Weather Widget, Exchange Rates (USD/KES, GBP/KES), Swahili Toggle, Night/Light Mode.",
      "Main Category Nav: Breaking, Politics, 2027 Elections, Business, Tech, Counties, Fact Check, Diaspora, Podcasts, Video.",
      "Mobile Drawer: Quick Category Grid, Saved Articles, 47 Counties Dropdown, Breaking Alert Preferences."
    ],
    deliverables: ["Header Component", "Mobile Drawer Component", "Sticky Navigation Trigger"]
  },
  {
    id: 13,
    title: "13. Complete User Journeys",
    category: "Audience & UX",
    iconName: "Route",
    overview: "End-to-end friction-free user paths for breaking news consumption, civic engagement, and fact-check verification.",
    details: [
      "Journey 1: Push Notification -> Breaking Article -> AI 30-Second Summary -> Swahili Translation -> Social Share.",
      "Journey 2: Election Search -> Kenya Map -> Presidential Candidate Compare -> County Polling Data -> Live Blog Updates.",
      "Journey 3: Social Media Claim -> Knews254 Verify Search -> Verdict Meter -> Primary Document Evidence -> Claim Submission."
    ],
    deliverables: ["Wireframe Flows", "Interaction Specifications", "Conversion Optimization Paths"]
  },
  {
    id: 14,
    title: "14. Homepage Structure",
    category: "Architecture & Content",
    iconName: "Layout",
    overview: "High-density editorial grid engineered for visual hierarchy, instant scanning, and engagement retention.",
    details: [
      "Section 1: Sticky Utility Bar + Breaking News Audio Ticker.",
      "Section 2: Hero Layout (1 Main Lead Article + 4 Secondary Breaking Stories + Live Blog Widget).",
      "Section 3: 2027 Election Center Preview & Live Polling Widget.",
      "Section 4: 47 Counties Interactive Selector & Regional Headline Carousel.",
      "Section 5: Knews254 Verify (Latest Fact-Checked Claims with Verdict Badges).",
      "Section 6: Beat Clusters (Business & Forex, Tech, Agriculture, Climate, Sports).",
      "Section 7: Knews254 TV Video Carousel & Podcast Audio Streamer."
    ],
    deliverables: ["Homepage Component Grid", "Responsive Layout Rules", "Lazy-Loading Section Pipeline"]
  },
  {
    id: 15,
    title: "15. Every Page Required (Detailed Specifications)",
    category: "Architecture & Content",
    iconName: "Layers",
    overview: "Granular blueprint for all 25+ unique view layouts across the application.",
    details: [
      "Article View: Long-form text, AI Summary Accordion, Audio TTS Narrator, Author Card, Related Investigative Series, Comment Stream.",
      "County Page View: County stats (Governor, Capital, Population), Local News Stream, County Development Tracker, MCA Directory.",
      "Election Hub View: Interactive Kenya Map, Presidential Candidate Comparison, Coalition Breakdown, Real-Time Precinct Results Counter."
    ],
    deliverables: ["View Template Inventory", "Component Modular Architecture", "Route Specs"]
  },
  {
    id: 16,
    title: "16. Admin Dashboard",
    category: "CMS & Editorial",
    iconName: "Sliders",
    overview: "Enterprise editorial command center for journalists, desk editors, fact-checkers, and site administrators.",
    details: [
      "Real-Time Metrics: Concurrent active visitors, trending articles, breaking alert dispatch monitor.",
      "Editorial Desk View: Article queue filtered by status (Draft, Under Review, Fact-Check Pending, Legal Review, Scheduled, Published).",
      "Ad Manager: Live banner impression counter, programmatic fill rate monitor, native sponsor booking."
    ],
    deliverables: ["Admin Dashboard View", "Editorial Workflow Engine", "Real-Time Traffic Monitor"]
  },
  {
    id: 17,
    title: "17. Editorial Workflow Engine",
    category: "CMS & Editorial",
    iconName: "CheckSquare",
    overview: "Rigorous 5-stage publication pipeline ensuring journalistic accuracy and legal compliance.",
    details: [
      "Stage 1: Reporter Drafts Article & Attaches Sources/Images.",
      "Stage 2: Sub-Editor Verification (Grammar, Structure, Neutrality Check).",
      "Stage 3: Knews254 Verify Desk (Cross-reference claims against public records/APIs).",
      "Stage 4: Legal Desk Clearance (for sensitive investigative/defamation stories).",
      "Stage 5: Chief Editor One-Click Push to Web, Mobile PWA, and Social Channels."
    ],
    deliverables: ["Workflow State Machine", "Audit Trail Logging System", "Role Authorization Matrix"]
  },
  {
    id: 18,
    title: "18. User Roles & Permissions",
    category: "CMS & Editorial",
    iconName: "ShieldCheck",
    overview: "Role-Based Access Control (RBAC) governing administrative, editorial, and contributor actions.",
    details: [
      "Role 1: Super Admin (System config, DB management, user access).",
      "Role 2: Editor-in-Chief (Final publish authorization, breaking ticker override).",
      "Role 3: Staff Reporter (Drafting, media upload, live blog reporting).",
      "Role 4: Fact-Checker (Verdict publishing on Knews254 Verify).",
      "Role 5: Registered Reader (Bookmarks, custom county alerts, comment voting)."
    ],
    deliverables: ["RBAC Permission Table", "JWT Auth Middleware", "Session Manager"]
  },
  {
    id: 19,
    title: "19. Database Architecture & Schema",
    category: "Engineering & Infra",
    iconName: "Database",
    overview: "Relational + Document hybrid database architecture engineered for high concurrency and sub-millisecond reads.",
    details: [
      "Primary DB: PostgreSQL / Cloud SQL for relational integrity (Articles, Users, Elections, Counties, Ad Campaign Data).",
      "Cache Layer: Redis for hot breaking news articles, live blog state, and API rate-limiting.",
      "Search Engine DB: Elasticsearch / Meilisearch for full-text search across 100,000+ historical news archives."
    ],
    deliverables: ["DB Schema DDL", "ORM Models", "Indexing Strategy"]
  },
  {
    id: 20,
    title: "20. API Planning & Integration Specs",
    category: "Engineering & Infra",
    iconName: "Code",
    overview: "RESTful and GraphQL API ecosystem supporting web clients, mobile apps, and syndication partners.",
    details: [
      "GET /api/news (Filter by category, county, breaking, limit, offset).",
      "POST /api/ai/summarize (Server-side Gemini 3.6 Flash text summarizer).",
      "GET /api/elections/polling (Live precinct polling and candidate percentages).",
      "POST /api/ai/fact-check (Knews254 Verify claim verification API)."
    ],
    deliverables: ["OpenAPI 3.0 Specification", "Rate Limiter Setup", "API Security Gateway"]
  },
  {
    id: 21,
    title: "21. Authentication & Security",
    category: "Engineering & Infra",
    iconName: "Lock",
    overview: "Bank-grade authentication for staff and seamless OAuth for readers.",
    details: [
      "Staff Auth: Multi-Factor Authentication (MFA) via TOTP, IP-whitelisted Admin routes.",
      "Reader Auth: Google OAuth 2.0, Apple ID, Magic Link passwordless authentication.",
      "JWT Architecture: Short-lived access tokens (15m) + HTTP-Only secure refresh cookies."
    ],
    deliverables: ["Auth Service Module", "MFA Setup Flow", "Token Rotation Logic"]
  },
  {
    id: 22,
    title: "22. CMS Planning & Asset Management",
    category: "CMS & Editorial",
    iconName: "FolderGit2",
    overview: "Custom headless CMS optimized for speed, inline media optimization, and automated SEO schema injection.",
    details: [
      "Rich Text Editor: Block-based editor with instant image WebP conversion, YouTube embed, Twitter/X embed, and audio player insertion.",
      "Digital Asset Management (DAM): Cloud Storage with auto-cropping for 16:9, 1:1, and 4:3 social formats."
    ],
    deliverables: ["CMS Block Editor", "Image Processing Pipeline", "CDN Caching Engine"]
  },
  {
    id: 23,
    title: "23. Election Centre 2027",
    category: "Specialized Hubs",
    iconName: "Vote",
    overview: "State-of-the-art interactive electoral portal providing real-time voter insights, precinct results, and coalition charts.",
    details: [
      "Interactive Kenya Map: Click any of 47 counties to view voter registration totals, historical voting trends, and governor races.",
      "Candidate Comparison Engine: Side-by-side manifesto comparison on economy, health, agriculture, and diaspora policy.",
      "Live Polling Tracker: Aggregated opinion poll graphs with confidence intervals and sample size metrics."
    ],
    deliverables: ["Election Centre Dashboard", "Interactive Map Component", "Poll Aggregator Engine"]
  },
  {
    id: 24,
    title: "24. Candidate Profiles & Manifesto Tracker",
    category: "Specialized Hubs",
    iconName: "UserCheck",
    overview: "Granular database profiling every presidential, gubernatorial, and senatorial candidate.",
    details: [
      "Profile Data: Background, political track record, voting history in Parliament, tax compliance, campaign funding sources.",
      "Manifesto Pledge Meter: Interactive tracker rating candidate campaign promises from 'Not Started' to 'In Progress' and 'Achieved'."
    ],
    deliverables: ["Candidate Database Schema", "Pledge Tracker Component", "Bio Card UI"]
  },
  {
    id: 25,
    title: "25. 47 County Pages Engine",
    category: "Specialized Hubs",
    iconName: "Building2",
    overview: "Hyper-local news hubs for all 47 Kenyan counties (Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, Uasin Gishu, etc.).",
    details: [
      "County Header: County flag/coat of arms, Governor, Senator, Women Rep, County Assembly seating.",
      "Local Economy Stream: Local market prices, county assembly bills, infrastructure projects, devolution budget tracking.",
      "Citizen Reporting Portal: Verified community story submissions from ground correspondents."
    ],
    deliverables: ["County Dynamic Route", "Devolution Tracker Engine", "Local News Feed"]
  },
  {
    id: 26,
    title: "26. Live Blog Engine",
    category: "Specialized Hubs",
    iconName: "Radio",
    overview: "Real-time, minute-by-minute coverage engine for breaking events, parliamentary sessions, and state addresses.",
    details: [
      "Key Features: Pinned key moments, real-time WebSocket / SSE updates, sound notifications, audience reaction counters (Like, Shock, Clap).",
      "Media Support: Live video stream overlay, photo galleries, and verified tweets."
    ],
    deliverables: ["Live Blog Component", "SSE Reader Connection", "Key Moment Filter"]
  },
  {
    id: 27,
    title: "27. AI Features (Gemini 3.6 Flash)",
    category: "AI & Innovation",
    iconName: "Sparkles",
    overview: "Integration of Google's Gemini SDK (@google/genai) for automated news summary, audio narration, and multi-lingual accessibility.",
    details: [
      "30-Second AI Brief: One-click bulleted executive summary of long 2,000-word investigative pieces.",
      "Swahili & Sheng Translation: Context-aware adaptation of news stories into Kiswahili Sanifu and popular Sheng.",
      "AI Audio Reader: Text-to-speech audio synthesis for hands-free listening during commutes."
    ],
    deliverables: ["AI Endpoint Controllers", "Client AI Modal Component", "Language Switcher"]
  },
  {
    id: 28,
    title: "28. Fact Checking System (Knews254 Verify)",
    category: "Specialized Hubs",
    iconName: "ShieldAlert",
    overview: "Dedicated anti-disinformation unit fighting fake news across social platforms during sensitive national events.",
    details: [
      "Verdict Meter: TRUE, FALSE, MISLEADING, UNVERIFIED, PARTIALLY TRUE badges with color-coded confidence indicators.",
      "Claim Review Schema: Full Google ClaimReview structured data for search engine snippet indexing.",
      "Public Claim Submission: Reader submission form for suspicious viral messages, tweets, or images."
    ],
    deliverables: ["Knews254 Verify Portal", "Claim Review JSON-LD Generator", "Verdict Card UI"]
  },
  {
    id: 29,
    title: "29. Smart Search Engine",
    category: "Engineering & Infra",
    iconName: "Search",
    overview: "Lightning-fast elastic search across 10+ years of news archives with auto-suggestions and filters.",
    details: [
      "Filters: By Date Range, Category, County, Author, Fact-Check Status, and Media Type (Text, Video, Podcast).",
      "Autocomplete: Instant search predictions matching political figures, legislation names, and county topics."
    ],
    deliverables: ["Search Interface Component", "Elastic Search Indexer", "Auto-Suggest API"]
  },
  {
    id: 30,
    title: "30. Video Platform (Knews254 TV)",
    category: "Specialized Hubs",
    iconName: "Video",
    overview: "High-definition video news portal with live broadcast feeds, field reporting clips, and documentary series.",
    details: [
      "Features: HLS video player with adaptive bitrate streaming, picture-in-picture mode, auto-generated captions.",
      "Content Beats: Daily Evening News Bulletin, Political Roundtable, Tech Review Kenya, Investigative Exposes."
    ],
    deliverables: ["Video Player Component", "Video Playlist UI", "HLS Stream Integrator"]
  },
  {
    id: 31,
    title: "31. Podcast Platform (Knews254 Audio)",
    category: "Specialized Hubs",
    iconName: "Headphones",
    overview: "On-demand audio studio hosting flagship shows on African politics, tech startup ecosystems, and cultural deep dives.",
    details: [
      "Flagship Shows: 'The Kenya Digest', 'Devolution Unfiltered', 'Silicon Savannah Tech Hour', 'Diaspora Voices'.",
      "Player Controls: Speed toggle (1x, 1.25x, 1.5x, 2x), background audio playback, transcript auto-scroll."
    ],
    deliverables: ["Podcast Player Bar", "Show Directory Page", "Audio RSS Feed Generator"]
  },
  {
    id: 32,
    title: "32. Advertising Platform & Monetization",
    category: "Monetization & Ops",
    iconName: "DollarSign",
    overview: "Non-intrusive, high-yield ad architecture compliant with Google Publisher Policies and user experience standards.",
    details: [
      "Ad Formats: Header Leaderboard (728x90), In-Read Native Sponsor Cards, Sticky Mobile Bottom Banner (320x50), Video Pre-roll.",
      "Direct Sponsor Portal: Self-service booking engine for local Kenyan corporate partners, universities, and banks."
    ],
    deliverables: ["Ad Container Components", "Header Bidding Script Integration", "Ad Analytics Dashboard"]
  },
  {
    id: 33,
    title: "33. Newsletter Platform",
    category: "Monetization & Ops",
    iconName: "Mail",
    overview: "Automated daily and weekly email newsletters tailored to reader interest segments.",
    details: [
      "Editions: 'Morning Brief' (6:00 AM EAT), 'Business & Market Wrap' (5:00 PM EAT), 'Diaspora Weekly' (Sundays).",
      "Integration: Direct sync with Mailchimp / SendGrid API with 99.4% inbox deliverability rate."
    ],
    deliverables: ["Newsletter Subscription Form", "Email Template Builder", "List Segmentation Logic"]
  },
  {
    id: 34,
    title: "34. Web Push Notification Engine",
    category: "Monetization & Ops",
    iconName: "Bell",
    overview: "Sub-second breaking news push alerts delivered to desktop and mobile browsers.",
    details: [
      "Segmented Topics: Readers choose alerts for Breaking News, Election Results, Favorite County, or Business Flash.",
      "Browser Support: Service Worker implementation supporting Chrome, Safari, Firefox, and Edge."
    ],
    deliverables: ["Service Worker Push Handler", "Alert Preference Manager", "Notification Payload Spec"]
  },
  {
    id: 35,
    title: "35. SEO Strategy & Technical Optimization",
    category: "Engineering & Infra",
    iconName: "Globe",
    overview: "Dominating search engine results pages (SERPs) for Kenyan and East African news queries.",
    details: [
      "Technical SEO: Server-rendered HTML, automated Google News XML sitemaps, Open Graph & Twitter Cards.",
      "Structured Data: Schema.org NewsArticle, BreadcrumbList, Organization, Speakable, and FactCheck JSON-LD."
    ],
    deliverables: ["SEO Schema Injection Module", "Automated Sitemap Pipeline", "Meta Tag Generator"]
  },
  {
    id: 36,
    title: "36. Accessibility Standards (WCAG 2.1 AA)",
    category: "Engineering & Infra",
    iconName: "Eye",
    overview: "Inclusive design ensuring full usability for visually impaired and motor-impaired readers.",
    details: [
      "Standards: Minimum 4.5:1 color contrast ratio across light/dark themes, screen-reader friendly ARIA labels, full keyboard navigation.",
      "Text Resizing: Built-in typography font size scaler (A- / A+)."
    ],
    deliverables: ["Accessibility Audit Checklist", "Keyboard Focus Indicators", "ARIA Label Standard"]
  },
  {
    id: 37,
    title: "37. Performance Strategy & Optimization",
    category: "Engineering & Infra",
    iconName: "Zap",
    overview: "Sub-1.2s page loads optimized for high latency 3G rural mobile networks.",
    details: [
      "Asset Optimization: Next-gen WebP/AVIF image formats, responsive image srcset, font subsetting for local Latin characters.",
      "Bundle Size: Code splitting, tree-shaking, vendor bundle isolation under 150KB initial JS footprint."
    ],
    deliverables: ["Lighthouse Audit Script", "Vite Code Splitting Config", "CDN Cache Headers"]
  },
  {
    id: 38,
    title: "38. Security & Cybersecurity Architecture",
    category: "Engineering & Infra",
    iconName: "Shield",
    overview: "Enterprise threat mitigation protecting newsroom operations during high-profile election cycles.",
    details: [
      "Threat Mitigation: Cloudflare Enterprise DDoS protection, Web Application Firewall (WAF) filtering SQLi & XSS attacks.",
      "Data Integrity: Content Security Policy (CSP) headers, HSTS enforcement, SSL/TLS 1.3 encryption."
    ],
    deliverables: ["WAF Ruleset Configuration", "Security Headers Setup", "Incident Response Protocol"]
  },
  {
    id: 39,
    title: "39. Cloud Infrastructure & DevOps",
    category: "Engineering & Infra",
    iconName: "Server",
    overview: "Auto-scaling serverless container deployment handling 100,000+ simultaneous traffic surges.",
    details: [
      "Platform: GCP Cloud Run + Cloud SQL PostgreSQL + Cloud Storage CDN.",
      "CI/CD Pipeline: GitHub Actions automated linting, unit testing, container build, and zero-downtime deployment."
    ],
    deliverables: ["Dockerfile", "Cloud Run Deploy Script", "GitHub Actions Workflow"]
  },
  {
    id: 40,
    title: "40. Analytics & Data Intelligence",
    category: "Monetization & Ops",
    iconName: "PieChart",
    overview: "Privacy-compliant reader intelligence driving editorial decision-making.",
    details: [
      "Metrics Tracked: Real-time active readers, scroll depth per article, AI summary usage, county traffic distribution.",
      "Privacy: Full GDPR and Kenya Data Protection Act 2019 compliance (cookie consent banner, anonymized IP tracking)."
    ],
    deliverables: ["Analytics Manager Module", "GDPR Cookie Banner", "Editorial Pulse Dashboard"]
  },
  {
    id: 41,
    title: "41. Monetization & Revenue Models",
    category: "Monetization & Ops",
    iconName: "CreditCard",
    overview: "Diversified revenue streams ensuring financial sustainability and editorial independence.",
    details: [
      "Stream 1: Programmatic Display & Video Advertising (Google Ad Manager, Prebid.js).",
      "Stream 2: Knews254 Premium Diaspora Club ($4.99/mo for ad-free experience + investigative deep dive PDF reports).",
      "Stream 3: Corporate Sponsored Thought Leadership & Event Partnerships."
    ],
    deliverables: ["Monetization Architecture Plan", "Subscription Gate Logic", "Corporate Media Kit"]
  },
  {
    id: 42,
    title: "42. Testing Strategy & Quality Assurance",
    category: "Engineering & Infra",
    iconName: "CheckCircle2",
    overview: "Comprehensive QA testing framework ensuring 99.99% system availability.",
    details: [
      "Test Coverage: Unit tests for core data transformers, integration tests for Gemini API routes, Cypress E2E tests for user journeys.",
      "Cross-Browser QA: Testing on mobile Chrome, Safari iOS, Opera Mini, and low-cost Android devices."
    ],
    deliverables: ["QA Test Suite Config", "E2E Test Scripts", "Device Compatibility Matrix"]
  },
  {
    id: 43,
    title: "43. Deployment & Release Plan",
    category: "Engineering & Infra",
    iconName: "Rocket",
    overview: "Zero-downtime blue/green deployment strategy for continuous platform updates.",
    details: [
      "Staging Environment: Full replica environment for editorial training and load testing.",
      "Rollout Strategy: Canary deployment routing 5% traffic to new builds before 100% promotion."
    ],
    deliverables: ["Deployment Script", "Rollback Protocol", "Launch Day Checklist"]
  },
  {
    id: 44,
    title: "44. Future Expansion & Pan-African Vision",
    category: "Strategic Foundation",
    iconName: "Sparkle",
    overview: "Scaling the Knews254 technology stack to power regional media properties across Africa.",
    details: [
      "Regional Franchises: Knews256 (Uganda), Knews255 (Tanzania), Knews250 (Rwanda).",
      "AI Innovations: Automated voice news anchor avatar for daily video briefings, satellite imagery tracking for climate news."
    ],
    deliverables: ["Multi-Tenant Architecture Spec", "Pan-African Expansion Plan", "AI Research Roadmap"]
  },
  {
    id: 45,
    title: "45. Enterprise Infrastructure Architecture & Microservices Matrix",
    category: "Engineering & Infra",
    iconName: "Server",
    overview: "Production-grade decoupled microservices topology designed for horizontal auto-scaling, zero single-point-of-failure redundancy, and sub-second global media delivery.",
    details: [
      "Decoupled Service Layers: Express API Gateway, Worker Task Queue (BullMQ + Redis), Search Node Cluster, Transcoding Worker Cluster, CDN Origin Shield, Cloud SQL Primary/Replica Topology.",
      "Horizontal Scaling: Auto-scaling Cloud Run containers scaling dynamically from 2 to 200 instances during breaking news events and national election cycles.",
      "Load Balancing & SSL: Cloud Load Balancing with managed SSL 1.3, HTTP/3 QUIC protocol support, and Cloudflare WAF DDoS mitigation."
    ],
    deliverables: ["Architecture Topology Diagram", "Terraform Infrastructure Modules", "Load Balancer Config"]
  },
  {
    id: 46,
    title: "46. Storage Strategy, Key Taxonomy & Signed Private File Security",
    category: "Engineering & Infra",
    iconName: "Database",
    overview: "Strict separation of relational transactional metadata and object storage media assets with cryptographic signed URLs for confidential newsroom assets.",
    details: [
      "Storage Separation: Relational DB stores metadata/URLs only; Cloud Object Storage holds binary assets across dual-region buckets.",
      "Key Taxonomy: Standardized directory keys (e.g., articles/images/YYYY/MM/DD/, careers/cv/, news-tips/private/, fact-checks/evidence/).",
      "Private File Vault: Encrypted 15-minute signed URLs for CVs, whistleblower documents, and legal affidavits with non-indexable X-Robots headers."
    ],
    deliverables: ["Bucket Lifecycle Rule JSON", "Signed URL Generator Module", "Media Key Taxonomy Document"]
  },
  {
    id: 47,
    title: "47. Direct Direct-to-Storage Uploads & Image Processing Pipeline",
    category: "Engineering & Infra",
    iconName: "Zap",
    overview: "Client-side signed URL media ingestion bypassing API servers with automated multi-format image variant generation and zero-CLS reservation.",
    details: [
      "Direct Upload Flow: Client requests signed upload token -> Direct upload to Object Storage -> Webhook triggers asynchronous Sharp worker.",
      "Image Variants: Automatic generation of WebP/AVIF formats at 320w, 640w, 1024w, 1920w with low-res blur-up placeholders (LQIP).",
      "Layout Shift Prevention: Enforced width/height aspect-ratio containers in UI components ensuring 0.00 Cumulative Layout Shift (CLS)."
    ],
    deliverables: ["Direct Upload SDK Helper", "Sharp Image Transformer Worker", "LQIP Generator Function"]
  },
  {
    id: 48,
    title: "48. Video Transcoding, HLS Adaptive Bitrate & Audio Streaming",
    category: "Engineering & Infra",
    iconName: "Radio",
    overview: "Scalable video/audio processing pipeline transcoding raw 4K broadcasts into HLS multi-bitrate streams for smooth playback across 2G-5G mobile networks.",
    details: [
      "Transcoding Quality Ladder: H.264/AAC variants at 1080p (4.5Mbps), 720p (2.2Mbps), 480p (800kbps), 360p (400kbps) with VTT captions.",
      "Adaptive Bitrate: HLS manifest (.m3u8) streaming with bandwidth-aware quality switching and error recovery in HTML5 player.",
      "Audio & Podcast Subsystem: 320kbps AAC podcast audio with WebVTT timestamped transcript generation for search indexing."
    ],
    deliverables: ["FFmpeg Transcoding Pipeline", "HLS Stream Player Component", "VTT Transcript Generator"]
  },
  {
    id: 49,
    title: "49. Multi-Layer Caching & Surgical CDN Invalidation Pipeline",
    category: "Engineering & Infra",
    iconName: "Layers",
    overview: "4-tier caching architecture (Browser, CDN Edge, Redis Application Cache, DB Query Cache) with surgical URL purging upon content publication.",
    details: [
      "Caching Tiers: Immutable 1-year browser cache for versioned JS/CSS/Fonts; 10-minute stale-while-revalidate for CDN html pages; Redis hot key cache for trending news.",
      "Surgical Invalidation: Publishing an article triggers targeted edge cache purging for specific article slug, home feed, category, and county tags without flushing global CDN.",
      "High-Traffic Cache Shields: Micro-caching (10-second SWR) for breaking news live feeds preventing database thundering herd."
    ],
    deliverables: ["Redis Caching Middleware", "Cloudflare Purge API Integration", "Micro-Caching Wrapper"]
  },
  {
    id: 50,
    title: "50. Database Schema Optimization, Indexing & Time-Based Partitioning",
    category: "Engineering & Infra",
    iconName: "Database",
    overview: "High-performance PostgreSQL / Cloud SQL schema design utilizing composite indexes, read-replica routing, and automated table partitioning.",
    details: [
      "Composite Indexing: B-tree indexes on (status, published_at DESC), (category_id, status), (county_slug, published_at), and (candidate_id, precinct_id).",
      "Read Replica Routing: Read queries automatically routed to 3 read replicas; writes directed exclusively to Primary DB node.",
      "Table Partitioning: Range partitioning by month for audit_logs, visitor_analytics, and election_raw_votes tables to maintain constant O(log N) query times."
    ],
    deliverables: ["PostgreSQL Schema DDL", "Drizzle Composite Indexes", "Partitioning Maintenance Script"]
  },
  {
    id: 51,
    title: "51. Asynchronous Search Indexing & Typo-Tolerant Engine",
    category: "Engineering & Infra",
    iconName: "Search",
    overview: "Sub-50ms full-text search cluster supporting Kiswahili/English stemming, typo tolerance, and county/topic facet filtering.",
    details: [
      "Indexing Pipeline: Async BullMQ background jobs index articles on publish/update events without delaying editorial publishing response times.",
      "Search Capabilities: Fuzzy matching (Levenshtein distance 2), prefix search, category/county facet counts, and relevance boost for breaking news."
    ],
    deliverables: ["Search Indexing Worker", "Fuzzy Search Query Transformer", "Facet Aggregation Module"]
  },
  {
    id: 52,
    title: "52. Durable Background Job Queue & Timezone Scheduled Publishing",
    category: "Engineering & Infra",
    iconName: "Clock",
    overview: "Resilient job processing infrastructure handling scheduled article releases, bulk push notifications, and email newsletter distribution.",
    details: [
      "Queue Engine: BullMQ backed by Redis Cluster with exponential backoff retries, dead-letter queues (DLQ), and task concurrency controls.",
      "Scheduled Publishing: Cron worker evaluating scheduled articles every 30 seconds with UTC/EAT timezone handling and lock-based execution."
    ],
    deliverables: ["BullMQ Queue Manager", "Scheduled Publishing Cron Job", "Dead Letter Queue Monitor"]
  },
  {
    id: 53,
    title: "53. High-Traffic Spike Shield Mode & Graceful Degradation",
    category: "Engineering & Infra",
    iconName: "ShieldCheck",
    overview: "Automated emergency protection protocol preserving site availability during 10x traffic surges during breaking political events.",
    details: [
      "Shield Mode Activation: Triggered automatically when CPU > 85% or RPS > 50,000 requests per second.",
      "Graceful Degradation: Temporarily disables non-critical widgets (comments, recommendations, real-time poll counters), switches rendering to 100% static CDN edge cache, and prioritizes breaking news text delivery."
    ],
    deliverables: ["High-Traffic Shield Middleware", "Static Fallback Engine", "Load Throttling Circuit Breaker"]
  },
  {
    id: 54,
    title: "54. Disaster Recovery, Backup Lifecycle & Point-in-Time Recovery",
    category: "Engineering & Infra",
    iconName: "RefreshCw",
    overview: "RTO < 15 minutes and RPO < 5 minutes recovery framework with automated cross-region database snapshotting and soft-delete protection.",
    details: [
      "Backup Cadence: Continuous Write-Ahead Log (WAL) archiving + 6-hour automated DB snapshots replicated to dual-region GCS buckets.",
      "Restore Verification: Weekly automated test restorations into isolated staging environments validating data integrity.",
      "Soft Delete Protection: 30-day soft-deletion window for articles, candidate files, and whistleblower logs before permanent purging."
    ],
    deliverables: ["Backup Automation Script", "Disaster Recovery Runbook", "Restore Test Validator"]
  },
  {
    id: 55,
    title: "55. 5-Stage Scalability Roadmap (Launch to 50M+ Pan-African Readers)",
    category: "Engineering & Infra",
    iconName: "TrendingUp",
    overview: "Comprehensive growth roadmap scaling computing resources, storage capacity, and regional edge presence across 5 growth tiers.",
    details: [
      "Stage 1 (Launch): 50K MAU • Single Cloud Run Instance + Cloud SQL Starter • 50GB Object Storage • $80/mo.",
      "Stage 2 (Growth): 500K MAU • Auto-scaling 2-10 instances + Read Replica + Redis Cache • 500GB Storage • $350/mo.",
      "Stage 3 (National Leader): 5M MAU • 20 instances + Search Cluster + CDN Origin Shield • 5TB Media Storage • $1,800/mo.",
      "Stage 4 (Election Peak): 25M MAU • 200 instances + Multi-region DB + Dedicated Transcoding Cluster • 25TB Storage • $6,500/mo.",
      "Stage 5 (Pan-African Expansion): 50M+ MAU • Multi-tenant East Africa Edge nodes (Kenya, Uganda, Tanzania, Rwanda) • 100TB Storage • $18,000/mo."
    ],
    deliverables: ["Scalability Capacity Planning Model", "Infrastructure Cost Projections", "Pan-African Edge Expansion Plan"]
  }
];
