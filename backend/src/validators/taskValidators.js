import { TaskPriority, TaskStatus } from "@prisma/client";
import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Task title is required"),
    description: z.string().max(1500).optional().or(z.literal("")),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    dueDate: z.string().datetime().optional().or(z.literal("")),
    assignedTo: z.string().optional().or(z.literal("")),
    projectId: z.string().min(1, "projectId is required"),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().max(1500).optional().or(z.literal("")),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    dueDate: z.string().datetime().optional().or(z.literal("")),
    assignedTo: z.string().optional().or(z.literal("")),
    projectId: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

export const taskIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});
