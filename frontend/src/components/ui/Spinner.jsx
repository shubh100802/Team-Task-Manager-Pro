export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
      <span>{label}</span>
    </div>
  );
}
