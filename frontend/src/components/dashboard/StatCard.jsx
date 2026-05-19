import Card from "../ui/Card";

export default function StatCard({ title, value, hint }) {
  return (
    <Card className="border-slate-800 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <h3 className="mt-3 font-display text-3xl font-bold text-white">{value}</h3>
      <p className="mt-2 text-sm text-slate-500">{hint}</p>
    </Card>
  );
}
