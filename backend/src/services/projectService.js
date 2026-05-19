import { ActivityAction, ProjectRole } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { ensureProjectAdmin, getProjectMembership } from "../utils/projectAccess.js";
import { logActivity } from "./activityService.js";

const projectInclude = {
  members: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  },
  tasks: {
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  },
};

export async function createProject(data, userId) {
  const project = await prisma.project.create({
    data: {
      title: data.title,
      description: data.description || null,
      createdBy: userId,
      members: {
        create: {
          userId,
          role: ProjectRole.ADMIN,
        },
      },
    },
    include: projectInclude,
  });

  await logActivity({
    action: ActivityAction.PROJECT_CREATED,
    message: `Project "${project.title}" was created`,
    userId,
    projectId: project.id,
  });

  return project;
}

export async function getProjects(userId) {
  const memberships = await prisma.projectMember.findMany({
    where: { userId },
    include: {
      project: {
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  createdAt: true,
                },
              },
            },
          },
          _count: {
            select: {
              tasks: true,
              members: true,
            },
          },
          tasks: {
            take: 3,
            orderBy: {
              createdAt: "desc",
            },
            include: {
              assignee: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return memberships.map((membership) => ({
    ...membership.project,
    currentUserRole: membership.role,
  }));
}

export async function getProjectById(projectId, userId) {
  const membership = await getProjectMembership(projectId, userId);

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: projectInclude.members,
      tasks: {
        ...projectInclude.tasks,
        where: membership.role === ProjectRole.ADMIN ? undefined : { assignedTo: userId },
      },
      activities: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return {
    ...project,
    currentUserRole: membership?.role,
  };
}

export async function updateProject(projectId, data, userId) {
  await ensureProjectAdmin(projectId, userId);

  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      title: data.title,
      description: data.description === "" ? null : data.description,
    },
  });

  await logActivity({
    action: ActivityAction.PROJECT_UPDATED,
    message: `Project "${project.title}" was updated`,
    userId,
    projectId,
  });

  return project;
}

export async function deleteProject(projectId, userId) {
  await ensureProjectAdmin(projectId, userId);

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return project;
}

export async function addProjectMember(projectId, payload, userId) {
  await ensureProjectAdmin(projectId, userId);

  const targetUser = payload.userId
    ? await prisma.user.findUnique({ where: { id: payload.userId } })
    : await prisma.user.findUnique({ where: { email: payload.email } });

  if (!targetUser) {
    throw new ApiError(404, "User not found");
  }

  const existingMembership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: targetUser.id,
        projectId,
      },
    },
  });

  if (existingMembership) {
    throw new ApiError(409, "User is already a member of this project");
  }

  const membership = await prisma.projectMember.create({
    data: {
      projectId,
      userId: targetUser.id,
      role: payload.role || ProjectRole.MEMBER,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
    },
  });

  await logActivity({
    action: ActivityAction.MEMBER_ADDED,
    message: `${targetUser.name} joined the project`,
    userId,
    projectId,
  });

  return membership;
}

export async function removeProjectMember(projectId, memberUserId, userId) {
  await ensureProjectAdmin(projectId, userId);

  const membership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: memberUserId,
        projectId,
      },
    },
    include: {
      user: true,
    },
  });

  if (!membership) {
    throw new ApiError(404, "Project member not found");
  }

  if (membership.role === ProjectRole.ADMIN) {
    const adminCount = await prisma.projectMember.count({
      where: {
        projectId,
        role: ProjectRole.ADMIN,
      },
    });

    if (adminCount <= 1) {
      throw new ApiError(400, "You cannot remove the last admin from a project");
    }
  }

  await prisma.projectMember.delete({
    where: {
      userId_projectId: {
        userId: memberUserId,
        projectId,
      },
    },
  });

  await logActivity({
    action: ActivityAction.MEMBER_REMOVED,
    message: `${membership.user.name} was removed from the project`,
    userId,
    projectId,
  });

  return membership;
}
