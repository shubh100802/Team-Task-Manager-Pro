import { ProjectRole } from "@prisma/client";
import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Project title is required"),
    description: z.string().max(1000).optional().or(z.literal("")),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().max(1000).optional().or(z.literal("")),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

export const projectIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

export const addMemberSchema = z.object({
  body: z
    .object({
      userId: z.string().min(1).optional(),
      email: z.string().email().optional(),
      role: z.nativeEnum(ProjectRole).default(ProjectRole.MEMBER),
    })
    .refine((value) => value.userId || value.email, {
      message: "Either userId or email is required",
      path: ["userId"],
    }),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

export const removeMemberSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1),
    userId: z.string().min(1),
  }),
  query: z.object({}).optional(),
});
