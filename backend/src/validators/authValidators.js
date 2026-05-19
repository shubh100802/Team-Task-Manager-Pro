import { z } from "zod";

const email = z.string().email("A valid email address is required");
const password = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(64, "Password cannot exceed 64 characters");

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email,
    password,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email,
    password,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(10, "Reset token is required"),
    password,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
