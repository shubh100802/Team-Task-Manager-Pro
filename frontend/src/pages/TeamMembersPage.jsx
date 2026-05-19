import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { fetchProjectsRequest } from "../api/projectApi";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";

export default function TeamMembersPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetchProjectsRequest();
        setProjects(response);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load members");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const members = useMemo(() => {
    const map = new Map();

    projects.forEach((project) => {
      project.members?.forEach((member) => {
        const existing = map.get(member.user.id) || {
          ...member.user,
          roles: new Set(),
          projects: new Set(),
        };

        existing.roles.add(member.role);
        existing.projects.add(project.title);
        map.set(member.user.id, existing);
      });
    });

    return [...map.values()].map((member) => ({
      ...member,
      roles: [...member.roles],
      projects: [...member.projects],
    }));
  }, [projects]);

  if (loading) {
    return <Spinner label="Loading team members..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Team directory</p>
        <h2 className="font-display text-3xl font-bold text-white">See who is contributing across projects</h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {members.map((member) => (
          <Card className="p-5" key={member.id}>
            <div className="flex items-start gap-4">
              <Avatar name={member.name} className="h-14 w-14 text-base" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-xl font-bold text-white">{member.name}</h3>
                  {member.roles.map((role) => (
                    <Badge key={`${member.id}-${role}`} value={role} />
                  ))}
                </div>
                <p className="mt-1 text-sm text-slate-400">{member.email}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {member.projects.map((project) => (
                    <span className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-xs font-medium text-slate-300" key={project}>
                      {project}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
