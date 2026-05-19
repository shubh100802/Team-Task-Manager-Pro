import { ProjectRole } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "./ApiError.js";

export async function getProjectMembership(projectId, userId) {
  const membership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });

  if (!membership) {
    throw new ApiError(403, "You do not have access to this project");
  }

  return membership;
}

export async function ensureProjectAdmin(projectId, userId) {
  const membership = await getProjectMembership(projectId, userId);

  if (membership.role !== ProjectRole.ADMIN) {
    throw new ApiError(403, "Admin access is required for this project");
  }

  return membership;
}
