import { redis } from "../config/redis.config.js";
import { createHash } from "../utils/hash.util.js";
import prisma from "../config/prisma.config.js";
import { workerPool } from "./workerPool.service.js";

const CACHE_TTL = 60 * 60 * 24; // 24 hours

// enrich result with hasgap and message
function enrichResult(result, cached = false) {
  const hasGap =
    result.missingSkills?.length > 0 ||
    result.learningSteps?.length > 0 ||
    result.interviewQuestions?.length > 0;

  const message = hasGap
    ? "Analysis complete. We've identified areas where you can improve your profile."
    : "Great! Your resume matches all requirements in the job description.";

  return {
    hasGap,
    message,
    ...result,
    cached,
  };
}

export async function runAnalysis(resume, jd) {
  const cacheKey = createHash(resume, jd);

  // Redis read
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      return enrichResult(data, true);
    }
  } catch (error) {
    console.warn("Redis read failed: ", error.message);
  }

  // Database readed
  try {
    const db = await prisma.analysis.findUnique({ where: { cacheKey } });
    if (db) {
      return enrichResult(db, true);
    }
  } catch (error) {
    throw { status: 503, message: "Database unavailable" };
  }

  // AI Analysis
  let result = await workerPool.exec(
    { resume, jd },
    { timeout: 600000, retries: 2 },
  );

  if (result.invalid) {
    const error = new Error(result.reason);
    error.status = 400;
    throw error;
  }

  // Database write
  try {
    await prisma.analysis.create({
      data: {
        cacheKey,
        resume,
        jd,
        missingSkills: result.missingSkills,
        learningSteps: result.learningSteps,
        interviewQuestions: result.interviewQuestions,
      },
    });
  } catch (error) {
    console.warn("Database write failed: ", error.message);
  }

  // Redis write
  try {
    await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(result));
  } catch (error) {
    console.warn("Redis write failed: ", error.message);
  }

  return enrichResult(result, false);
}
