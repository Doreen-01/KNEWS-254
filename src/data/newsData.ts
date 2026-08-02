import { Article, CountyData, ElectionCandidate, FactCheckItem, LiveBlogUpdate, VideoClip, PodcastEpisode, Author, GalleryAlbum, JobListing, CmsCategoryItem } from '../types';

export const AUTHORS_LIST: Author[] = [
  {
    id: "auth-0",
    name: "Kelly Muthomi Kinoti",
    role: "Founder, Chairman & Super Administrator",
    bio: "Visionary creator of Knews254, Educator, Lead Full-Stack Software Developer, and Academic Research Analyst bridging digital media, ICT innovation, and quantitative data analytics.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    email: "kellymuthomi22@gmail.com",
    twitter: "@KellyMuthomi254",
    website: "https://kelly-muthomi-kinoti.vercel.app/",
    location: "Nairobi HQ",
    articlesCount: 420,
    featuredBeats: ["technology", "ai", "elections", "investigations", "business"]
  },
  {
    id: "auth-eic-1",
    name: "Muchui Mwirigi",
    role: "Editor-in-Chief & Community Moderator",
    bio: "Head of Editorial Operations, Community Moderation, Reader Safety, Executive Desk Review, and Investigative Oversight at Knews254 Media Group.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    email: "muchuidk@gmail.com",
    twitter: "@MuchuiMwirigi",
    location: "Nairobi HQ • Executive Editorial & Moderation Desk",
    articlesCount: 310,
    featuredBeats: ["politics", "investigations", "editorial", "governance", "community-moderation"]
  },
  {
    id: "auth-support-1",
    name: "Doreen Ngugi Nkonge",
    role: "Customer Support Officer",
    bio: "Head of Reader Assistance, Customer Service Operations, and Public Communication at Knews254 Media Group.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    email: "doreenngugi38@gmail.com",
    twitter: "@DoreenNgugi254",
    location: "Nairobi HQ",
    articlesCount: 64,
    featuredBeats: ["help-center", "community-guidelines", "faq", "feedback"]
  },
  {
    id: "auth-fact-1",
    name: "Alfred Mwenda",
    role: "Managing Editor & Senior Fact Checker (Verification Lead)",
    bio: "Managing Editor and Head of Knews254 Verify, leading newsroom editorial management, digital forensics, viral claim debunking, image authentication, and OSINT verification across East Africa.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    email: "alfredmwenda684@gmail.com",
    twitter: "@AlfredMwendaVerify",
    location: "Nairobi HQ • Managing Editorial & Fact Check Desk",
    articlesCount: 112,
    featuredBeats: ["managing-editor", "fact-check", "investigations", "digital-forensics", "media-literacy"]
  },
  {
    id: "auth-legal-1",
    name: "Linah Kawira",
    role: "Legal Reviewer & Compliance Officer",
    bio: "Head of Legal Compliance, Rights Management, and Press Freedom Protection at Knews254 Media Group.",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80",
    email: "linahkawira14@gmail.com",
    twitter: "@LinahKawiraLegal",
    location: "Nairobi HQ • Legal Desk",
    articlesCount: 45,
    featuredBeats: ["legal", "compliance", "copyright", "press-freedom"]
  },
  {
    id: "auth-hr-1",
    name: "Joy Mwiti",
    role: "Human Resource Manager & Talent Director",
    bio: "Director of HR Operations, Staff Recruitment, Editorial Talent Acquisition, and Organizational Development at Knews254 Media Group.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
    email: "joy.mwiti@knews254.co.ke",
    twitter: "@JoyMwitiHR",
    location: "Nairobi HQ • HR Desk",
    articlesCount: 38,
    featuredBeats: ["careers", "talent-acquisition", "hr-policy", "staff-welfare"]
  },
  {
    id: "auth-ad-rep-1",
    name: "Scholastica Karwitha",
    role: "Advertising Manager & Chief Reporter / Chief Journalist",
    bio: "Head of Advertising Operations and Chief Newsroom Reporter / Chief Journalist at Knews254 Media Group. Oversees commercial revenue, brand partnerships, and leads all newsroom journalists, field reporters, and regional correspondents under her direct editorial reporting structure.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    email: "scholasticakarwitha@gmail.com",
    twitter: "@ScholasticaKarwitha",
    location: "Nairobi HQ • Advertising & Chief Reporters Desk",
    articlesCount: 156,
    featuredBeats: ["advertising", "investigative-reporting", "breaking-news", "field-journalism", "newsroom-bureau"]
  }
];

