import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { fetchDashboardStatsRequest } from "../api/dashboardApi";
import PriorityBarChart from "../components/dashboard/PriorityBarChart";
import ProductivityChart from "../components/dashboard/ProductivityChart";
import StatCard from "../components/dashboard/StatCard";
import TaskStatusChart from "../components/dashboard/TaskStatusChart";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import { formatDateTime } from "../utils/format";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchDashboardStatsRequest();
        setStats(response);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <Spinner label="Building your dashboard..." />;
  }

  if (!stats) {
    return <EmptyState title="No analytics yet" description="Create a project and tasks to unlock dashboard insights." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Overview</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-white">Project health at a glance</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">Monitor workload, unblock delivery, and keep your team aligned from one clean dashboard.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate("/projects")}>New Project</Button>
          <Button variant="secondary" onClick={() => navigate("/tasks")}>
            Review Tasks
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Projects" value={stats.totalProjects} hint="Active workspaces you can access" />
        <StatCard title="Total Tasks" value={stats.totalTasks} hint="Tasks visible in your current scope" />
        <StatCard title="Overdue Tasks" value={stats.overdueTasks.length} hint="Needs attention to stay on track" />
        <StatCard title="Recent Activity" value={stats.recentActivity.length} hint="Latest project and task updates" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TaskStatusChart data={stats.tasksByStatus} />
        <PriorityBarChart data={stats.tasksByPriority} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <ProductivityChart data={stats.tasksPerUser} />
        <Card className="p-5">
          <div className="mb-4">
            <h3 className="font-display text-xl font-bold text-white">Upcoming Deadlines</h3>
            <p className="text-sm text-slate-400">Tasks that need immediate focus.</p>
          </div>
          <div className="space-y-3">
            {stats.overdueTasks.length ? (
              stats.overdueTasks.slice(0, 6).map((task) => (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4" key={task.id}>
                  <p className="font-semibold text-white">{task.title}</p>
                  <p className="mt-1 text-sm font-medium text-amber-300">Due {formatDateTime(task.dueDate)}</p>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">No overdue tasks. Nice work.</p>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="mb-4">
          <h3 className="font-display text-xl font-bold text-white">Recent Activity</h3>
          <p className="text-sm text-slate-400">What changed most recently across your workspace.</p>
        </div>
        <div className="space-y-4">
          {stats.recentActivity.length ? (
            stats.recentActivity.map((activity) => (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4" key={activity.id}>
                <div>
                  <p className="font-medium text-white">{activity.message}</p>
                  <p className="text-sm text-slate-400">
                    {activity.user?.name} {activity.project ? `in ${activity.project.title}` : ""}
                  </p>
                </div>
                <span className="text-xs text-slate-500">{formatDateTime(activity.createdAt)}</span>
              </div>
            ))
          ) : (
            <EmptyState title="No activity yet" description="Actions will show up here as your team starts using the app." />
          )}
        </div>
      </Card>
    </div>
  );
}
