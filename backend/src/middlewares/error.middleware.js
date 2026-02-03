import { ZodError } from "zod";
import multer from "multer";
import { Prisma } from "@prisma/client";

export default function ErrorHandler(err, req, res, next) {
  console.error("❌ Error: ", err);

  let status = 500;
  let message = "Internal Server error!";
  let errors = null;

  if (err instanceof ZodError) {
    status = 400;
    message = "Validation failed";
    const zodErrors = err.errors || err.issues || [];
    if (zodErrors.length > 0) {
      errors = zodErrors.map(e => ({
        field: e.path?.join('.') || 'unknown',
        message: e.message
      }));
    }
  } else if (err instanceof multer.MulterError) {
    status = 400;
    message = err.message
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    status = 500;
    message = "Database error"
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    status = 400;
    message = "Invalid database query"
  } else if (err.status) {
    status = err.status;
    message = err.message;
  } else if (err.message) {
    // Generic errors with message (like from inputGuard)
    status = 400;
    message = err.message;
  }

  const response = {
    success: false,
    status,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  res.status(status).json(response);
}
