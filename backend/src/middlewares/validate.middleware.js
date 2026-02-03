import { z } from "zod";

const MAX_TEXT_LENGTH = 50000; // 50k chars
const MIN_TEXT_LENGTH = 50;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]

const schema = z.object({
  resume: z.string().trim().min(MIN_TEXT_LENGTH, "Resume must be at least 50 characters").max(MAX_TEXT_LENGTH, "Resume must be at most 50000 characters").optional(),
  jd: z.string().trim().min(MIN_TEXT_LENGTH, "Job Description must be at least 50 characters").max(MAX_TEXT_LENGTH, "Job Description must be at most 50000 characters").optional(),
})

export default function validate(req, res, next) {
  try {
    // Validate body with Zod
    schema.parse(req.body);

    const resumeText = req.body.resume?.trim();
    const jdText = req.body.jd?.trim();

    const resumeFile = req.files?.resumeFile?.[0];
    const jdFile = req.files?.jdFile?.[0];

    if (!resumeText && !resumeFile) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Resume is required (text or file)"
      })
    }

    if (!jdText && !jdFile) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Job Description is required (text or file)"
      })
    }

    // Validate file resume
    if (resumeFile) {
      if (!ALLOWED_TYPES.includes(resumeFile.mimetype)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Resume file type is not supported. Allowed types: PDF, DOC, DOCX, TXT"
        })
      }

      if (resumeFile.size > MAX_FILE_SIZE) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Resume file size must be less than 20MB"
        })
      }
    }

    // Validate file JD
    if (jdFile) {
      if (!ALLOWED_TYPES.includes(jdFile.mimetype)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Job Description file type is not supported. Allowed types: PDF, DOC, DOCX, TXT"
        })
      }

      if (jdFile.size > MAX_FILE_SIZE) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Job Description file size must be less than 20MB"
        })
      }
    }

    // Validate text length
    if (resumeText && (resumeText.length < MIN_TEXT_LENGTH || resumeText.length > MAX_TEXT_LENGTH)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Resume text must be between 50 and 50000 characters"
      })
    }

    if (jdText && (jdText.length < MIN_TEXT_LENGTH || jdText.length > MAX_TEXT_LENGTH)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Job Description text must be between 50 and 50000 characters"
      })
    }

    next();
  } catch (error) {
    // Pass ZodError to the global error handler
    next(error);
  }
}
