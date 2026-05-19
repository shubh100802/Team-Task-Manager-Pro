import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { addProjectMemberRequest, fetchProjectRequest, removeProjectMemberRequest } from "../api/projectApi";
import { createTaskRequest, deleteTaskRequest, updateTaskRequest } from "../api/taskApi";
import AddMemberForm from "../components/members/AddMemberForm";
import MemberList from "../components/members/MemberList";
import KanbanBoard from "../components/tasks/KanbanBoard";
import TaskFormModal from "../components/tasks/TaskFormModal";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import { useAssistant } from "../hooks/useAssistant";
import { useNotifications } from "../hooks/useNotifications";
import { formatDateTime } from "../utils/format";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { addAssistantEvent } = useAssistant();
  const { pushNotification } = useNotifications();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [savingTask, setSavingTask] = useState(false);
  const [savingMember, setSavingMember] = useState(false);

  const loadProject = async () => {
    try {
      const response = await fetchProjectRequest(id);
      setProject(response);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const currentUserRole = project?.currentUserRole;

  const handleTaskSubmit = async (payload) => {
    setSavingTask(true);

    try {
      if (selectedTask) {
        await updateTaskRequest(selectedTask.id, payload);
        toast.success("Task updated");
        pushNotification({ title: "Task updated", message: `${selectedTask.title} updated successfully.` });
        addAssistantEvent(`Task updated successfully: ${selectedTask.title}.`);
      } else {
        await createTaskRequest(payload);
        toast.success("Task created");
        pushNotification({ title: "Task created", message: "Task created successfully." });
        addAssistantEvent("Task created successfully.");
      }

      setTaskModalOpen(false);
      setSelectedTask(null);
      loadProject();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save task");
    } finally {
      setSavingTask(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskRequest(taskId, { status });
      setProject((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
      }));
      toast.success("Task moved");
      pushNotification({ title: "Task status changed", message: `Task moved to ${status.replace("_", " ")}.` });
      addAssistantEvent(`Great work. Task marked as ${status.replace("_", " ").toLowerCase()}.`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update task");
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    if (!window.confirm("Delete this task?")) {
      return;
    }

    try {
      await deleteTaskRequest(selectedTask.id);
      toast.success("Task deleted");
      pushNotification({ title: "Task deleted", message: `${selectedTask.title} was deleted.` });
      addAssistantEvent(`Task deleted: ${selectedTask.title}.`);
      setTaskModalOpen(false);
      setSelectedTask(null);
      loadProject();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete task");
    }
  };

  const handleAddMember = async (payload) => {
    setSavingMember(true);

    try {
      await addProjectMemberRequest(id, payload);
      toast.success("Member added");
      pushNotification({ title: "Member added", message: `${payload.email} was added to the project.` });
      addAssistantEvent(`A new member was added to this project: ${payload.email}.`);
      loadProject();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to add member");
    } finally {
      setSavingMember(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Remove this member from the project?")) {
      return;
    }

    try {
      await removeProjectMemberRequest(id, userId);
      toast.success("Member removed");
      pushNotification({ title: "Member removed", message: "A project member was removed." });
      addAssistantEvent("A member was removed from the project.");
      loadProject();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to remove member");
    }
  };

  if (loading) {
    return <Spinner label="Loading project workspace..." />;
  }

  if (!project) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <Badge value={project.currentUserRole} />
              <span className="text-sm text-cyan-300">{project.members.length} members</span>
            </div>
            <h2 className="font-display text-4xl font-bold">{project.title}</h2>
            <p className="mt-3 max-w-3xl text-slate-300">{project.description || "No description added yet."}</p>
          </div>
          {currentUserRole === "ADMIN" ? (
            <Button
              className="bg-white !text-slate-950 hover:bg-slate-100 shadow-panel"
              onClick={() => {
                setSelectedTask(null);
                setTaskModalOpen(true);
              }}
            >
              Create Task
            </Button>
          ) : null}
        </div>
      </Card>

      <KanbanBoard
        tasks={project.tasks}
        onTaskClick={(task) => {
          setSelectedTask(task);
          setTaskModalOpen(true);
        }}
        onStatusChange={handleStatusChange}
        canDrag={currentUserRole === "ADMIN"}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {currentUserRole === "ADMIN" ? <AddMemberForm onSubmit={handleAddMember} loading={savingMember} /> : null}
          <MemberList members={project.members} canManage={currentUserRole === "ADMIN"} onRemove={handleRemoveMember} />
        </div>

        <Card className="p-5">
          <div className="mb-4">
            <h3 className="font-display text-xl font-bold text-white">Recent Project Activity</h3>
            <p className="text-sm text-slate-400">Latest changes inside this workspace.</p>
          </div>
          <div className="space-y-4">
            {project.activities.map((activity) => (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4" key={activity.id}>
                <p className="font-medium text-white">{activity.message}</p>
                <p className="mt-1 text-sm text-slate-400">{activity.user?.name}</p>
                <p className="mt-1 text-xs text-slate-500">{formatDateTime(activity.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <TaskFormModal
        open={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleTaskSubmit}
        task={selectedTask}
        projectId={project.id}
        members={project.members}
        currentUserRole={currentUserRole}
        loading={savingTask}
      />

      {taskModalOpen && selectedTask && currentUserRole === "ADMIN" ? (
        <div className="fixed bottom-6 right-6 z-40">
          <Button variant="danger" onClick={handleDeleteTask}>
            Delete Task
          </Button>
        </div>
      ) : null}
    </div>
  );
}
