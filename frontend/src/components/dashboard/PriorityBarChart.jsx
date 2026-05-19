import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "../ui/Card";

export default function PriorityBarChart({ data }) {
  return (
    <Card className="p-5">
      <div className="mb-4">
        <h3 className="font-display text-xl font-bold text-white">Priority Load</h3>
        <p className="text-sm text-slate-400">Spot risk and urgency at a glance.</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="priority" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#e2e8f0" }} />
            <Bar dataKey="count" fill="#6366f1" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
