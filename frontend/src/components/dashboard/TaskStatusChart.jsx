import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Card from "../ui/Card";

const COLORS = ["#94a3b8", "#f59e0b", "#10b981"];

export default function TaskStatusChart({ data }) {
  return (
    <Card className="p-5">
      <div className="mb-4">
        <h3 className="font-display text-xl font-bold text-white">Task Status Mix</h3>
        <p className="text-sm text-slate-400">A quick view of delivery momentum.</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="status" innerRadius={70} outerRadius={100}>
              {data.map((entry, index) => (
                <Cell key={entry.status} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#e2e8f0" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
