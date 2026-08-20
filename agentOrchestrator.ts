import type { GoogleGenAI } from "@google/genai";

export type NewsroomLanguage = "English" | "Kiswahili" | "Sheng";
export type NewsroomMode = "draft" | "review";

export interface NewsroomPipelineInput {
  title: string;
  content: string;
  source?: string;
  author?: string;
  county?: string;
  category?: string;
  language?: NewsroomLanguage;
  targetLanguages?: NewsroomLanguage[];
  mode?: NewsroomMode;
}

export interface NewsroomPipelineOutput {
  status: "draft" | "needs_human_review";
  headline: string;
  executiveSummary: string;
  keyFacts: string[];
  claimsForVerification: string[];
  verification: {
    verdict: "verified_pending_review" | "mixed" | "insufficient_evidence";
    confidence: number;
    rationale: string;
    evidenceNeeded: string[];
  };
  editorial: {
    angle: string;
    risks: string[];
    missingContext: string[];
    recommendedActions: string[];
  };
  seo: {
    slug: string;
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  translations: Array<{ language: NewsroomLanguage; headline: string; summary: string }>;
  socialDrafts: Array<{
    platform: "linkedin" | "instagram" | "x" | "whatsapp";
    copy: string;
    hashtags: string[];
    approvalRequired: true;
    publishStatus: "draft";
  }>;
  audit: {
    agentsRun: string[];
    sourceProvided: boolean;
    externalPublishing: "disabled";
    humanApprovalRequired: true;
  };
}

const AGENTS = [
  "editorial_planner",
  "source_and_claim_reviewer",
  "fact_check_reviewer",
  "context_and_risk_editor",
  "seo_editor",
  "translation_editor",
  "social_copy_editor",
];

const clean = (value: unknown, max = 20_000): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const slugify = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120) || "news-update";

const fallbackOutput = (input: NewsroomPipelineInput): NewsroomPipelineOutput => {
  const headline = clean(input.title, 180) || "Knews254 News Update";
  const summary = clean(input.content, 600).replace(/\s+/g, " ");
  const languages = (input.targetLanguages || []).filter((language) => language !== "English");
  return {
    status: "needs_human_review",
    headline,
    executiveSummary: summary || "A newsroom editor must review this item before publication.",
    keyFacts: summary ? [summary] : [],
    claimsForVerification: ["Verify names, dates, figures, locations, and source attribution before publication."],
    verification: {
      verdict: "insufficient_evidence",
      confidence: 0,
      rationale: "No AI verification provider is configured; this item must not be treated as verified.",
      evidenceNeeded: ["Primary source or official record", "Independent corroboration", "Editor review"],
    },
    editorial: {
      angle: "Identify the public-interest significance without overstating the available evidence.",
      risks: ["Unverified claims", "Missing attribution", "Potentially incomplete context"],
      missingContext: ["Source provenance", "Independent confirmation"],
      recommendedActions: ["Assign a human editor", "Verify all material claims", "Check legal and safety implications"],
    },
    seo: {
      slug: slugify(headline),
      metaTitle: headline.slice(0, 60),
      metaDescription: summary.slice(0, 155),
      keywords: [input.category || "Kenya news", input.county || "Kenya", "Knews254"],
    },
    translations: languages.map((language) => ({
      language,
      headline: `[${language}] ${headline}`,
      summary: `[${language}] Human translation review required.`,
    })),
    socialDrafts: ["linkedin", "instagram", "x", "whatsapp"].map((platform) => ({
      platform: platform as "linkedin" | "instagram" | "x" | "whatsapp",
      copy: `${headline}\n\n${summary}`.trim().slice(0, 900),
      hashtags: ["Knews254", "KenyaNews"],
      approvalRequired: true,
      publishStatus: "draft",
    })),
    audit: {
      agentsRun: AGENTS,
      sourceProvided: Boolean(input.source),
      externalPublishing: "disabled",
      humanApprovalRequired: true,
    },
  };
};

