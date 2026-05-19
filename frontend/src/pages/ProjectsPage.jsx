import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createProjectRequest,
  deleteProjectRequest,
  fetchProjectsRequest,
  updateProjectRequest,
} from "../api/projectApi";
import ProjectFormModal from "../components/projects/ProjectFormModal";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ProjectCard from "../components/projects/ProjectCard";
import Spinner from "../components/ui/Spinner";
import { useAssistant } from "../hooks/useAssistant";
import { useNotifications } from "../hooks/useNotifications";

export default function ProjectsPage() {
  const { addAssistantEvent } = useAssistant();
  const { pushNotification } = useNotifications();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const loadProjects = async () => {
    try {
      const response = await fetchProjectsRequest();
      setProjects(response);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async (payload) => {
    setSaving(true);

    try {
      if (editingProject) {
        await updateProjectRequest(editingProject.id, payload);
        toast.success("Project updated");
        pushNotification({ title: "Project updated", message: `${payload.title} updated successfully.` });
        addAssistantEvent(`Project updated successfully. ${payload.title} is ready for the next workflow step.`);
      } else {
        await createProjectRequest(payload);
        toast.success("Project created");
        pushNotification({ title: "Project created", message: `${payload.title} created successfully.` });
        addAssistantEvent(`Project created successfully. ${payload.title} is now ready for team collaboration.`);
      }

      setModalOpen(false);
      setEditingProject(null);
      loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Delete this project and all related tasks?")) {
      return;
    }

    try {
      await deleteProjectRequest(projectId);
      toast.success("Project deleted");
      pushNotification({ title: "Project deleted", message: "A project was removed from your workspace." });
      addAssistantEvent("Project deleted successfully.");
      loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete project");
    }
  };

  if (loading) {
    return <Spinner label="Loading projects..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Projects</p>
          <h2 className="font-display text-3xl font-bold text-white">Manage your team workspaces</h2>
          <p className="mt-2 text-sm text-slate-400">Create focused workspaces for delivery, ownership, and collaboration.</p>
        </div>
        <Button
          onClick={() => {
            setEditingProject(null);
            setModalOpen(true);
          }}
        >
          New Project
        </Button>
      </div>

      {projects.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <div className="space-y-3" key={project.id}>
              <ProjectCard project={project} />
              {project.currentUserRole === "ADMIN" ? (
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setEditingProject(project);
                      setModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="danger" className="flex-1" onClick={() => handleDelete(project.id)}>
                    Delete
                  </Button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects yet"
          description="Create your first project to start assigning work and tracking delivery."
          action={<Button onClick={() => setModalOpen(true)}>Create Project</Button>}
        />
      )}

      <ProjectFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        project={editingProject}
        loading={saving}
      />
    </div>
  );
}
