import crypto from 'crypto';

export function createHash(resume, jd) {
  return crypto.createHash("sha256").update(resume + jd).digest("hex");
}
