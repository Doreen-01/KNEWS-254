export type AppLanguage = 'en' | 'sw' | 'sheng';

export interface Translations {
  // Navigation & Branding
  brandName: string;
  brandTagline: string;
  breakingNews: string;
  latestNews: string;
  searchPlaceholder: string;
  allCategories: string;
  counties: string;
  readTime: string;
  views: string;
  likes: string;
  share: string;
  listen: string;
  listening: string;
  aiBrief: string;
  generatingBrief: string;
  swahiliTranslation: string;
  
  // Verification & Sources
  verifiedReport: string;
  sourcesTitle: string;
  howWeKnow: string;
  primarySources: string;
  factChecked: string;
  editorVerification: string;
  correctionsNotice: string;
  reportCorrection: string;

  // Categories
  politics: string;
  business: string;
  countyNews: string;
  investigations: string;
  elections: string;
  sports: string;
  technology: string;
  opinion: string;
  international: string;
  diaspora: string;

  // Actions & UI
  readFullStory: string;
  backToNews: string;
  quickDemoLogin: string;
  published: string;
  lastUpdated: string;
  photoCredit: string;
  comments: string;
  leaveComment: string;
  submitComment: string;
  commentPending: string;
  
  // Regional East Africa Desks
  eastAfricaDesks: string;
  kenyaDesk: string;
  ugandaDesk: string;
  tanzaniaDesk: string;
  rwandaDesk: string;
  ethiopiaDesk: string;
  somaliaDesk: string;
  southSudanDesk: string;
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  en: {
    brandName: "KNews 254",
    brandTagline: "East Africa Premier Digital News Network",
    breakingNews: "BREAKING NEWS",
    latestNews: "LATEST DISPATCHES",
    searchPlaceholder: "Search headlines, politicians, counties or stories...",
    allCategories: "All News Desks",
    counties: "47 Counties",
    readTime: "read",
    views: "views",
    likes: "likes",
    share: "Share Story",
    listen: "Listen (Audio)",
    listening: "Listening...",
    aiBrief: "AI Executive Brief",
    generatingBrief: "Generating Brief...",
    swahiliTranslation: "Kiswahili Edition",
    
    verifiedReport: "VERIFIED REPORT",
    sourcesTitle: "Sources & How We Know",
    howWeKnow: "Verification & Sourcing Trail",
    primarySources: "Primary Sources & Hansard Records",
    factChecked: "Fact-Checked & Verified",
    editorVerification: "KNews Editorial Desk Verified",
    correctionsNotice: "Verified under KNews Editorial Standards & Correction Policy",
    reportCorrection: "Report Correction or Tip Editor",

    politics: "Politics & Governance",
    business: "Business & Economy",
    countyNews: "47 County Dispatches",
    investigations: "Investigative Desk",
    elections: "2027 Election Center",
    sports: "Sports & Athletics",
    technology: "Silicon Savannah Tech",
    opinion: "Opinion & Analysis",
    international: "International",
    diaspora: "Global Diaspora",

    readFullStory: "Read Full Dispatch",
    backToNews: "Back to Newsroom",
    quickDemoLogin: "Instant Staff Access",
    published: "Published",
    lastUpdated: "Last Updated",
    photoCredit: "Photo Credit",
    comments: "Verified Reader Discussion",
    leaveComment: "Join the Bipartisan Discussion",
    submitComment: "Submit Comment",
    commentPending: "Comment submitted! Pending editorial moderation.",

    eastAfricaDesks: "East Africa Regional News Desks",
    kenyaDesk: "Kenya Desk",
    ugandaDesk: "Uganda Bureau",
    tanzaniaDesk: "Tanzania Bureau",
    rwandaDesk: "Rwanda Bureau",
    ethiopiaDesk: "Ethiopia & Horn of Africa",
    somaliaDesk: "Somalia Dispatch",
    southSudanDesk: "South Sudan Bureau"
  },
  sw: {
    brandName: "KNews 254",
    brandTagline: "Mtandao Mkuu wa Habari Dijitali Afrika Mashariki",
    breakingNews: "HABARI ZA HIVI PUNDE",
    latestNews: "TAARIFA ZA KARIBUNI",
    searchPlaceholder: "Tafuta vichwa vya habari, wanasiasa, au kaunti...",
    allCategories: "Madawati Yote ya Habari",
    counties: "Kaunti 47 za Kenya",
    readTime: "kusoma",
    views: "watazamaji",
    likes: "wapendaji",
    share: "Gawa Taarifa Hii",
    listen: "Sikiliza (Sauti)",
    listening: "Inasikiliza...",
    aiBrief: "Muhtasari wa AI",
    generatingBrief: "Inatengeneza Muhtasari...",
    swahiliTranslation: "Toleo la Kiswahili Sanifu",
    
    verifiedReport: "TAARIFA ILIYOHAKIKISHWA",
    sourcesTitle: "Vyanzo na Jinsi Tulevyohakiki",
    howWeKnow: "Uthibitisho na Vyanzo vya Habari",
    primarySources: "Kumbukumbu Rasmi za Bunge na Mahakama",
    factChecked: "Imekaguliwa na Kuhakikishwa",
    editorVerification: "Imehakikishwa na Dawati la Uhariri la KNews",
    correctionsNotice: "Inalindwa na Kanuni za Uhariri na Marekebisho za KNews",
    reportCorrection: "Ripoti Marekebisho au Tuma Taarifa kwa Mhariri",

    politics: "Siasa na Uongozi",
    business: "Biashara na Uchumi",
    countyNews: "Taarifa za Kaunti 47",
    investigations: "Dawati la Uchunguzi",
    elections: "Kituo cha Uchaguzi 2027",
    sports: "Mchezo na Riadha",
    technology: "Teknolojia ya Silicon Savannah",
    opinion: "Maoni na Uchambuzi",
    international: "Mambo ya Nje",
    diaspora: "Wakenya Ughaibuni",

    readFullStory: "Soma Taarifa Kamili",
    backToNews: "Rudi Chumba cha Habari",
    quickDemoLogin: "Ingia Papo Hapo kama Wafanyakazi",
    published: "Ilichapishwa",
    lastUpdated: "Marekebisho ya Mwisho",
    photoCredit: "Mpiga Picha / Chanzo",
    comments: "Majadiliano ya Wasomaji Waliohakikishwa",
    leaveComment: "Changia Maoni Yako",
    submitComment: "Tuma Maoni",
    commentPending: "Maoni yametumwa! Yanasubiri ukaguzi wa mhariri.",

    eastAfricaDesks: "Madawati ya Mikoa ya Afrika Mashariki",
    kenyaDesk: "Dawati la Kenya",
    ugandaDesk: "Dawati la Uganda",
    tanzaniaDesk: "Dawati la Tanzania",
    rwandaDesk: "Dawati la Rwanda",
    ethiopiaDesk: "Dawati la Ethiopia na Pembe ya Afrika",
    somaliaDesk: "Dawati la Somalia",
    southSudanDesk: "Dawati la Sudan Kusini"
  },
  sheng: {
    brandName: "KNews 254",
    brandTagline: "Rada Safi ya News na Stories za 254 na EA",
    breakingNews: "HOT NEWS / RADA ZA SHANGWE",
    latestNews: "RADA MPYA ZA LEO",
    searchPlaceholder: "Saka stories, mambaba, county ama rada...",
    allCategories: "Madawati Zote",
    counties: "Counties 47",
    readTime: "maminits za kuread",
    views: "macho",
    likes: "pamoja",
    share: "Share Hii Story",
    listen: "Sikiza Sauti",
    listening: "Inacheza...",
    aiBrief: "Muhtasari wa AI",
    generatingBrief: "Inaunda summary...",
    swahiliTranslation: "Rada za Swahili",
    
    verifiedReport: "STORY FORMATTED NA RIENG SAFINI",
    sourcesTitle: "Vyanzo na Form ya Truth",
    howWeKnow: "Rada za Form na Evidence",
    primarySources: "Record za Bunge na Court",
    factChecked: "Imepitiwa na Kudhibitishwa",
    editorVerification: "Dawati la Editor limeapprove",
    correctionsNotice: "Story iko spot on kulingana na sheria za newsroom",
    reportCorrection: "Tuma Correction ama Tip kwa Editor",

    politics: "Siasa na Mambaba",
    business: "Biashara na Ganji",
    countyNews: "Rada za Counties 47",
    investigations: "Investigations na Exposes",
    elections: "Rada za Elections 2027",
    sports: "Macho za Sports na Ball",
    technology: "Tech na Digital Innovators",
    opinion: "Views na Maviews za Mambaba",
    international: "Rada za Umajuu",
    diaspora: "Wana-254 Ughaibuni",

    readFullStory: "Soma Story Yote",
    backToNews: "Rudi Newsroom",
    quickDemoLogin: "Ingia Instant kama Staff",
    published: "Iliingizwa",
    lastUpdated: "Rada za Mwisho",
    photoCredit: "Camera Person",
    comments: "Chat na Wananchi",
    leaveComment: "Drop Comment Yako",
    submitComment: "Tuma Comment",
    commentPending: "Comment imeingia! Editor anainpect.",

    eastAfricaDesks: "Desks za East Africa",
    kenyaDesk: "Desk ya 254 Kenya",
    ugandaDesk: "Bureau ya Uganda",
    tanzaniaDesk: "Bureau ya Bongo Tanzania",
    rwandaDesk: "Bureau ya Rwanda",
    ethiopiaDesk: "Bureau ya Horn of Africa",
    somaliaDesk: "Bureau ya Somalia",
    southSudanDesk: "Bureau ya South Sudan"
  }
};

export function getTranslation(lang: AppLanguage = 'en'): Translations {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
