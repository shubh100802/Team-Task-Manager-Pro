import { ProjectRole, TaskStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export async function getDashboardStats(userId) {
  const memberships = await prisma.projectMember.findMany({
    where: { userId },
    select: {
      projectId: true,
      role: true,
    },
  });

  const projectIds = memberships.map((membership) => membership.projectId);
  const adminProjectIds = memberships
    .filter((membership) => membership.role === ProjectRole.ADMIN)
    .map((membership) => membership.projectId);

  const taskScope = adminProjectIds.length
    ? {
        OR: [
          { projectId: { in: adminProjectIds } },
          { assignedTo: userId },
        ],
      }
    : {
        assignedTo: userId,
      };

  const [totalTasks, tasks, recentActivity, totalProjects] = await Promise.all([
    prisma.task.count({ where: taskScope }),
    prisma.task.findMany({
      where: taskScope,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.activityLog.findMany({
      where: {
        OR: [
          { projectId: { in: projectIds } },
          { userId },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.project.count({
      where: {
        id: { in: projectIds },
      },
    }),
  ]);

  const tasksByStatus = Object.values(TaskStatus).map((status) => ({
    status,
    count: tasks.filter((task) => task.status === status).length,
  }));

  const tasksByPriority = ["LOW", "MEDIUM", "HIGH"].map((priority) => ({
    priority,
    count: tasks.filter((task) => task.priority === priority).length,
  }));

  const tasksPerUserMap = new Map();

  tasks.forEach((task) => {
    const key = task.assignee?.id || "unassigned";
    const existing = tasksPerUserMap.get(key) || {
      userId: key,
      name: task.assignee?.name || "Unassigned",
      total: 0,
      done: 0,
    };

    existing.total += 1;
    if (task.status === TaskStatus.DONE) {
      existing.done += 1;
    }

    tasksPerUserMap.set(key, existing);
  });

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE;
  });

  return {
    totalProjects,
    totalTasks,
    tasksByStatus,
    tasksByPriority,
    tasksPerUser: [...tasksPerUserMap.values()],
    overdueTasks,
    recentActivity,
  };
}
