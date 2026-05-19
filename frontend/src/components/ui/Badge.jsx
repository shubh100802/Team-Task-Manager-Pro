import { sentenceCase } from "../../utils/format";

const styles = {
  TODO: "border border-slate-700 bg-slate-800 text-slate-200",
  IN_PROGRESS: "border border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
  DONE: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  LOW: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  MEDIUM: "border border-amber-500/30 bg-amber-500/10 text-amber-300",
  HIGH: "border border-red-500/30 bg-red-500/10 text-red-300",
  ADMIN: "border border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
  MEMBER: "border border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
};

export default function Badge({ value }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[value] || "border border-slate-700 bg-slate-800 text-slate-200"}`}>
      {sentenceCase(value)}
    </span>
  );
}
