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
  evidence?: Array<{ title?: string; url?: string; excerpt?: string }>;
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
  researchPlan: {
    questions: string[];
    preferredSources: string[];
    searchQueries: string[];
  };
  evidenceLedger: Array<{ claim: string; status: "supported" | "unsupported" | "needs_review"; evidence: string[] }>;
  selfReview: {
    passed: boolean;
    issues: string[];
    changes: string[];
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
    researchPlan: {
      questions: ["What primary record supports the central claim?", "Can an independent source corroborate the material facts?"],
      preferredSources: ["Official government records", "Court or parliamentary records", "Named on-record sources", "Independent reputable reporting"],
      searchQueries: [headline, `${headline} official source`],
    },
    evidenceLedger: [{
      claim: "Article claims",
      status: "needs_review",
      evidence: input.source ? [input.source] : [],
    }],
    selfReview: {
      passed: false,
      issues: ["AI provider unavailable; no automated second-pass review was run."],
      changes: ["Marked output as requiring human review."],
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
    evidence: Array.isArray(rawInput.evidence) ? rawInput.evidence.slice(0, 20).map((item) => ({
      title: clean(item?.title, 200),
      url: clean(item?.url, 500),
      excerpt: clean(item?.excerpt, 1_000),
    })) : [],
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
  "researchPlan": {"questions":["string"],"preferredSources":["string"],"searchQueries":["string"]},
  "evidenceLedger": [{"claim":"string","status":"supported"|"unsupported"|"needs_review","evidence":["string"]}],
  "selfReview": {"passed":false,"issues":["string"],"changes":["string"]},
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
Supplied evidence: ${JSON.stringify(input.evidence || [])}
Mode: ${JSON.stringify(input.mode)}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  const parsed = parseModelJson(response.text || "{}");
  const normalized = {
    ...parsed,
    status: "needs_human_review" as const,
    audit: {
      ...parsed.audit,
      agentsRun: AGENTS,
      sourceProvided: Boolean(input.source),
      externalPublishing: "disabled" as const,
      humanApprovalRequired: true as const,
    },
    socialDrafts: (parsed.socialDrafts || []).map((draft) => ({
      ...draft,
      approvalRequired: true as const,
      publishStatus: "draft" as const,
    })),
  };

  // Second-pass critic: check evidence discipline, uncertainty, safety, and output completeness.
  const reviewPrompt = `You are the senior Knews254 quality reviewer. Review this proposed newsroom output against the source article and supplied evidence. Do not add facts that are absent from the source or evidence. Correct unsupported certainty, fabricated attribution, unsafe language, missing risks, and malformed fields. Keep all social content as drafts. Return the complete corrected JSON object, with selfReview.passed true only when the structure and safety checks pass; otherwise list issues and changes.

Source article: ${JSON.stringify({ title: input.title, content: input.content, source: input.source, evidence: input.evidence })}
Proposed output: ${JSON.stringify(normalized)}`;

  const reviewResponse = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: reviewPrompt,
    config: { responseMimeType: "application/json" },
  });

  let reviewed: NewsroomPipelineOutput;
  try {
    reviewed = parseModelJson(reviewResponse.text || "{}");
  } catch {
    reviewed = normalized;
  }

  return {
    ...normalized,
    ...reviewed,
    status: "needs_human_review",
    audit: {
      ...normalized.audit,
      ...(reviewed.audit || {}),
      agentsRun: [...AGENTS, "senior_quality_reviewer"],
      sourceProvided: Boolean(input.source),
      externalPublishing: "disabled",
      humanApprovalRequired: true,
    },
    selfReview: {
      ...(reviewed.selfReview || normalized.selfReview),
      passed: Boolean(reviewed.selfReview?.passed),
    },
    socialDrafts: (reviewed.socialDrafts || normalized.socialDrafts).map((draft) => ({
      ...draft,
      approvalRequired: true as const,
      publishStatus: "draft" as const,
    })),
  };
}
