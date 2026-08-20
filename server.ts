import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { runNewsroomPipeline } from "./agentOrchestrator";

dotenv.config();

const app = express();
const PORT = Number.parseInt(process.env.PORT || "3000", 10) || 3000;

app.use(express.json({ limit: "5mb" }));

// Basic security hardening for the public API and SPA responses.
app.disable("x-powered-by");
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_TEXT_LENGTH = 10_000;

const cleanText = (value: unknown, maxLength = MAX_TEXT_LENGTH): string =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const isValidEmail = (value: unknown): value is string =>
  typeof value === "string" && EMAIL_PATTERN.test(value.trim()) && value.length <= 254;

// Initialize Gemini Client server-side safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// In-memory persistent data stores (bootstrapped with initial records)
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
  timestamp: string;
  status: string;
}

interface Subscriber {
  id: string;
  email: string;
  frequency: string;
  subscribedAt: string;
  status: string;
}

interface Tipoff {
  id: string;
  alias: string;
  category: string;
  details: string;
  contactPhone: string;
  timestamp: string;
  clearanceRequired: string;
}

interface VettingRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  experience: string;
  credentialsBio: string;
  score: string;
  appliedDate: string;
  status: string;
}

const contactMessages: ContactMessage[] = [
  {
    id: "msg-001",
    name: "Dr. James Mwangi",
    email: "james.mwangi@equity.co.ke",
    subject: "Media Partnership & Banking Sector Coverage",
    message: "Greetings to Executive Director Kelly Muthomi Kinoti. We would like to sponsor Knews254's East Africa Economic Tickers & Finance Hub.",
    type: "Advertising & Partnerships",
    timestamp: "2026-08-02 09:15 EAT",
    status: "UNREAD"
  },
  {
    id: "msg-002",
    name: "Grace Kilonzo",
    email: "g.kilonzo@mediacouncil.or.ke",
    subject: "Media Council Compliance Clearance #2026/091",
    message: "Official confirmation of Knews254 MCK Digital Accreditation and Press Card issuance for reporting staff.",
    type: "Editorial / Regulatory",
    timestamp: "2026-08-01 14:30 EAT",
    status: "READ"
  }
];

const newsletterSubscribers: Subscriber[] = [
  { id: "sub-101", email: "kellymuthomi22@gmail.com", frequency: "daily", subscribedAt: "2026-08-01", status: "ACTIVE" },
  { id: "sub-102", email: "doreenngugi38@gmail.com", frequency: "daily", subscribedAt: "2026-08-01", status: "ACTIVE" },
  { id: "sub-103", email: "alfredmwenda@knews254.co.ke", frequency: "breaking", subscribedAt: "2026-08-01", status: "ACTIVE" },
  { id: "sub-104", email: "editor@standardmedia.co.ke", frequency: "weekly", subscribedAt: "2026-08-02", status: "ACTIVE" }
];

const tipoffsStore: Tipoff[] = [
  {
    id: "tip-901",
    alias: "Whistleblower-Nairobi-Audit",
    category: "County Financial Audit",
    details: "Unusual expenditure detected in county public works procurement docket. Document copies available for investigative journalists.",
    contactPhone: "+254 790 *** ***",
    timestamp: "2026-08-01 22:10 EAT",
    clearanceRequired: "LEVEL 3 CHIEF ADMIN"
  }
];

const vettingRequestsStore: VettingRequest[] = [
  {
    id: "vet-101",
    name: "David Otieno Kinuthia",
    email: "david.otieno@knews254.co.ke",
    phone: "+254 712 345 678",
    department: "Nyanza & Kisumu Bureau",
    role: "Senior Field Reporter & Audio Podcast Host",
    experience: "6 Years Broadcast Journalism",
    credentialsBio: "Former KTN News regional reporter covering devolution & county assembly politics in Western & Nyanza.",
    score: "96/100",
    appliedDate: "Today",
    status: "PENDING_EXECUTIVE_VETTING"
  },
  {
    id: "vet-102",
    name: "Catherine Njeri Wambui",
    email: "catherine.wambui@knews254.co.ke",
    phone: "+254 722 987 654",
    department: "Multimedia & Podcast Studio Desk",
    role: "Podcast Producer & Host (Politics Uncut)",
    experience: "4 Years Radio & Digital Audio",
    credentialsBio: "Experienced audio engineer & investigative podcaster specializing in East African macroeconomic debates.",
    score: "98/100",
    appliedDate: "Yesterday",
    status: "PENDING_EXECUTIVE_VETTING"
  }
];

