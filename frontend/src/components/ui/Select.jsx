export default function Select({ label, children, className = "", ...props }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-300">
      {label ? <span>{label}</span> : null}
      <select
        className={`input-dark ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
