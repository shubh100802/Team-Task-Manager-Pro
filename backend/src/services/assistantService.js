import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const allowedKeywords = [
  "task",
  "tasks",
  "project",
  "projects",
  "deadline",
  "deadlines",
  "priority",
  "productivity",
  "workload",
  "analytics",
  "overdue",
  "today",
  "summary",
  "workspace",
  "assignment",
  "assignments",
];

function isWorkspaceQuestion(message) {
  const lower = message.toLowerCase();
  return allowedKeywords.some((keyword) => lower.includes(keyword));
}

function buildRouteGuidance(route, snapshot) {
  if (route.includes("/login")) {
    return "Welcome back. Enter your credentials to access your workspace.";
  }

  if (route.includes("/signup")) {
    return "Create your workspace account to start collaborating with your team.";
  }

  if (route.includes("/dashboard")) {
    return `You currently have ${snapshot.overdueTasks.length} overdue tasks and ${snapshot.highPriorityOpenTasks.length} high-priority open tasks.`;
  }

  if (route.includes("/projects")) {
    return `You are managing ${snapshot.totalProjects} active projects in your accessible workspace.`;
  }

  if (route.includes("/tasks")) {
    return `You have ${snapshot.pendingTasks.length} pending tasks and ${snapshot.approachingTasks.length} approaching deadlines.`;
  }

  return "I can help with your tasks, projects, deadlines, and productivity workflows in this workspace.";
}

export async function getWorkspaceSnapshot(userId) {
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

  const projectIds = user?.memberships.map((membership) => membership.projectId) || [];

  const tasks = await prisma.task.findMany({
    where: {
      projectId: {
        in: projectIds,
      },
    },
    include: {
      project: {
        select: {
          id: true,
          title: true,
        },
      },
      assignee: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      dueDate: "asc",
    },
  });

  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const overdueTasks = tasks.filter((task) => task.dueDate && new Date(task.dueDate) < now && task.status !== "DONE");
  const approachingTasks = tasks.filter(
    (task) => task.dueDate && new Date(task.dueDate) >= now && new Date(task.dueDate) <= in24Hours && task.status !== "DONE",
  );
  const highPriorityOpenTasks = tasks.filter((task) => task.priority === "HIGH" && task.status !== "DONE");
  const pendingTasks = tasks.filter((task) => task.status !== "DONE");
  const assignedToUser = tasks.filter((task) => task.assignedTo === userId);

  const recentActivity = await prisma.activityLog.findMany({
    where: {
      OR: [{ userId }, { projectId: { in: projectIds } }],
    },
    include: {
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
  });

  return {
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      : null,
    totalProjects: projectIds.length,
    totalTasks: tasks.length,
    pendingTasks,
    overdueTasks,
    approachingTasks,
    highPriorityOpenTasks,
    assignedToUser,
    recentActivity,
  };
}

export async function getAssistantContext(userId, route) {
  const snapshot = await getWorkspaceSnapshot(userId);

  return {
    route,
    guidance: buildRouteGuidance(route, snapshot),
    snapshot,
  };
}

function summarizeSnapshot(snapshot) {
  return {
    totalProjects: snapshot.totalProjects,
    totalTasks: snapshot.totalTasks,
    pendingTasks: snapshot.pendingTasks.map((task) => ({
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate,
      project: task.project?.title,
    })),
    overdueTasks: snapshot.overdueTasks.map((task) => ({
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate,
      project: task.project?.title,
    })),
    approachingTasks: snapshot.approachingTasks.map((task) => ({
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate,
      project: task.project?.title,
    })),
    highPriorityOpenTasks: snapshot.highPriorityOpenTasks.map((task) => ({
      title: task.title,
      dueDate: task.dueDate,
      project: task.project?.title,
    })),
  };
}

export async function chatWithAssistant({ userId, route, message }) {
  const snapshot = await getWorkspaceSnapshot(userId);

  if (!isWorkspaceQuestion(message)) {
    return {
      source: "local",
      answer:
        "I’m designed to help with tasks, projects, deadlines, analytics, and productivity workflows inside this workspace.",
    };
  }

  if (!env.GEMINI_API_KEY) {
    return {
      source: "local",
      answer: buildRouteGuidance(route, snapshot),
    };
  }

  const prompt = [
    "You are a professional workspace productivity assistant inside a team task manager.",
    "You must only answer questions about tasks, projects, deadlines, productivity, workload, and analytics.",
    "If the question is unrelated, redirect the user back to workspace topics.",
    "Keep the answer concise, practical, and focused.",
    `Current route: ${route}`,
    `Workspace summary: ${JSON.stringify(summarizeSnapshot(snapshot))}`,
    `User question: ${message}`,
  ].join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 220,
        },
      }),
    },
  );

  if (!response.ok) {
    throw new ApiError(502, "Assistant AI provider is currently unavailable");
  }

  const data = await response.json();
  const answer = data.candidates?.[0]?.content?.parts?.map((part) => part.text).join(" ").trim();

  return {
    source: "ai",
    answer: answer || buildRouteGuidance(route, snapshot),
  };
}
