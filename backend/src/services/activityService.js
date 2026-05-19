import { prisma } from "../lib/prisma.js";

export async function logActivity({ action, message, userId, projectId, taskId }) {
  await prisma.activityLog.create({
    data: {
      action,
      message,
      userId,
      projectId,
      taskId,
    },
  });
}
