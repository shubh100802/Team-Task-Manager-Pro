export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center">
      <h3 className="font-display text-xl font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