export const FEATURED_ARTICLES: Article[] = [
  {
    id: "art-infotrak-poll-2026",
    title: "Infotrak Voice of the People Poll: Sifuna Surges in National Public Approval as Ruto Face Dissatisfaction Over SHIF Levies",
    slug: "infotrak-poll-sifuna-surges-ruto-dissatisfaction-shif",
    summary: "Latest Infotrak Research & Consulting national survey shows ODM Secretary-General Edwin Sifuna leading opposition approval metrics while public confidence in the executive faces sharp economic headwinds.",
    content: "Nairobi, Kenya — A newly released national governance and opinion audit by Infotrak Research & Consulting has signaled major shifts in Kenya's political landscape.\n\nAccording to the poll released on state and private media networks—including live broadcasts on Citizen TV, NTV Kenya, and TV47—Nairobi Senator Edwin Sifuna has experienced a significant surge in public approval rating, polling at 42.5% among opposition figures and youth demographics across 47 counties.\n\nMeanwhile, public dissatisfaction with executive performance has risen to 62.4%, driven primarily by the transition from NHIF to the Social Health Insurance Fund (SHIF), high cost of essential commodities, and housing levy deductions. President William Ruto's confidence index stands at 27.8%, while Wiper leader Kalonzo Musyoka maintains strong regional backing at 35.8%.\n\nInfotrak Chief Executive Angela Ambitho noted during the live press briefing at Nairobi's Serena Hotel that the poll sampled 12,400 registered voters across all 47 counties with a margin of error of +/- 1.8%.",
    category: "politics",
    subcategory: "Opinion Polls & Research",
    additionalCategories: ["breaking", "latest", "elections"],
    author: {
      id: "auth-tv47-cit",
      name: "Media Syndication Desk (Citizen Digital & TV47)",
      role: "Political Bureau & Data Analytics Desk",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
    },
    publishedAt: "2026-08-02T01:15:00Z",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&auto=format&fit=crop&q=80",
    imageCaption: "Infotrak Research poll briefing broadcast live on Citizen TV, NTV Kenya, and TV47.",
    location: "Nairobi Serena Hotel",
    county: "Nairobi",
    isTrending: true,
    isFeatured: true,
    viewCount: 38900,
    tags: ["Infotrak Poll", "Edwin Sifuna", "Ruto Approval", "Citizen TV", "NTV Kenya", "TV47"]
  },
  {
    id: "art-media-tv47-ntv",
    title: "Citizen TV, NTV Kenya & TV47 Joint Coverage: Parliament Debates Emergency Economic Stabilisation Bill",
    slug: "citizen-tv-ntv-tv47-parliament-economic-bill-debate",
    summary: "Live broadcast coverage from Parliament Buildings shows MPs across party divides pushing for immediate tax relief and audit of county funds allocation.",
    content: "In a rare joint live broadcast across Kenya's leading television networks—Citizen TV, NTV Kenya, and TV47—lawmakers engaged in intense debate over the 2026 Economic Stabilisation & Small Business Protection Bill.\n\nSenator Edwin Sifuna and Trans Nzoia Governor George Natembeya urged the National Assembly to prioritize zero-rated agricultural inputs for coffee, maize, and tea farmers. The live coverage attracted millions of viewers streaming via YouTube, digital apps, and terrestrial television.",
    category: "politics",
    subcategory: "Parliamentary Debates",
    additionalCategories: ["breaking", "latest", "business"],
    author: {
      id: "auth-ntv-desk",
      name: "Knews254 Joint Newsroom (NTV & Citizen Desk)",
      role: "Parliamentary Affairs Team",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
    },
    publishedAt: "2026-08-01T18:40:00Z",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=1200&auto=format&fit=crop&q=80",
    imageCaption: "Parliament Buildings, Nairobi during live broadcast on NTV Kenya, Citizen TV, and TV47.",
    location: "Parliament Buildings, Nairobi",
    county: "Nairobi",
    isTrending: true,
    isFeatured: true,
    viewCount: 24100,
    tags: ["Citizen TV", "NTV Kenya", "TV47", "Parliament", "Edwin Sifuna", "Natembeya"]
  },
  {
    id: "art-blog-1",
    title: "The Future of Citizen Journalism in Kenya: Why Every Voice Across 47 Counties Matters",
    slug: "future-of-citizen-journalism-in-kenya-blog",
    summary: "Reflections on how digital publishing, independent bloggers, and county contributors are democratizing news coverage from Turkana to Kwale.",
    content: "In an era of rapid technological transformation, the power to document story dispatches is no longer confined to traditional newsrooms in Nairobi CBD. From local community leaders in Marsabit to tech innovators in Eldoret, citizen bloggers and independent opinion writers are filling critical information gaps.\n\nAt Knews254, our open Editorial CMS empowers journalists, opinion leaders, and community members to submit analytical posts, opinion columns, and field reports. By combining rigorous fact verification with diverse community viewpoints, we are building Kenya's most inclusive digital publishing platform.",
    category: "blog",
    subcategory: "Opinion & Columns",
    additionalCategories: ["opinion", "latest"],
    author: {
      id: "auth-0",
      name: "Kelly Muthomi Kinoti",
      role: "Founder, Chairman & Super Administrator",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
    },
    publishedAt: "2026-08-01T10:00:00Z",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80",
    imageCaption: "Digital journalism and independent blogging in Kenya.",
    location: "Nairobi HQ",
    county: "Nairobi",
    isTrending: true,
    isFeatured: true,
    viewCount: 15400,
    tags: ["Blog", "Citizen Journalism", "Knews254", "Opinion", "47 Counties"]
  },
  {
    id: "art-blog-2",
    title: "How Responsible AI and Human Moderation Safeguard Kenya's Public Sphere",
    slug: "responsible-ai-and-human-moderation-blog",
    summary: "An insider look into Knews254's dual verification engine: combining advanced AI anomaly detection with human editorial oversight.",
    content: "As artificial intelligence reshapes online content creation, the threat of deepfakes, synthetic misinformation, and unverified rumors poses a challenge to election integrity and public trust. \n\nOur editorial board employs a hybrid verification protocol: AI models rapidly triage viral claims and extract key entity references, while senior fact-checkers and legal compliance officers conduct rigorous manual OSINT audits. This blog dispatch explores the technical and ethical principles guiding our newsroom.",
    category: "blog",
    subcategory: "Tech & Media Blog",
    additionalCategories: ["technology", "ai", "opinion"],
    author: {
      id: "auth-eic-1",
      name: "Muchui Mwirigi",
      role: "Editor-in-Chief & Community Moderator",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
    },
    publishedAt: "2026-07-31T14:20:00Z",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&auto=format&fit=crop&q=80",
    imageCaption: "Newsroom editorial desk and verification workstation.",
    location: "Nairobi",
    county: "Nairobi",
    isTrending: false,
    isFeatured: true,
    viewCount: 9800,
    tags: ["AI Ethics", "Media Literacy", "Editorial Blog", "Fact Checking"]
  },
  {
    id: "art-1",
    title: "Kenya Central Bank Holds Benchmark Rate at 12.0% as Shilling Gains Against Major Currencies",
    slug: "cbk-benchmark-rate-held-shilling-gains",
    summary: "The Monetary Policy Committee (MPC) cited stabilizing inflation at 4.3% and steady tea, coffee, and horticulture export revenues driving KES resilience.",
    content: "The Central Bank of Kenya (CBK) Monetary Policy Committee (MPC) met today and elected to hold the Central Bank Rate (CBR) unchanged at 12.00 percent. CBK Governor Dr. Kamau Thugge highlighted that foreign exchange reserves stand strong at $8.45 billion, equivalent to 4.5 months of import cover.\n\nKey export sectors including horticulture, tea, and tourism posted a 14% year-on-year surge in dollar earnings, while diaspora remittances reached a record $420 million in the previous month. Economic analysts at Genghis Capital noted that the decision provides borrowing predictability for local businesses expanding across the East African Community (EAC).",
    category: "business",
    subcategory: "Banking & Markets",
    additionalCategories: ["economy", "latest"],
    author: {
      id: "auth-ad-rep-1",
      name: "Scholastica Karwitha",
      role: "Advertising Manager & Chief Reporter / Chief Journalist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
    },
    publishedAt: "2026-07-31T21:15:00Z",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80",
    imageCaption: "Central Bank of Kenya headquarters in Nairobi CBD.",
    location: "Nairobi",
    county: "Nairobi",
    isBreaking: true,
    isTrending: true,
    isFeatured: true,
    viewCount: 42800,
    tags: ["CBK", "Inflation", "Kenyan Shilling", "Economy", "Banking"]
  },
  {
    id: "art-2",
    title: "IEBC Announces 2027 Voter Registration Audit & Biometric System Upgrades",
    slug: "iebc-2027-voter-registration-audit-biometrics",
    summary: "The Electoral and Boundaries Commission reveals a new public portal allowing citizens across 47 counties to verify voting centers via USSD and web app.",
    content: "With the 2027 General Election approaching, the Independent Electoral and Boundaries Commission (IEBC) has launched a nationwide audit of the voter register. The commission confirmed that 2.1 million new young voters have been registered across higher learning institutions and county desks.\n\nFurthermore, IEBC Chief Executive Officer confirmed the deployment of updated KIEMS biometric kits equipped with solar charging capacity and dual SIM satellite redundancy to eliminate network dead zones in remote wards of Turkana, Mandera, and Marsabit counties.",
    category: "elections",
    subcategory: "2027 Polls",
    additionalCategories: ["politics", "latest"],
    author: {
      id: "auth-eic-1",
      name: "Muchui Mwirigi",
      role: "Editor-in-Chief & Community Moderator",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
    },
    publishedAt: "2026-07-31T19:40:00Z",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&auto=format&fit=crop&q=80",
    imageCaption: "IEBC tallying center technology briefing.",
    location: "Nairobi",
    county: "Nairobi",
    isTrending: true,
    isFeatured: true,
    viewCount: 38900,
    tags: ["IEBC", "2027 Elections", "Voter Registration", "Biometrics"]
  },
  {
    id: "art-3",
    title: "Konza Technopolis Welcomes $150M Pan-African AI & Supercomputing Research Facility",
    slug: "konza-technopolis-150m-ai-supercomputer-center",
    summary: "A joint venture between the Ministry of ICT, global tech giants, and regional universities positions Kenya as Africa's premier artificial intelligence hub.",
    content: "Silicon Savannah received a massive boost today as construction officially commenced on the Pan-African Supercomputing & AI Lab at Konza Technopolis in Machakos County. The facility will house a GPU cluster capable of 50 petaflops, enabling local engineers to train large language models (LLMs) in African indigenous languages including Kiswahili, Dholuo, Kikuyu, and Oromo.\n\nCabinet Secretary for ICT highlighted that the center will train over 10,000 young developers annually, boosting software export revenue and accelerating e-government automation.",
    category: "ai",
    subcategory: "AI & LLMs",
    additionalCategories: ["technology", "latest"],
    author: {
      id: "auth-0",
      name: "Kelly Muthomi Kinoti",
      role: "Founder, Chairman & Super Administrator",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
    },
    publishedAt: "2026-07-31T18:00:00Z",
    readTime: "3 min read",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
    imageCaption: "Server infrastructure at Konza Technopolis Data Center.",
    location: "Konza",
    county: "Machakos",
    isTrending: true,
    isFeatured: true,
    viewCount: 29400,
    tags: ["Konza", "Tech", "Artificial Intelligence", "Machakos", "Silicon Savannah"]
  },
  {
    id: "art-4",
    title: "Harambee Stars Seal Epic 2-1 Comeback Victory Against Uganda Cranes to Advance to CHAN Knockouts",
    slug: "harambee-stars-victory-chan-knockouts",
    summary: "A blistering second-half header from skipper Michael Olunga and a stunning free-kick from Eric Ouma sent Nyayo National Stadium into wild celebrations.",
    content: "Kenya's national football team Harambee Stars produced an unforgettable performance at Nyayo Stadium, coming from behind to defeat traditional rivals Uganda Cranes 2-1 in a thrilling East African derby.\n\nWith this victory, Kenya tops Group B and secures a coveted berth in the quarter-finals. Head Coach praised the squad's tactical discipline and physical resilience under intense pressure.",
    category: "football",
    subcategory: "National Team",
    additionalCategories: ["sports", "latest", "breaking"],
    author: {
      id: "auth-ad-rep-1",
      name: "Scholastica Karwitha",
      role: "Advertising Manager & Chief Reporter / Chief Journalist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
    },
    publishedAt: "2026-07-31T17:20:00Z",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80",
    imageCaption: "Harambee Stars celebrating victory at Nyayo National Stadium.",
    location: "Nairobi",
    county: "Nairobi",
    isBreaking: true,
    isTrending: true,
    viewCount: 32100,
    tags: ["Harambee Stars", "Football", "CHAN", "Kenya vs Uganda"]
  },
  {
    id: "art-5",
    title: "Kenya Sevens Rugby Qualifies for World Rugby Sevens Series Championship Final in London",
    slug: "kenya-sevens-qualifies-world-series-final",
    summary: "Shujaa produced a dominant 24-12 victory over Fiji in the semi-finals driven by explosive tries from Patrick Odongo.",
    content: "Kenya's national rugby sevens team, Shujaa, delivered a masterclass in physical power and blistering pace at Twickenham, stunning Olympic champions Fiji 24-12.\n\nThe victory catapults Shujaa into the HSBC World Sevens Series final match, earning praise from rugby legends worldwide for their ferocious defense and fluid counter-attacking style.",
    category: "rugby",
    subcategory: "Kenya Sevens",
    additionalCategories: ["sports", "latest"],
    author: {
      id: "auth-ad-rep-1",
      name: "Scholastica Karwitha",
      role: "Advertising Manager & Chief Reporter / Chief Journalist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
    },
    publishedAt: "2026-07-31T15:45:00Z",
    readTime: "3 min read",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&auto=format&fit=crop&q=80",
    imageCaption: "Shujaa player diving over the try line.",
    location: "London",
    viewCount: 25400,
    tags: ["Shujaa", "Rugby", "Kenya 7s", "World Rugby"]
  },
  {
    id: "art-6",
    title: "Faith Kipyegon & Beatrice Chebet Smash World Records at Diamond League Meeting in Monaco",
    slug: "faith-kipyegon-beatrice-chebet-world-record-monaco",
    summary: "Kenya's distance queens rewrite athletics history once again with breathtaking tactical runs in the 1500m and 5000m events.",
    content: "Two-time Olympic champion Faith Kipyegon shattered her own world record in the women's 1500m, stopping the clock at 3:48.62 in Monaco. Just 40 minutes later, world cross-country star Beatrice Chebet delivered a stunning solo run in the 5000m to take gold.\n\nEldoret and Iten training camps exploded into celebration as track fans celebrated Kenya's undisputed global distance running dominance.",
    category: "athletics",
    subcategory: "Track & Field",
    additionalCategories: ["sports", "latest"],
    author: {
      id: "auth-ad-rep-1",
      name: "Scholastica Karwitha",
      role: "Advertising Manager & Chief Reporter / Chief Journalist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
    },
    publishedAt: "2026-07-31T14:10:00Z",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80",
    imageCaption: "Faith Kipyegon holding the national flag after world record victory.",
    location: "Monaco / Eldoret",
    county: "Uasin Gishu",
    isTrending: true,
    viewCount: 36700,
    tags: ["Faith Kipyegon", "Athletics", "Diamond League", "Eldoret"]
  },
  {
    id: "art-7",
    title: "Afrobeats & Bongo Flava Megastars Announce Joint 'East Africa One' Music Festival in Naivasha",
    slug: "east-africa-one-music-festival-naivasha",
    summary: "Over 50,000 music enthusiasts expected as Sauti Sol, Diamond Platnumz, Burna Boy, and Nyashinski headline lakeside spectacle.",
    content: "Naivasha's Hell's Gate National Park backdrop is set to host the largest musical extravaganza in East Africa this December. Tourism stakeholders report that hotel bookings across Nakuru County have already surged by 80%.",
    category: "entertainment",
    subcategory: "Music & Concerts",
    additionalCategories: ["celebrity", "lifestyle"],
    author: {
      id: "auth-ad-rep-1",
      name: "Scholastica Karwitha",
      role: "Advertising Manager & Chief Reporter / Chief Journalist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
    },
    publishedAt: "2026-07-31T12:30:00Z",
    readTime: "3 min read",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
    imageCaption: "Concert stage crowd during night music festival in Naivasha.",
    location: "Naivasha",
    county: "Nakuru",
    viewCount: 21900,
    tags: ["Music", "Naivasha", "Sauti Sol", "Entertainment"]
  },
  {
    id: "art-8",
    title: "Ministry of Health Launches Universal Cervical Cancer & HPV Vaccination Campaign across 47 Counties",
    slug: "ministry-of-health-universal-cancer-vaccination",
    summary: "Free screening clinics and mobile immunization vans dispatched to primary schools and county referral hospitals.",
    content: "The Cabinet Secretary for Health officially flagged off the national HPV screening and preventive care drive in Machakos County today. Over 1.5 million young girls aged 9 to 14 will receive free doses to eliminate cervical cancer by 2030.",
    category: "health",
    subcategory: "Public Health",
    additionalCategories: ["lifestyle", "latest"],
    author: {
      id: "auth-support-1",
      name: "Doreen Ngugi Nkonge",
      role: "Customer Support Officer",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
    },
    publishedAt: "2026-07-31T11:00:00Z",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80",
    imageCaption: "Healthcare worker administering vaccine at county clinic.",
    location: "Machakos",
    county: "Machakos",
    viewCount: 18400,
    tags: ["Health", "MoH", "Vaccination", "Cancer Screening"]
  },
  {
    id: "art-9",
    title: "DCI Uncovers Ksh 1.2B Cyber-Fraud Syndicate Targeting Sacco Digital Wallets in Cyber-Forensics Raid",
    slug: "dci-cyber-fraud-syndicate-raid-sacco-wallets",
    summary: "Detectives from the Anti-Banking Fraud Unit arrest six suspects and seize high-powered servers in Kasarani estate.",
    content: "Directorate of Criminal Investigations (DCI) officers executed a dawn raid in Kasarani, Nairobi, uncovering a sophisticated network that intercepted mobile banking transactions of agricultural Saccos across Central Kenya. Digital forensic teams recovered encrypted hard drives and SIM-swapping hardware.",
    category: "crime",
    subcategory: "Cybercrime",
    additionalCategories: ["investigations", "latest"],
    author: {
      id: "auth-fact-1",
      name: "Alfred Mwenda",
      role: "Managing Editor & Senior Fact Checker (Verification Lead)",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80"
    },
    publishedAt: "2026-07-31T09:30:00Z",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80",
    imageCaption: "DCI cyber forensics officers analyzing server equipment.",
    location: "Nairobi",
    county: "Nairobi",
    isTrending: true,
    viewCount: 28900,
    tags: ["DCI", "Crime", "Cybersecurity", "Sacco Fraud"]
  },
  {
    id: "art-10",
    title: "OPINION: Why East Africa's Monetary Integration Demands Fiscal Discipline Across All EAC Partner States",
    slug: "opinion-eac-monetary-integration-fiscal-discipline",
    summary: "Renowned economist Dr. Bitange Ndemo argues that a single currency require strict compliance with deficit ceilings and debt sustainability rules.",
    content: "As discussions surrounding the proposed East African Single Currency advance, partner states must acknowledge that monetary union is not merely a symbolic milestone but a demanding economic commitment. Without harmonized tax regimes and strict deficit limits, inflation spillovers could endanger regional monetary stability.",
    category: "opinion",
    subcategory: "Economic Column",
    additionalCategories: ["editorials", "economy"],
    author: {
      id: "auth-eic-1",
      name: "Muchui Mwirigi",
      role: "Editor-in-Chief & Community Moderator",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
    },
    publishedAt: "2026-07-31T08:00:00Z",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80",
    imageCaption: "EAC Headquarters in Arusha, Tanzania.",
    isOpinion: true,
    viewCount: 15200,
    tags: ["Opinion", "EAC", "Economy", "Monetary Union"]
  },
  {
    id: "art-11",
    title: "Environment Ministry Flagships Great Rift Valley Forest Restoration Drive Planting 50M Indigenous Trees",
    slug: "environment-ministry-rift-valley-forest-restoration",
    summary: "Community forest associations in Mau, Cherangany, and Aberdares receive bamboo seedlings and drone surveillance tools.",
    content: "Efforts to achieve a 30 percent tree cover in Kenya reached a new milestone today as community groups in Mau Forest received high-tech monitoring equipment and indigenous seedlings. The initiative combines satellite imagery with local youth ranger patrols.",
    category: "environment",
    subcategory: "Reforestation",
    additionalCategories: ["climate", "agriculture"],
    author: {
      id: "auth-fact-1",
      name: "Alfred Mwenda",
      role: "Managing Editor & Senior Fact Checker (Verification Lead)",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80"
    },
    publishedAt: "2026-07-31T07:15:00Z",
    readTime: "3 min read",
    imageUrl: "https://images.unsplash.com/photo-1511497584788-8767611136f6?w=1200&auto=format&fit=crop&q=80",
    imageCaption: "Community members planting indigenous trees in Mau Forest.",
    location: "Narok",
    county: "Narok",
    viewCount: 12900,
    tags: ["Environment", "Climate", "Mau Forest", "Reforestation"]
  },
  {
    id: "art-12",
    title: "Education Ministry Rolls Out CBC Senior School Pathways & STEM University Scholarships",
    slug: "education-ministry-cbc-senior-school-pathways",
    summary: "Grade 10 students nationwide begin specialized tracks in Arts & Sports, Social Sciences, and STEM disciplines.",
    content: "The Ministry of Education has released final placement guidelines for Senior Secondary School students entering Grade 10 under the Competency-Based Curriculum (CBC). Over 4,000 public secondary schools have been upgraded with digital science laboratories and technical workshops.",
    category: "education",
    subcategory: "CBC Curriculum",
    additionalCategories: ["latest"],
    author: {
      id: "auth-ad-rep-1",
      name: "Scholastica Karwitha",
      role: "Advertising Manager & Chief Reporter / Chief Journalist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
    },
    publishedAt: "2026-07-30T22:00:00Z",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80",
    imageCaption: "Students inside upgraded STEM laboratory in Nairobi.",
    location: "Nairobi",
    county: "Nairobi",
    viewCount: 24500,
    tags: ["Education", "CBC", "Senior Secondary", "STEM"]
  }
];

