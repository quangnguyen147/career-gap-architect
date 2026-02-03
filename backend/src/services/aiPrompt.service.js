import { model } from "../config/gemini.config.js";
import { z } from "zod";

const aiSchema = z.union([
  // Invalid response with reason
  z.object({
    invalid: z.literal(true),
    reason: z.string(),
  }),
  // Valid response with explicit invalid: false
  z.object({
    invalid: z.literal(false),
    missingSkills: z.array(z.string()),
    learningSteps: z.array(z.string()),
    interviewQuestions: z.array(z.string()),
  }),
  // Valid response without invalid field (AI often returns this)
  z.object({
    missingSkills: z.array(z.string()),
    learningSteps: z.array(z.string()),
    interviewQuestions: z.array(z.string()),
  }),
]);

export async function analyzeAI(resume, jd, retry = 3) {
  const prompt = `
You are a senior technical recruiter, resume auditor, and career gap architect AI.

Your job has TWO PHASES: VALIDATION and ANALYSIS.

====================
PHASE 1 — VALIDATION
====================

First, inspect both inputs carefully.

Decide:

- Is Resume a real personal resume (skills, experience, projects, timeline, achievements, tools used)?
- Is Job Description a real hiring description (role, responsibilities, requirements, expectations)?

If ANY condition below is true, return INVALID and STOP:

- Resume looks like a job posting, marketing text, company intro, or requirement list.
- Job Description looks like a personal resume.
- Either input is meaningless, random, too short, generic, or lacks professional career context.
- Either input does not contain enough concrete technical information to analyze.
- Resume and Job Description are essentially the same type of text.

When INVALID, return ONLY this JSON and nothing else:

{
  "invalid": true,
  "reason": "<short, clear, technical reason>"
}

Do NOT continue to analysis if invalid.

====================
PHASE 2 — ANALYSIS
====================

Only run this phase if inputs are VALID.

Task:
Perform a strict semantic gap analysis between Resume and Job Description.

Rules:

- Compare meaning, not just keywords.
- Only use requirements that appear explicitly in the Job Description.
- Only list skills that are truly missing from the Resume.
- Every missing skill must be directly traceable to the Job Description.
- Do NOT invent tools, platforms, methodologies, metrics, or responsibilities.
- Do NOT use generic skills like: communication, teamwork, leadership, problem solving.
- Be technical, concrete, role-specific, and concise.

If the Resume already satisfies the Job Description, return EMPTY arrays. Do NOT guess.

Output constraints:

- missingSkills: maximum 5 items.
- learningSteps: exactly 3 concrete, actionable, technical steps.
- interviewQuestions: exactly 3 technical questions that test the missing skills.

Return ONLY valid JSON.
No markdown. No explanation. No extra text.

Schema:

{
  "missingSkills": string[],
  "learningSteps": string[],
  "interviewQuestions": string[]
}

====================
INPUTS
====================

Resume:
${resume}

Job Description:
${jd}
  `;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const clean = text.replace(/```json|```/g, "").trim();
    console.log("🔍 Cleaned AI response:", clean);
    const json = JSON.parse(clean);
    console.log("📦 Parsed JSON:", json);

    return aiSchema.parse(json);
  } catch (error) {
    if (retry > 0) {
      console.log("GEMINI are retrying...: ", retry);
      return analyzeAI(resume, jd, retry - 1);
    }

    console.error("GEMINI failed: ", error);
    throw new Error("GEMINI failed to analyze");
  }
}
