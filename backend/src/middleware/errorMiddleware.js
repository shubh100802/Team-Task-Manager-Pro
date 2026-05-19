import { Prisma } from "@prisma/client";

export function notFoundMiddleware(req, res) {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorMiddleware(error, _req, res, _next) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      success: false,
      message: "Database request failed",
      details: error.message,
    });
  }

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
    details: error.details || null,
  });
}