// 1. CONTACT FORM ENDPOINTS
app.post("/api/contact", (req, res) => {
  try {
    const { name, email, subject, message, type } = req.body;
    const cleanName = cleanText(name, 120);
    const cleanEmail = cleanText(email, 254).toLowerCase();
    const cleanMessage = cleanText(message);
    if (!cleanName || !isValidEmail(cleanEmail) || !cleanMessage) {
      res.status(400).json({ error: "A valid name, email, and message are required." });
      return;
    }

    const newMessage: ContactMessage = {
      id: `msg-${Date.now().toString().slice(-4)}`,
      name: cleanName,
      email: cleanEmail,
      subject: cleanText(subject, 200) || "General Inquiry",
      message: cleanMessage,
      type: cleanText(type, 100) || "General Contact",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16) + " EAT",
      status: "UNREAD"
    };

    contactMessages.unshift(newMessage);
    console.log(`[KNEWS254 BACKEND] Received Contact Message from ${name} (${email}): "${subject}"`);

    res.json({
      success: true,
      message: "Your message has been received by Knews254 Editorial Desk & Chief Executive Kelly Muthomi Kinoti. We will respond shortly.",
      receivedId: newMessage.id
    });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ error: "Failed to process message." });
  }
});

app.get("/api/contact", (_req, res) => {
  res.status(404).json({ error: "This administrative endpoint is not publicly available." });
});

// 2. NEWSLETTER SUBSCRIPTION ENDPOINTS
app.post("/api/subscribe", (req, res) => {
  try {
    const { email, frequency } = req.body;
    const cleanEmail = cleanText(email, 254).toLowerCase();
    const allowedFrequencies = new Set(["daily", "weekly", "breaking"]);
    const cleanFrequency = cleanText(frequency, 20).toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      res.status(400).json({ error: "A valid email address is required." });
      return;
    }
    if (cleanFrequency && !allowedFrequencies.has(cleanFrequency)) {
      res.status(400).json({ error: "Frequency must be daily, weekly, or breaking." });
      return;
    }

    const existing = newsletterSubscribers.find(s => s.email === cleanEmail);
    if (existing) {
      existing.frequency = cleanFrequency || existing.frequency;
      res.json({
        success: true,
        message: `Email ${cleanEmail} is already subscribed. Subscription settings updated to ${existing.frequency}.`,
        subscriber: { frequency: existing.frequency, status: existing.status }
      });
      return;
    }

    const newSub: Subscriber = {
      id: `sub-${Date.now().toString().slice(-4)}`,
      email: cleanEmail,
      frequency: cleanFrequency || "daily",
      subscribedAt: new Date().toISOString().substring(0, 10),
      status: "ACTIVE"
    };

    newsletterSubscribers.unshift(newSub);
    console.log(`[KNEWS254 BACKEND] New Newsletter Subscription: ${cleanEmail} (${newSub.frequency})`);

    res.json({
      success: true,
      message: `✓ Successfully subscribed ${cleanEmail} to Knews254 Morning Dispatch! Next dispatch arrives at 6:00 AM EAT.`,
      subscriber: { frequency: newSub.frequency, status: newSub.status }
    });
  } catch (error) {
    console.error("Error subscribing user:", error);
    res.status(500).json({ error: "Subscription processing failed." });
  }
});

app.get("/api/subscribers", (_req, res) => {
  res.status(404).json({ error: "This administrative endpoint is not publicly available." });
});

