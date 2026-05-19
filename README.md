![Status](https://img.shields.io/badge/status-active-success)
![Tech](https://img.shields.io/badge/stack-React%20%2B%20Node-blue)
![Database](https://img.shields.io/badge/database-PostgreSQL-green)
![AI](https://img.shields.io/badge/AI-Gemini-purple)

# Team Task Manager Pro

A modern AI-powered full-stack team collaboration and productivity management platform with role-based access control, Kanban workflow, and intelligent productivity insights.

## 🌐 Live Demo
- Coming Soon

## 🚀 Overview
Team Task Manager Pro is a scalable, SaaS-grade workspace designed to streamline collaboration, monitor progress, and elevate team efficiency. Leveraging AI-driven insights and a robust Kanban-based workflow, it empowers teams to effortlessly manage projects and tasks while maintaining granular role-based access control.

## ⚡ Key Highlights
- **AI Productivity Assistant**: Context-aware suggestions and smart task insights
- **Role-Based Access Control**: Secure ADMIN and MEMBER workflows
- **Kanban Workflow**: Visual task progression with drag-and-drop
- **Enterprise-Ready Authentication**: Secure JWT and bcrypt integration
- **Analytics Dashboard**: Real-time project and task metrics

## 🛠 Tech Stack
### Frontend
- React 19 (Hooks + Vite)
- React Router DOM
- TailwindCSS
- Axios
- Recharts (Analytics)
- @hello-pangea/dnd (Drag & Drop)
- Lucide React (Icons)

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL
- Prisma ORM

### Authentication
- JWT (JSON Web Tokens)
- bcryptjs

### AI Integration
- Google Gemini API (Optional)

## ✨ Features
### Authentication & Security
- Signup, Login, and Forgot Password flow
- JWT protected API routes
- Role-based authorization (ADMIN/MEMBER)
- Password reset with secure tokens

### Project Management
- Create and manage distinct projects
- Assign and manage team members securely
- Role-based project isolation
- Project activity logging

### Task Management
- Comprehensive task creation and assignment
- Track priorities (Low, Medium, High) and due dates
- Kanban-based status management (Todo, In Progress, Done)
- Real-time task status updates with drag-and-drop
- Filter and search tasks by status, priority, and title

### Analytics Dashboard
- Productivity analytics and team insights
- Tracking of overdue tasks and recent activity
- Detailed reporting metrics with charts
- Task completion statistics

### AI Productivity Assistant
- Smart workspace notifications
- Context-aware task reminders
- Automated productivity suggestions and insights
- Route-specific guidance

## 🧱 Architecture
`React UI → Axios API Calls → Express Routes/Controllers → Prisma ORM → PostgreSQL`

### Folder Structure
```bash
team-task-manager/
  backend/
    prisma/
      schema.prisma
      seed.js
    src/
      config/
      controllers/
      lib/
      middleware/
      routes/
      services/
      utils/
      validators/
      app.js
    server.js
  frontend/
    src/
      api/
      components/
        assistant/
        dashboard/
        members/
        projects/
        tasks/
        ui/
      context/
      hooks/
      layouts/
      pages/
      routes/
      utils/
      main.jsx
  package.json
  railway.json
  README.md
```

## 📡 API Endpoints
### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Projects
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/members`
- `DELETE /api/projects/:id/members/:userId`

### Tasks
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Dashboard
- `GET /api/dashboard/stats`

### Assistant
- `GET /api/assistant/context`
- `POST /api/assistant/chat`

## ⚙️ Local Setup
### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database

### Installation
From the project root:

```bash
npm install
```

### Backend Configuration
Create `.env` inside `backend/`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/team_task_manager?schema=public
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=optional_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
```

### Database Setup
```bash
cd backend
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

Sample credentials:
- `admin@teamtask.com` / `Password123`
- `member@teamtask.com` / `Password123`

### Frontend Configuration
Create `.env` inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Run the Application
From the project root:

```bash
npm run dev
```

Default URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000/api`

## 💻 Run on Another System
1. Clone repository
2. Install dependencies: `npm install`
3. Configure backend `.env` with your PostgreSQL connection
4. Run database setup: `cd backend && npm run prisma:generate && npm run prisma:push`
5. Start the application: `npm run dev`

## 🚀 Production Build
```bash
npm run build
npm run start
```

In production, the Express server serves the built Vite frontend from `frontend/dist`.

## 🌐 Railway Deployment
This repository is configured for single-service Railway deployment using npm workspaces.

### Deployment Steps
1. Push repository to GitHub
2. Create new Railway project from the repo
3. Add PostgreSQL plugin
4. Set environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `CLIENT_URL`
   - `NODE_ENV=production`
   - `GEMINI_API_KEY` (optional)
5. Deploy
6. Run post-deploy command: `cd backend && npm run prisma:generate && npm run prisma:migrate`

## 🔐 Security Notes
- Passwords are hashed with bcrypt
- JWT tokens use expiration
- Protected routes require bearer tokens
- Project-level admin checks are enforced server-side
- Input validation is handled with Zod
- CORS and Helmet are configured in Express
- Sensitive values are externalized through environment variables

## 🔮 Future Improvements
- Real-time updates with Socket.io
- Task comments and mentions
- File attachments
- Email invitations
- Enhanced notification center
- Audit export and reports
- Pagination for large datasets
- Dark mode toggle persistence
- Mobile app version

## 👤 Author
**Shubham Raj Sharma**

---
Made with ❤️ and modern technologies by Shubham Raj Sharma
