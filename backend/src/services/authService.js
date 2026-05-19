import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { comparePassword, generateToken, hashPassword } from "../utils/auth.js";
import { ApiError } from "../utils/ApiError.js";
import { createRandomToken, hashToken } from "../utils/crypto.js";
import { addMinutes } from "../utils/date.js";
import { sanitizeUser } from "../utils/serialize.js";

export async function signup(payload) {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists");
  }

  const user = await prisma.user.create({
    data: {
      ...payload,
      password: await hashPassword(payload.password),
    },
  });

  const token = generateToken(user.id);

  return {
    token,
    user: sanitizeUser(user),
  };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user.id);

  return {
    token,
    user: sanitizeUser(user),
  };
}

export async function getCurrentUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      memberships: {
        include: {
          project: true,
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return sanitizeUser(user);
}

export async function forgotPassword(email) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      message: "If an account exists for that email, a reset link has been generated.",
    };
  }

  const rawToken = createRandomToken();
  const hashedToken = hashToken(rawToken);
  const expiresAt = addMinutes(new Date(), 30);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: hashedToken,
      resetTokenExpiresAt: expiresAt,
    },
  });

  const resetPath = `/reset-password?token=${rawToken}`;
  const resetUrl = `${env.CLIENT_URL}${resetPath}`;

  return {
    message: "Password reset instructions generated successfully.",
    resetToken: env.NODE_ENV !== "production" ? rawToken : undefined,
    resetUrl: env.NODE_ENV !== "production" ? resetUrl : undefined,
    expiresAt,
  };
}

export async function resetPassword(token, password) {
  const hashedToken = hashToken(token);

  const user = await prisma.user.findFirst({
    where: {
      resetToken: hashedToken,
      resetTokenExpiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new ApiError(400, "Reset token is invalid or has expired");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: await hashPassword(password),
      resetToken: null,
      resetTokenExpiresAt: null,
    },
  });

  return {
    message: "Password reset successfully. You can now log in with your new password.",
  };
}
