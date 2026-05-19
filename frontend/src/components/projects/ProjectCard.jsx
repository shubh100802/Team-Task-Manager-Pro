import { Link } from "react-router-dom";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

export default function ProjectCard({ project }) {
  return (
    <Card className="flex flex-col gap-5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-bold text-white">{project.title}</h3>
          <p className="mt-2 text-sm text-slate-400">{project.description || "No description yet."}</p>
        </div>
        <Badge value={project.currentUserRole} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
          <span className="block text-xs uppercase tracking-wide text-slate-500">Tasks</span>
          <strong className="mt-1 block text-lg text-white">{project._count?.tasks ?? project.tasks?.length ?? 0}</strong>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
          <span className="block text-xs uppercase tracking-wide text-slate-500">Members</span>
          <strong className="mt-1 block text-lg text-white">{project._count?.members ?? project.members?.length ?? 0}</strong>
        </div>
      </div>
      <Link
        className="rounded-xl bg-indigo-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-400"
        to={`/projects/${project.id}`}
      >
        Open Workspace
      </Link>
    </Card>
  );
}
