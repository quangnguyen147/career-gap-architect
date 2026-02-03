export function sanitizeText(text) {
  if (!text) return "";
  return text
    .replace(/\u0000/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isTooShort(text, min = 50) {
  return !text || text.length < min;
}

export function isGibberish(text) {
  const wordCount = (text.match(/[a-zA-Z]{3,}/g) || []).length;
  const ratio = wordCount / Math.max(text.length, 1);
  return wordCount < 5 || ratio < 0.02;
}

export function guardInput(resume, jd) {
  resume = sanitizeText(resume);
  jd = sanitizeText(jd);

  if (isTooShort(resume)) {
    const error = new Error("Resume must be at least 50 characters and contain meaningful content");
    error.status = 400;
    throw error;
  }

  if (isTooShort(jd)) {
    const error = new Error("Job description must be at least 50 characters and contain meaningful content");
    error.status = 400;
    throw error;
  }

  if (isGibberish(resume)) {
    const error = new Error("Resume content appears to be invalid or not meaningful");
    error.status = 400;
    throw error;
  }

  if (isGibberish(jd)) {
    const error = new Error("Job description content appears to be invalid or not meaningful");
    error.status = 400;
    throw error;
  }

  return { resume, jd };
}
