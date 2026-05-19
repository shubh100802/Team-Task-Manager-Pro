import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchProjectsRequest } from "../api/projectApi";
import { fetchTasksRequest, updateTaskRequest } from "../api/taskApi";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import TaskFilters from "../components/tasks/TaskFilters";
import { useAssistant } from "../hooks/useAssistant";
import { useNotifications } from "../hooks/useNotifications";
import { formatDate, sentenceCase } from "../utils/format";

export default function TasksPage() {
  const { addAssistantEvent } = useAssistant();
  const { pushNotification } = useNotifications();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    projectId: "",
    projects: [],
  });

  const loadBaseData = async () => {
    try {
      const [projectResponse, taskResponse] = await Promise.all([fetchProjectsRequest(), fetchTasksRequest()]);
      setProjects(projectResponse);
      setTasks(taskResponse);
      setFilters((prev) => ({ ...prev, projects: projectResponse }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBaseData();
  }, []);

  useEffect(() => {
    if (loading) return;

    const timeout = setTimeout(async () => {
      try {
        const response = await fetchTasksRequest({
          search: filters.search || undefined,
          status: filters.status || undefined,
          priority: filters.priority || undefined,
          projectId: filters.projectId || undefined,
        });
        setTasks(response);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to filter tasks");
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [filters.search, filters.status, filters.priority, filters.projectId, loading]);

  const handleFilterChange = (event) => {
    setFilters((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const grouped = tasks.reduce((accumulator, task) => {
    const key = task.project?.title || "Unknown Project";
    accumulator[key] = accumulator[key] || [];
    accumulator[key].push(task);
    return accumulator;
  }, {});

  const handleQuickStatusUpdate = async (taskId, status) => {
    try {
      await updateTaskRequest(taskId, { status });
      setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)));
      toast.success("Task status updated");
      pushNotification({ title: "Task completed", message: `Task status changed to ${sentenceCase(status)}.` });
      addAssistantEvent(`Task status updated to ${sentenceCase(status)}.`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update status");
    }
  };

  if (loading) {
    return <Spinner label="Loading tasks..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Tasks</p>
        <h2 className="font-display text-3xl font-bold text-white">Track delivery across every project</h2>
        <p className="mt-2 text-sm text-slate-400">Filter, update, and review work across teams without leaving the table view.</p>
      </div>

      <Card className="p-5">
        <TaskFilters filters={filters} onChange={handleFilterChange} />
      </Card>

      <div className="space-y-6">
        {Object.entries(grouped).map(([projectName, projectTasks]) => (
          <Card className="overflow-hidden" key={projectName}>
            <div className="border-b border-slate-800 px-5 py-4">
              <h3 className="font-display text-xl font-bold text-white">{projectName}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-950/70 text-slate-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Task</th>
                    <th className="px-5 py-3 font-medium">Assignee</th>
                    <th className="px-5 py-3 font-medium">Priority</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {projectTasks.map((task) => (
                    <tr className="table-row-dark" key={task.id}>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">{task.title}</p>
                        <p className="mt-1 max-w-xl text-slate-400">{task.description || "No description provided."}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-300">{task.assignee?.name || "Unassigned"}</td>
                      <td className="px-5 py-4">
                        <Badge value={task.priority} />
                      </td>
                      <td className="px-5 py-4">
                        <select
                          className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
                          value={task.status}
                          onChange={(event) => handleQuickStatusUpdate(task.id, event.target.value)}
                        >
                          <option value="TODO">{sentenceCase("TODO")}</option>
                          <option value="IN_PROGRESS">{sentenceCase("IN_PROGRESS")}</option>
                          <option value="DONE">{sentenceCase("DONE")}</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                          {formatDate(task.dueDate)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
