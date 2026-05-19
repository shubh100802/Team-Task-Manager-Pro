import { z } from "zod";

export const assistantContextSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    route: z.string().default("/dashboard"),
  }),
});

export const assistantChatSchema = z.object({
  body: z.object({
    route: z.string().default("/dashboard"),
    message: z.string().min(2, "Message is required"),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
