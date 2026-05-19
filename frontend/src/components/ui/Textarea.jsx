export default function Textarea({ label, className = "", ...props }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-300">
      {label ? <span>{label}</span> : null}
      <textarea
        className={`input-dark min-h-28 resize-y ${className}`}
        {...props}
      />
    </label>
  );
}
