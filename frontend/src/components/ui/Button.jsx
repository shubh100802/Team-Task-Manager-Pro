export default function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-indigo-500 text-white hover:bg-indigo-400",
    secondary: "border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800",
    danger: "bg-red-500 text-white hover:bg-red-400",
    ghost: "bg-transparent text-slate-300 hover:bg-slate-800/70 hover:text-white",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
