import { useAuth } from "../hooks/useAuth";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import { formatDateTime } from "../utils/format";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name} className="h-16 w-16 text-lg" />
          <div>
            <h2 className="font-display text-3xl font-bold text-white">{user?.name}</h2>
            <p className="mt-1 text-slate-400">{user?.email}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-400">Account created</p>
            <p className="mt-1 font-semibold text-white">{formatDateTime(user?.createdAt)}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-400">Projects joined</p>
            <p className="mt-1 font-semibold text-white">{user?.memberships?.length || 0}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-display text-2xl font-bold text-white">Project memberships</h3>
        <div className="mt-5 space-y-4">
          {user?.memberships?.map((membership) => (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4" key={membership.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{membership.project.title}</p>
                  <p className="text-sm text-slate-400">{membership.project.description || "No description available."}</p>
                </div>
                <Badge value={membership.role} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
