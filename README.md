!Status
!React
!Node.js
!PostgreSQL
!Prisma
!AI Powered

# Team Task Manager Pro

A modern AI-powered full-stack team collaboration and productivity management platform.

> **Live Demo:** Coming Soon | **Frontend Repo:** Link | **Backend Repo:** Link

## Overview

Team Task Manager Pro is a scalable, SaaS-grade workspace designed to streamline collaboration, monitor progress, and elevate team efficiency. Leveraging AI-driven insights and a robust Kanban-based workflow, it empowers teams to effortlessly manage projects and tasks while maintaining granular role-based access control.

## Key Highlights

- **AI Productivity Assistant**: Context-aware suggestions and smart task insights.
- **Role-Based Access Control**: Secure `ADMIN` and `MEMBER` workflows.
- **Kanban Workflow**: Visual task progression.
- **Enterprise-Ready Authentication**: Secure JWT and bcrypt integration.
- **Analytics Dashboard**: Real-time project and task metrics.

## Tech Stack

- **Frontend:** React, Vite, TailwindCSS, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL, Prisma ORM
- **Authentication:** JWT Authentication, bcrypt
- **Deployment:** Render, Neon PostgreSQL
- **AI Integration:** Context-aware assistant (Gemini/OpenAI)

## Features

### Authentication & Security
- Signup, Login, and Forgot Password flow
- JWT protected API routes
- Role-based authorization

### Project Management
- Create and manage distinct projects
- Assign and manage team members securely
- Role-based project isolation

### Task Management
- Comprehensive task creation and assignment
- Track priorities and due dates
- Kanban-based status management
- Real-time task status updates

### Analytics Dashboard
- Productivity analytics and team insights
- Tracking of overdue tasks and recent activity
- Detailed reporting metrics

### AI Productivity Assistant
- Smart workspace notifications
- Context-aware task reminders
- Automated productivity suggestions and insights

## Architecture

```text
React Frontend → Express API → Prisma ORM → PostgreSQL Database
```

## Folder Structure

```text
team-task-manager/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── app.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── package.json
├── railway.json
└── README.md
```

## Database Design

Main entities:

- `users`
- `projects`
- `project_members`
- `tasks`
- `activity_logs`

Enums:

- `ProjectRole`: `ADMIN`, `MEMBER`
- `TaskStatus`: `TODO`, `IN_PROGRESS`, `DONE`
- `TaskPriority`: `LOW`, `MEDIUM`, `HIGH`

Prisma schema is defined in [backend/prisma/schema.prisma](/d:/etharaAI/backend/prisma/schema.prisma:1).

## API Documentation

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Projects

- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/members`
- `DELETE /api/projects/:id/members/:userId`

### Tasks

- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Dashboard

- `GET /api/dashboard/stats`

### Response Shape

```json
{
  "success": true,
  "message": "Tasks fetched successfully",
  "data": []
}
```

## Environment Variables

### Backend `.env`

Copy [backend/.env.example](/d:/etharaAI/backend/.env.example:1) to `backend/.env`.

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/team_task_manager?schema=public
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
```

### Frontend `.env`

Copy [frontend/.env.example](/d:/etharaAI/frontend/.env.example:1) to `frontend/.env`.

```env
VITE_API_URL=http://localhost:5000/api
```

## Local Installation

### 1. Install dependencies

From the project root:

```bash
npm install
```

### 2. Configure PostgreSQL

Create a PostgreSQL database named `team_task_manager`, then set `DATABASE_URL` in `backend/.env`.

### 3. Generate Prisma client and push schema

```bash
cd backend
npm run prisma:generate
npm run prisma:push
```

### 4. Seed sample data

```bash
cd backend
npm run prisma:seed
```

Sample credentials:

- `admin@teamtask.com` / `Password123`
- `member@teamtask.com` / `Password123`

### 5. Start the app

From the project root:

```bash
npm run dev
```

Frontend:

- `http://localhost:5173`

Backend:

- `http://localhost:5000/api`

## Production Build

```bash
npm run build
npm run start
```

In production, the Express server serves the built Vite frontend from `frontend/dist`.

## Railway Deployment Guide

This repository is set up for a single Railway service deployment using:

- root `package.json`
- npm workspaces
- `railway.json`
- Express static serving of `frontend/dist`

### Railway steps

1. Push the repository to GitHub.
2. Create a new Railway project from the repo.
3. Add a PostgreSQL plugin or external PostgreSQL database.
4. Set the backend environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `CLIENT_URL`
   - `NODE_ENV=production`
5. Deploy.
6. Run Prisma migration or schema push in Railway once the database is connected.

Recommended post-deploy command:

```bash
cd backend && npm run prisma:generate && npm run prisma:migrate
```

If you prefer initial schema synchronization instead of migrations during early development:

```bash
cd backend && npm run prisma:push
```

## Security Notes

- Passwords are hashed with bcrypt
- JWT tokens use expiration
- Protected routes require bearer tokens
- Project-level admin checks are enforced server-side
- Input validation is handled with Zod
- CORS and Helmet are configured in Express
- Sensitive values are externalized through environment variables

## Screenshots

Add screenshots here after running the app:

- Login page
- Dashboard page
- Projects page
- Project details with Kanban board
- Tasks table
- Profile page

## Future Improvements

- Real-time updates with Socket.io
- Task comments and mentions
- File attachments
- Email invitations
- Notification center
- Audit export and reports
- Pagination for large datasets
- Dark mode toggle persistence

## Final Testing Checklist

1. Sign up a new user.
2. Log in as admin.
3. Create a project.
4. Add an existing user as a member.
5. Create and assign tasks.
6. Move tasks across Kanban columns.
7. Verify member can only update their own task status.
8. Verify member cannot create or delete projects/tasks.
9. Verify dashboard stats update correctly.
10. Run a production build and verify the frontend is served by Express.

## Important Notes

- The backend and frontend are intentionally separated for maintainability, but production deployment is unified through the Express server.
- Prisma migrations are not checked in because this workspace started from scratch without running a live database connection inside the session.
- If you connect a real PostgreSQL instance, run Prisma generate and migration commands before starting the backend.
