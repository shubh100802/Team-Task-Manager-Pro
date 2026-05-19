import { initials } from "../../utils/format";

export default function Avatar({ name, className = "" }) {
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-bold text-white ${className}`}>
      {initials(name)}
    </div>
  );
}