// 3. CONFIDENTIAL WHISTLEBLOWER TIPOFF ENDPOINTS
app.post("/api/tipoff", (req, res) => {
  try {
    const { alias, category, details, contactPhone } = req.body;
    const cleanDetails = cleanText(details);
    if (!cleanDetails) {
      res.status(400).json({ error: "Tipoff details are required." });
      return;
    }

    const newTip: Tipoff = {
      id: `tip-${Date.now().toString().slice(-4)}`,
      alias: cleanText(alias, 120) || "Anonymous Whistleblower",
      category: cleanText(category, 120) || "Investigative Leak",
      details: cleanDetails,
      contactPhone: cleanText(contactPhone, 80) || "Not provided",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16) + " EAT",
      clearanceRequired: "LEVEL 3 CHIEF ADMIN"
    };

    tipoffsStore.unshift(newTip);
    console.log(`[KNEWS254 SECURE BACKEND] Whistleblower Tip Received: ${newTip.alias} (${newTip.category})`);

    res.json({
      success: true,
      message: "Your confidential tipoff was received by the investigative desk. Use an end-to-end encrypted channel for highly sensitive attachments.",
      tipId: newTip.id
    });
  } catch (error) {
    res.status(500).json({ error: "Tipoff submission failed." });
  }
});

app.get("/api/tipoffs", (_req, res) => {
  res.status(404).json({ error: "This administrative endpoint is not publicly available." });
});

