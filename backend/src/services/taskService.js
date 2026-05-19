import { ActivityAction, ProjectRole } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { ensureProjectAdmin, getProjectMembership } from "../utils/projectAccess.js";
import { logActivity } from "./activityService.js";

const taskInclude = {
  assignee: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  project: {
    select: {
      id: true,
      title: true,
    },
  },
  creator: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

async function ensureAssignable(projectId, assignedTo) {
  if (!assignedTo) {
    return null;
  }

  const membership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: assignedTo,
        projectId,
      },
    },
  });

  if (!membership) {
    throw new ApiError(400, "Assigned user is not a member of this project");
  }

  return assignedTo;
}

export async function createTask(data, userId) {
  await ensureProjectAdmin(data.projectId, userId);
  await ensureAssignable(data.projectId, data.assignedTo);

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description || null,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      assignedTo: data.assignedTo || null,
      projectId: data.projectId,
      createdBy: userId,
    },
    include: taskInclude,
  });

  await logActivity({
    action: ActivityAction.TASK_CREATED,
    message: `Task "${task.title}" was created`,
    userId,
    projectId: task.projectId,
    taskId: task.id,
  });

  return task;
}

export async function getTasks({ projectId, status, priority, search }, user) {
  const membershipProjectIds = await prisma.projectMember.findMany({
    where: { userId: user.id },
    select: { projectId: true, role: true },
  });

  const accessibleProjectIds = membershipProjectIds.map((item) => item.projectId);
  const adminProjectIds = membershipProjectIds
    .filter((item) => item.role === ProjectRole.ADMIN)
    .map((item) => item.projectId);

  if (projectId && !accessibleProjectIds.includes(projectId)) {
    throw new ApiError(403, "You do not have access to these tasks");
  }

  const where = {
    AND: [
      {
        projectId: projectId || { in: accessibleProjectIds },
      },
      ...(status ? [{ status }] : []),
      ...(priority ? [{ priority }] : []),
      ...(search
        ? [
            {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            },
          ]
        : []),
    ],
  };

  if (!projectId || !adminProjectIds.includes(projectId)) {
    where.AND.push({
      assignedTo: user.id,
    });
  }

  return prisma.task.findMany({
    where,
    include: taskInclude,
    orderBy: [
      { status: "asc" },
      { dueDate: "asc" },
      { createdAt: "desc" },
    ],
  });
}

export async function getTaskById(taskId, userId) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: taskInclude,
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const membership = await getProjectMembership(task.projectId, userId);
  const isAdmin = membership.role === ProjectRole.ADMIN;
  const isAssignee = task.assignedTo === userId;

  if (!isAdmin && !isAssignee) {
    throw new ApiError(403, "You do not have access to this task");
  }

  return task;
}

export async function updateTask(taskId, data, userId) {
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!existingTask) {
    throw new ApiError(404, "Task not found");
  }

  const membership = await getProjectMembership(existingTask.projectId, userId);
  const isAdmin = membership.role === ProjectRole.ADMIN;
  const isAssignee = existingTask.assignedTo === userId;

  if (!isAdmin && !isAssignee) {
    throw new ApiError(403, "You do not have permission to update this task");
  }

  if (!isAdmin) {
    const allowedKeys = ["status"];
    const requestedKeys = Object.keys(data).filter((key) => data[key] !== undefined);
    const invalidKey = requestedKeys.find((key) => !allowedKeys.includes(key));

    if (invalidKey) {
      throw new ApiError(403, "Members can only update the status of their assigned tasks");
    }
  }

  if (isAdmin && data.assignedTo !== undefined) {
    await ensureAssignable(existingTask.projectId, data.assignedTo || null);
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      title: data.title,
      description: data.description === "" ? null : data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : data.dueDate === "" ? null : undefined,
      assignedTo: data.assignedTo === "" ? null : data.assignedTo,
    },
    include: taskInclude,
  });

  await logActivity({
    action: isAdmin ? ActivityAction.TASK_UPDATED : ActivityAction.TASK_STATUS_UPDATED,
    message: isAdmin
      ? `Task "${updatedTask.title}" was updated`
      : `Task "${updatedTask.title}" status changed to ${updatedTask.status}`,
    userId,
    projectId: updatedTask.projectId,
    taskId: updatedTask.id,
  });

  return updatedTask;
}

export async function deleteTask(taskId, userId) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await ensureProjectAdmin(task.projectId, userId);

  const deletedTask = await prisma.task.delete({
    where: { id: taskId },
  });

  await logActivity({
    action: ActivityAction.TASK_DELETED,
    message: `Task "${deletedTask.title}" was deleted`,
    userId,
    projectId: deletedTask.projectId,
    taskId: deletedTask.id,
  });

  return deletedTask;
}
