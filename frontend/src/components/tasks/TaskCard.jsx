import Badge from "../ui/Badge";
import Card from "../ui/Card";
import { formatDate } from "../../utils/format";

export default function TaskCard({ task, onClick }) {
  return (
    <button className="w-full text-left" onClick={() => onClick(task)}>
      <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-4 transition hover:border-slate-700 hover:bg-slate-800/80">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-semibold text-white">{task.title}</h4>
          <Badge value={task.priority} />
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-slate-400">{task.description || "No description provided."}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span>{task.assignee?.name || "Unassigned"}</span>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-cyan-300">
            {formatDate(task.dueDate)}
          </span>
        </div>
      </Card>
    </button>
  );
}
