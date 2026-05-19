import { prisma } from "../lib/prisma.js";
import { verifyToken } from "../utils/auth.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authMiddleware = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication token is missing");
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    throw new ApiError(401, "Invalid authentication token");
  }

  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  next();
});
