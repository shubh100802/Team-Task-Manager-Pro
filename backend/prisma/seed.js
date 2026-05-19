import bcrypt from "bcryptjs";
import { PrismaClient, ProjectRole, TaskPriority, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@teamtask.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@teamtask.com",
      password,
    },
  });

  const member = await prisma.user.upsert({
    where: { email: "member@teamtask.com" },
    update: {},
    create: {
      name: "Member User",
      email: "member@teamtask.com",
      password,
    },
  });

  const project = await prisma.project.create({
    data: {
      title: "Launch Team Workspace",
      description: "Initial seeded project for local development.",
      createdBy: admin.id,
      members: {
        create: [
          { userId: admin.id, role: ProjectRole.ADMIN },
          { userId: member.id, role: ProjectRole.MEMBER },
        ],
      },
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Create onboarding checklist",
        description: "List every step new members must complete.",
        projectId: project.id,
        createdBy: admin.id,
        assignedTo: member.id,
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
      },
      {
        title: "Prepare analytics dashboard",
        description: "Confirm charts and KPIs for project health.",
        projectId: project.id,
        createdBy: admin.id,
        assignedTo: admin.id,
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