export const GALLERY_ALBUMS: GalleryAlbum[] = [
  {
    id: "gal-1",
    title: "Harambee Stars Historic Victory at Nyayo Stadium in Pictures",
    category: "Sports",
    photographer: "Peter Kamau",
    date: "July 31, 2026",
    coverImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
    description: "High-octane photography capturing Kenya's 2-1 win over Uganda Cranes in the CHAN Tournament.",
    images: [
      { url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80", caption: "Michael Olunga's game-winning header in the 78th minute." },
      { url: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&auto=format&fit=crop&q=80", caption: "Crowd celebrations across the main VIP stand at Nyayo Stadium." },
      { url: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=1200&auto=format&fit=crop&q=80", caption: "Head Coach embracing team captain post-match." }
    ]
  },
  {
    id: "gal-2",
    title: "Konza Technopolis AI Supercomputer Facility Groundbreaking Ceremony",
    category: "Technology",
    photographer: "Grace Wanjiku",
    date: "July 30, 2026",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    description: "Visual tour of Silicon Savannah's state-of-the-art supercomputing infrastructure site in Machakos County.",
    images: [
      { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80", caption: "Data center server racks undergoing optical fiber testing." },
      { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80", caption: "Dignitaries and tech founders reviewing 3D architectural models." }
    ]
  }
];

export const JOB_LISTINGS: JobListing[] = [
  {
    id: "job-1",
    title: "Senior Parliament & Legislative Reporter",
    department: "Editorial & Politics Desk",
    location: "Nairobi (Parliament Bureau)",
    type: "Full-time",
    description: "Cover National Assembly and Senate committee sessions, Hansard policy transcripts, and political party developments.",
    requirements: ["Degree in Journalism or Mass Communication", "Minimum 5 years covering Kenyan legislature", "Fluent in English & Swahili"],
    postedDate: "July 25, 2026"
  },
  {
    id: "job-2",
    title: "Lead Data Journalist & Visual Interactive Editor",
    department: "Knews254 Verify & Graphics",
    location: "Nairobi HQ / Hybrid",
    type: "Full-time",
    description: "Build interactive election polling charts, inflation calculators, and geographic heatmaps for 47 counties.",
    requirements: ["Proficiency with D3.js, React, Tailwind, and SQL", "Experience analyzing KNBS & CBK public datasets"],
    postedDate: "July 28, 2026"
  }
];

export const DEFAULT_CMS_CATEGORIES: CmsCategoryItem[] = [
  { id: "cat-1", slug: "breaking", name: "Breaking News", description: "Urgent real-time alerts across Kenya and globally.", subcategories: ["National", "Security", "Weather"], articleCount: 42 },
  { id: "cat-2", slug: "politics", name: "Politics & Governance", description: "Parliament, State House, Cabinet, and Political Parties.", subcategories: ["National Assembly", "Senate", "Devolution"], articleCount: 128 },
  { id: "cat-3", slug: "elections", name: "2027 Election Centre", description: "Polls, candidate manifestos, and IEBC register audits.", subcategories: ["Presidential", "Gubernatorial", "IEBC Updates"], articleCount: 84 },
  { id: "cat-4", slug: "business", name: "Business & Economy", description: "CBK monetary policy, banking, treasury bonds, and markets.", subcategories: ["Banking", "Logistics", "Markets", "Economy"], articleCount: 162 },
  { id: "cat-5", slug: "technology", name: "Silicon Savannah & AI", description: "Konza, startup funding, AI research, and broadband.", subcategories: ["AI & LLMs", "Startups", "Telecoms"], articleCount: 95 },
  { id: "cat-6", slug: "sports", name: "Sports & Athletics", description: "Harambee Stars, Kenya Sevens, Diamond League track & field.", subcategories: ["Football", "Rugby", "Athletics"], articleCount: 210 },
  { id: "cat-7", slug: "fact-checking", name: "Fact Check & Verification", description: "Forensic verification of claims and viral media.", subcategories: ["Public Debt", "Social Claims", "Elections"], articleCount: 56 }
];

export const KENYA_47_COUNTIES: CountyData[] = [
  { id: "c-001", code: 1, name: "Mombasa", capital: "Mombasa City", governor: "Abdulswamad Shariff Nassir", region: "Coast", population: "1.2 Million", keySectors: ["Maritime Port", "Tourism", "Manufacturing"], headline: "Kilindini Harbour expansion boosts regional vessel turnaround.", newsCount: 124 },
  { id: "c-002", code: 2, name: "Kwale", capital: "Kwale", governor: "Fatuma Achani", region: "Coast", population: "866,000", keySectors: ["Mining", "Agriculture", "Beach Tourism"], headline: "Base Titanium rehabilitation yields new agro-forest cover.", newsCount: 45 },
  { id: "c-003", code: 3, name: "Kilifi", capital: "Kilifi", governor: "Gideon Mung'aro", region: "Coast", population: "1.45 Million", keySectors: ["Cashew Nuts", "Blue Economy", "Tourism"], headline: "Vipingo Industrial Park signs Ksh 12B manufacturing hub deal.", newsCount: 68 },
  { id: "c-012", code: 12, name: "Meru", capital: "Meru", governor: "Kawira Mwangaza", region: "Eastern", population: "1.54 Million", keySectors: ["Miraa & Coffee", "Horticulture", "Dairy"], headline: "Meru coffee millers secure direct specialty export deal to Germany.", newsCount: 82 },
  { id: "c-017", code: 17, name: "Makueni", capital: "Wote", governor: "Mutula Kilonzo Jr.", region: "Eastern", population: "987,000", keySectors: ["Mango Processing", "Solar Energy", "Water Conservation"], headline: "Makueni climate-resilient water dam projects hit 90% completion.", newsCount: 54 },
  { id: "c-022", code: 22, name: "Kiambu", capital: "Kiambu", governor: "Kimani Wamatangi", region: "Central", population: "2.41 Million", keySectors: ["Real Estate", "Coffee & Tea", "Light Industry"], headline: "Tatu City Special Economic Zone opens 15 new foreign tech plants.", newsCount: 188 },
  { id: "c-027", code: 27, name: "Uasin Gishu", capital: "Eldoret City", governor: "Jonathan Bii (Koti Lea)", region: "Rift Valley", population: "1.16 Million", keySectors: ["Athletics", "Maize & Wheat", "Medical Hub"], headline: "Eldoret City status milestone attracts new international sports academies.", newsCount: 142 },
  { id: "c-032", code: 32, name: "Nakuru", capital: "Nakuru City", governor: "Susan Kihika", region: "Rift Valley", population: "2.16 Million", keySectors: ["Geothermal Power", "Flower Farming", "Tourism"], headline: "Olcaria Geothermal Plant expands green energy supply to industrial parks.", newsCount: 165 },
  { id: "c-042", code: 42, name: "Kisumu", capital: "Kisumu City", governor: "Anyang' Nyong'o", region: "Nyanza", population: "1.15 Million", keySectors: ["Lake Trade", "Rice Farming", "Conference Tourism"], headline: "Kisumu Port expands cargo barge routes to Port Bell Uganda.", newsCount: 152 },
  { id: "c-047", code: 47, name: "Nairobi", capital: "Nairobi City", governor: "Johnson Sakaja", region: "Nairobi", population: "4.39 Million", keySectors: ["Financial Services", "ICT", "Diplomatic HQ"], headline: "Green Nairobi Expressway extension and unified transit bus system launched.", newsCount: 420 }
];

export const ELECTION_CANDIDATES_2027: ElectionCandidate[] = [
  {
    id: "cand-sifuna",
    name: "Edwin Sifuna",
    position: "Presidential",
    party: "Orange Democratic Movement (ODM)",
    coalition: "Azimio / Youth Reform Front",
    pollPercentage: 42.5,
    runningMate: "Babu Owino",
    keyPolicies: [
      "Public Accountability & Debt Audit Commission",
      "Free Tertiary & Vocational Education Funding",
      "Repeal of SHIF Levies & Return to Expanded NHIF Model",
      "Youth Employment & Digital Hubs Protection"
    ],
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "cand-kalonzo",
    name: "Stephen Kalonzo Musyoka",
    position: "Presidential",
    party: "Wiper Democratic Movement",
    coalition: "United Opposition Alliance",
    pollPercentage: 35.8,
    runningMate: "Eugene Wamalwa",
    keyPolicies: [
      "24-Hour Economy Tax Incentives for Youth & SMEs",
      "Free Tertiary Education in STEM & ICT Disciplines",
      "Devolution Financial Allocation Increase to 35%",
      "Zero-Tolerance Anti-Corruption Commission Overhaul"
    ],
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "cand-ruto",
    name: "Dr. William Samoei Ruto",
    position: "Presidential",
    party: "United Democratic Alliance (UDA)",
    coalition: "Kenya Kwanza Coalition",
    pollPercentage: 27.8,
    runningMate: "Professor Kithure Kindiki",
    keyPolicies: [
      "Bottom-Up Economic Transformation Model (BETA)",
      "Universal Health Coverage (SHIF System)",
      "Affordable Housing Program Across 47 Counties",
      "Digital Superhighway & 145,000km Fiber Optic Expansion"
    ],
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "cand-natembeya",
    name: "George Natembeya",
    position: "Presidential",
    party: "Democratic Action Party - Kenya (DAP-K)",
    coalition: "Tawe Movement",
    pollPercentage: 18.2,
    runningMate: "Dr. Chris Wamalwa",
    keyPolicies: [
      "Western Kenya Agriculture Revitalization",
      "Youth Employment & Direct County Enterprise Grants",
      "Security & Border Enforcement Modernization"
    ],
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "cand-gachagua",
    name: "Rigathi Gachagua",
    position: "Presidential",
    party: "Democracy & Mount Kenya Alliance",
    coalition: "DCP Regional Movement",
    pollPercentage: 12.1,
    runningMate: "Jeremiah Kioni",
    keyPolicies: [
      "Coffee & Tea Farmers Guaranteed Minimum Returns",
      "Equitable Revenue Share (One Man, One Shilling, One Vote)",
      "Protection of Small-Scale Traders & Gikomba Market Merchants"
    ],
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "cand-omtatah",
    name: "Okiya Omtatah Okoiti",
    position: "Presidential",
    party: "National Reconstruction Alliance (NRA)",
    coalition: "Public Interest Defender Movement",
    pollPercentage: 11.5,
    runningMate: "Suba Churchill",
    keyPolicies: [
      "Constitutional Rule of Law & Public Debt Audit",
      "Abolition of Unconstitutional Levies & Housing Deductions",
      "Judiciary Budget Protection & Judicial Independence"
    ],
    photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80"
  }
];

export const FACT_CHECK_ITEMS: FactCheckItem[] = [
  {
    id: "fc-101",
    claim: "Viral WhatsApp message claims fuel prices in Nairobi are set to drop by Ksh 45 per liter next week due to a new bilateral oil deal.",
    claimant: "Viral WhatsApp Forward & TikTok Audio",
    claimSource: "Social Media Platforms",
    claimDate: "2026-07-30",
    verdict: "FALSE",
    explanation: "EPRA (Energy and Petroleum Regulatory Authority) official monthly pricing review is scheduled for the 14th of every month. Official EPRA gazette data confirms no emergency review has been sanctioned, and international MOPAGS benchmark crude prices show a minor 0.4% fluctuation.",
    evidence: [
      "EPRA Official Press Statement dated July 30, 2026",
      "S&P Global Platts Oil Benchmark Market Report",
      "Ministry of Energy & Petroleum Official Communication"
    ],
    factChecker: "Knews254 Verify Fact Desk (Led by Alfred Mwenda)"
  },
  {
    id: "fc-102",
    claim: "Claim that Kenya's public debt ratio dropped below 60% of GDP in the first half of 2026.",
    claimant: "Ministry of National Treasury Spokesperson",
    claimSource: "Parliamentary Budget Committee Hearing",
    claimDate: "2026-07-28",
    verdict: "PARTIALLY TRUE",
    explanation: "National Treasury quarterly economic reports show debt-to-GDP recalibration standing at 64.2% (down from 68.1% in late 2024), driven by nominal GDP rebasing and stronger shilling exchange rates, but still slightly above the 60% threshold.",
    evidence: [
      "Central Bank of Kenya Monthly Debt Bulletin",
      "International Monetary Fund (IMF) Article IV Country Report",
      "Kenya National Bureau of Statistics (KNBS) GDP Tables"
    ],
    factChecker: "Alfred Mwenda (Knews254 Economics Fact Unit)"
  }
];

export const LIVE_BLOG_UPDATES: LiveBlogUpdate[] = [
  {
    id: "lb-1",
    timestamp: "22:45 EAT",
    title: "Senate Approves County Allocation Revenue Bill (CARB)",
    content: "The Senate has unanimously passed the County Allocation Revenue Bill with a 38-0 vote. Counties will receive Ksh 415 Billion in equitable share allocations for the 2026/2027 fiscal year. Council of Governors Chair applauded the bipartisan consensus.",
    author: "James Mwangi (Parliament Bureau)",
    isKeyMoment: true,
    reactionCount: { like: 342, shock: 12, clap: 512 }
  },
  {
    id: "lb-2",
    timestamp: "21:30 EAT",
    title: "Nairobi County Unveils Night Market Lighting Project in Gikomba & Muthurwa",
    content: "Governor Johnson Sakaja inspects installation of high-mast solar floodlights aimed at boosting 24-hour informal trade and security across city markets.",
    author: "Mary Wambui (Nairobi Bureau)",
    isKeyMoment: false,
    reactionCount: { like: 189, shock: 4, clap: 240 }
  },
  {
    id: "lb-3",
    timestamp: "20:15 EAT",
    title: "Harambee Stars Qualify for CHAN 2026 Quarter-Finals with 2-1 Win Over Uganda Cranes",
    content: "Goals from Michael Olunga and Eric Ouma at the Nyayo National Stadium sealed Kenya's spot in the knockout stage amidst electric home crowd support.",
    author: "Brian Otieno (Sports Desk)",
    isKeyMoment: true,
    reactionCount: { like: 1240, shock: 15, clap: 1890 }
  }
];

export const VIDEO_CLIPS: VideoClip[] = [
  {
    id: "vid-1",
    title: "Knews254 Special Report: Inside Konza Technopolis Supercomputer Center",
    duration: "12:45",
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    category: "technology",
    views: "142,500",
    publishedAt: "2 hours ago",
    presenter: "Kelvin Mutua"
  },
  {
    id: "vid-2",
    title: "2027 Election Watch: Breakdown of IEBC Biometric Security Protocols",
    duration: "08:30",
    thumbnailUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&auto=format&fit=crop&q=80",
    category: "elections",
    views: "98,200",
    publishedAt: "5 hours ago",
    presenter: "Wanjiru Mwangi"
  },
  {
    id: "vid-3",
    title: "The Blue Economy Boom: How Mombasa Port Clearances Hit Record Speed",
    duration: "15:10",
    thumbnailUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
    category: "business",
    views: "76,800",
    publishedAt: "1 day ago",
    presenter: "Amina Hassan"
  }
];

export const PODCAST_EPISODES: PodcastEpisode[] = [
  {
    id: "pod-1",
    title: "Episode 42: Deciphering the 2026/27 National Budget & Shilling Outlook",
    showName: "The Kenya Money Podcast",
    episodeNumber: 42,
    duration: "38:45",
    coverUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&auto=format&fit=crop&q=80",
    publishedAt: "July 30, 2026",
    summary: "Host David Ochieng sits down with leading economists to unpack CBK interest rate policies, tax reforms, and investment avenues in Kenya treasury bonds.",
    host: "David Ochieng"
  },
  {
    id: "pod-2",
    title: "Episode 88: Silicon Savannah's Next Billion-Dollar AI Wave",
    showName: "Knews254 Tech Unfiltered",
    episodeNumber: 88,
    duration: "45:20",
    coverUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&auto=format&fit=crop&q=80",
    publishedAt: "July 28, 2026",
    summary: "Exploring how local startups in Nairobi and Eldoret are leveraging generative AI for agricultural yield forecasting and indigenous language translation.",
    host: "Kelvin Mutua"
  }
];