const parseModelJson = (text: string): NewsroomPipelineOutput => {
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  return JSON.parse(cleaned) as NewsroomPipelineOutput;
};

export async function runNewsroomPipeline(
  ai: GoogleGenAI | null,
  rawInput: NewsroomPipelineInput,
): Promise<NewsroomPipelineOutput> {
  const input: NewsroomPipelineInput = {
    title: clean(rawInput.title, 180),
    content: clean(rawInput.content),
    source: clean(rawInput.source, 500),
    author: clean(rawInput.author, 120),
    county: clean(rawInput.county, 100),
    category: clean(rawInput.category, 100),
    language: rawInput.language || "English",
    targetLanguages: rawInput.targetLanguages || [],
    mode: rawInput.mode || "draft",
  };

  if (!input.content) {
    throw new Error("Content is required");
  }

  if (!ai) {
    return fallbackOutput(input);
  }

  const prompt = `You are the coordinated Knews254 Newsroom Intelligence Desk. Run these roles in order: ${AGENTS.join(", ")}.

Your job is not to invent facts. Separate facts explicitly present in the supplied material from claims requiring verification. Treat the source as unverified unless the text includes usable attribution. Never fabricate sources, quotations, statistics, URLs, or confirmation. Do not reveal hidden chain-of-thought; provide only concise editorial rationales and actionable evidence requirements.

Editorial rules:
- A human editor must approve publication.
- External social publishing is disabled. Return drafts only; never claim that anything was posted.
- Flag legal, safety, privacy, defamation, election, health, and breaking-news risks.
- Keep translations faithful and mark them for language-editor review.
- Generate SEO metadata without keyword stuffing.
- Write platform-specific social drafts, each with approvalRequired=true and publishStatus='draft'.
- If evidence is insufficient, use verdict='insufficient_evidence' and confidence no higher than 35.

Return only valid JSON matching this shape exactly:
{
  "status": "draft" | "needs_human_review",
  "headline": "string",
  "executiveSummary": "string",
  "keyFacts": ["string"],
  "claimsForVerification": ["string"],
  "verification": {"verdict":"verified_pending_review"|"mixed"|"insufficient_evidence","confidence":0,"rationale":"string","evidenceNeeded":["string"]},
  "editorial": {"angle":"string","risks":["string"],"missingContext":["string"],"recommendedActions":["string"]},
  "seo": {"slug":"string","metaTitle":"string","metaDescription":"string","keywords":["string"]},
  "translations": [{"language":"English"|"Kiswahili"|"Sheng","headline":"string","summary":"string"}],
  "socialDrafts": [{"platform":"linkedin"|"instagram"|"x"|"whatsapp","copy":"string","hashtags":["string"],"approvalRequired":true,"publishStatus":"draft"}],
  "audit": {"agentsRun":["string"],"sourceProvided":true,"externalPublishing":"disabled","humanApprovalRequired":true}
}

Input article:
Title: ${JSON.stringify(input.title)}
Content: ${JSON.stringify(input.content)}
Source: ${JSON.stringify(input.source || "Not supplied")}
Author: ${JSON.stringify(input.author || "Not supplied")}
County: ${JSON.stringify(input.county || "Not supplied")}
Category: ${JSON.stringify(input.category || "Not supplied")}
Language: ${JSON.stringify(input.language)}
Target translation languages: ${JSON.stringify(input.targetLanguages)}
Mode: ${JSON.stringify(input.mode)}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  const parsed = parseModelJson(response.text || "{}");
  return {
    ...parsed,
    status: "needs_human_review",
    audit: {
      ...parsed.audit,
      agentsRun: AGENTS,
      sourceProvided: Boolean(input.source),
      externalPublishing: "disabled",
      humanApprovalRequired: true,
    },
    socialDrafts: (parsed.socialDrafts || []).map((draft) => ({
      ...draft,
      approvalRequired: true,
      publishStatus: "draft",
    })),
  };
}