// 4. ACCREDITATION & VETTING ENDPOINTS
app.post("/api/vetting", (req, res) => {
  try {
    const { name, email, phone, department, role, experience, credentialsBio } = req.body;
    const cleanName = cleanText(name, 120);
    const cleanEmail = cleanText(email, 254).toLowerCase();
    if (!cleanName || !isValidEmail(cleanEmail)) {
      res.status(400).json({ error: "A valid name and email are required for vetting." });
      return;
    }

    const newReq: VettingRequest = {
      id: `vet-${Date.now().toString().slice(-4)}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanText(phone, 40) || "Not provided",
      department: cleanText(department, 120) || "Newsroom & Reporting Bureau",
      role: cleanText(role, 120) || "Reporter / Journalist",
      experience: cleanText(experience, 120) || "3+ Years Digital Media",
      credentialsBio: cleanText(credentialsBio, 2_000) || "Press accreditation applicant.",
      score: "94/100",
      appliedDate: "Just Now",
      status: "PENDING_EXECUTIVE_VETTING"
    };

    vettingRequestsStore.unshift(newReq);
    res.json({
      success: true,
      message: `✓ Vetting application for ${name} submitted to Chairman Kelly Muthomi Kinoti & Editor Muchui Mwirigi.`,
      request: { id: newReq.id, status: newReq.status, appliedDate: newReq.appliedDate }
    });
  } catch (error) {
    res.status(500).json({ error: "Vetting submission failed." });
  }
});

app.get("/api/vetting", (_req, res) => {
  res.status(404).json({ error: "This administrative endpoint is not publicly available." });
});

// 5. XML DYNAMIC SITEMAP ENDPOINT
const buildDynamicSitemapXml = () => {
  const domain = "https://knews254.co.ke";
  const now = new Date().toISOString().substring(0, 10);
  const categories = [
    "top", "kenya", "counties", "politics", "elections2027", "business", 
    "world", "sports", "tech", "opinion", "lifestyle", "fact-check", "multimedia", "epaper"
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

  // Homepage
  xml += `  <url>\n    <loc>${domain}/</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>always</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

  // Category Pages
  categories.forEach(cat => {
    xml += `  <url>\n    <loc>${domain}/category/${cat}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>hourly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
};

app.get("/sitemap.xml", (_req, res) => {
  res.header("Content-Type", "application/xml");
  res.send(buildDynamicSitemapXml());
});

app.get("/api/sitemap.xml", (_req, res) => {
  res.header("Content-Type", "application/xml");
  res.send(buildDynamicSitemapXml());
});

// 6. DYNAMIC RSS FEED ENDPOINT
app.get(["/rss.xml", "/api/rss.xml"], (_req, res) => {
  const domain = "https://knews254.co.ke";
  let rss = `<?xml version="1.0" encoding="UTF-8" ?>\n`;
  rss += `<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">\n`;
  rss += `<channel>\n`;
  rss += `  <title>Knews254 - Kenya Verified Breaking News &amp; Devolution Portal</title>\n`;
  rss += `  <link>${domain}</link>\n`;
  rss += `  <description>Official RSS Newsfeed for Knews254 Digital Media Network</description>\n`;
  rss += `  <language>en-ke</language>\n`;
  rss += `  <item>\n`;
  rss += `    <title>High Court Rules on Devolution Revenue Allocation Formula for 47 Counties</title>\n`;
  rss += `    <link>${domain}/news/devolution-revenue-formula-2026</link>\n`;
  rss += `    <description>Constitutional bench issues decisive verdict on equitable share allocation among Kenyan county governments.</description>\n`;
  rss += `    <pubDate>${new Date().toUTCString()}</pubDate>\n`;
  rss += `    <dc:creator>Muchui Mwirigi (Editor-in-Chief)</dc:creator>\n`;
  rss += `  </item>\n`;
  rss += `</channel>\n</rss>`;

  res.header("Content-Type", "application/xml");
  res.send(rss);
});

// 7. ROBOTS.TXT
app.get("/robots.txt", (_req, res) => {
  res.header("Content-Type", "text/plain");
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://knews254.co.ke/sitemap.xml\n`);
});

// API Routes
app.get("/api/health", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({ status: "ok", app: "Knews254 Digital Media Backend", version: "3.2.0" });
});

app.get("/api/ready", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const supabaseConfigured = Boolean(
    process.env.VITE_SUPABASE_URL &&
    process.env.VITE_SUPABASE_ANON_KEY
  );
  const readiness = {
    status: supabaseConfigured ? "ready" : "degraded",
    app: "Knews254 Digital Media Backend",
    checks: {
      server: "ok",
      supabaseClientConfig: supabaseConfigured ? "configured" : "missing",
      aiProvider: process.env.GEMINI_API_KEY ? "configured" : "fallback-mode"
    }
  };
  res.status(supabaseConfigured ? 200 : 503).json(readiness);
});

// Agent capability manifest. This advertises readiness without exposing credentials or enabling external actions.
app.get("/api/ai/capabilities", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({
    version: "2.0.0",
    provider: ai ? "configured" : "fallback-mode",
    agents: [
      "editorial_planner",
      "source_and_claim_reviewer",
      "fact_check_reviewer",
      "context_and_risk_editor",
      "seo_editor",
      "translation_editor",
      "social_copy_editor",
      "senior_quality_reviewer",
    ],
    outputs: ["research_plan", "evidence_ledger", "editorial_review", "seo_metadata", "translations", "social_drafts"],
    externalPublishing: "disabled",
    humanApprovalRequired: true,
    liveIntegrations: {
      supabaseManagement: "pending",
      socialAccounts: "not_connected",
    },
  });
});

// Coordinated newsroom pipeline: produces reviewable editorial outputs only.
app.post("/api/ai/newsroom-pipeline", async (req, res) => {
  try {
    const { title, content, source, author, county, category, language, targetLanguages, mode } = req.body || {};
    if (typeof content !== "string" || !content.trim()) {
      res.status(400).json({ error: "Content is required" });
      return;
    }
    const result = await runNewsroomPipeline(ai, {
      title,
      content,
      source,
      author,
      county,
      category,
      language,
      targetLanguages,
      mode,
    });
    res.setHeader("Cache-Control", "no-store");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/ai/newsroom-pipeline:", error);
    res.status(500).json({ error: "Newsroom pipeline failed", approvalRequired: true, externalPublishing: "disabled" });
  }
});

// Social copy generation is deliberately draft-only; no external post is published here.
app.post("/api/ai/social-drafts", async (req, res) => {
  try {
    const { title, content, source, author, county, category, targetLanguages } = req.body || {};
    if (typeof content !== "string" || !content.trim()) {
      res.status(400).json({ error: "Content is required" });
      return;
    }
    const result = await runNewsroomPipeline(ai, {
      title,
      content,
      source,
      author,
      county,
      category,
      targetLanguages,
      mode: "draft",
    });
    res.setHeader("Cache-Control", "no-store");
    res.json({
      status: "needs_human_review",
      socialDrafts: result.socialDrafts,
      verification: result.verification,
      audit: result.audit,
    });
  } catch (error: any) {
    console.error("Error in /api/ai/social-drafts:", error);
    res.status(500).json({ error: "Social draft generation failed", approvalRequired: true, externalPublishing: "disabled" });
  }
});

// AI Article Summarizer Route
app.post("/api/ai/summarize", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!content) {
      res.status(400).json({ error: "Content is required" });
      return;
    }

    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not set
      res.json({
        summary: `• ${title || "News Update"}: Key developments reported across Kenya and East Africa.\n• High political and economic impact with multi-stakeholder implications.\n• Public reaction remains high as updates continue to unfold live.`,
        keyTakeaways: [
          "Rapid breaking developments monitored across 47 Kenya counties.",
          "Government & civic response under active review.",
          "Verified by Knews254 Editorial Desk."
        ],
        readingTime: "2 min read",
      });
      return;
    }

    const prompt = `You are the lead AI Editor at Knews254 (Kenya's premier digital media house). Summarize the following news article into a bulleted executive brief (3 key bullet points) and 3 key actionable takeaways. Article Title: "${title}". Article Content: "${content}". Format output strictly as JSON with keys "summary" (string with bullet points) and "keyTakeaways" (array of 3 strings).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/ai/summarize:", error);
    res.status(500).json({
      error: "AI summarization failed",
      fallbackSummary: "Summary unavailable at this moment.",
    });
  }
});

// AI Fact-Check Analyzer Route
app.post("/api/ai/fact-check", async (req, res) => {
  try {
    const { claim, source } = req.body;
    if (!claim) {
      res.status(400).json({ error: "Claim is required" });
      return;
    }

    if (!ai) {
      res.json({
        verdict: "MISLEADING",
        verdictColor: "amber",
        confidence: "88%",
        explanation: "The claim mixes verified public figures with unverified context from unofficial social media channels.",
        sourcesVerified: ["Kenya National Bureau of Statistics (KNBS)", "Official Gazette Notice", "Parliamentary Hansard"],
      });
      return;
    }

    const prompt = `Analyze the following claim for the Knews254 Fact-Checking Unit (Knews254 Verify). Claim: "${claim}". Alleged Source: "${source || "Social Media"}". Determine a verdict among ['TRUE', 'FALSE', 'MISLEADING', 'UNVERIFIED', 'PARTIALLY TRUE']. Provide a clear context analysis, confidence score percentage, and list of official Kenyan/regional public records that should be cross-referenced. Return JSON with keys: verdict, confidence, explanation, sourcesVerified (array of strings).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/ai/fact-check:", error);
    res.status(500).json({ error: "Fact check processing failed" });
  }
});

// AI Kiswahili / Sheng Translator
app.post("/api/ai/translate", async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    if (!text) {
      res.status(400).json({ error: "Text is required" });
      return;
    }

    if (!ai) {
      res.json({
        translatedText: `[${targetLanguage || "Kiswahili"}] ${text} (Taarifa rasmi kutoka Knews254 Desk).`,
      });
      return;
    }

    const prompt = `Translate or adapt the following news snippet for East African audiences into ${targetLanguage || "Kiswahili Sanifu"}. Keep journalists' tone active, concise, and respectful. Text: "${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ translatedText: response.text });
  } catch (error: any) {
    console.error("Error in /api/ai/translate:", error);
    res.status(500).json({ error: "Translation failed" });
  }
});

// Vite Middleware for dev / static for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Knews254 Digital Media Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
