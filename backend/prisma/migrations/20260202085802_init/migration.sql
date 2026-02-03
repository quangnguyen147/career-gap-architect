-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "cacheKey" TEXT NOT NULL,
    "resume" TEXT NOT NULL,
    "jd" TEXT NOT NULL,
    "missingSkills" TEXT[],
    "learningSteps" TEXT[],
    "interviewQuestions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Analysis_cacheKey_key" ON "Analysis"("cacheKey");

-- CreateIndex
CREATE INDEX "Analysis_cacheKey_idx" ON "Analysis"("cacheKey");
