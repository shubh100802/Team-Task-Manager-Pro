import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { formatDate } from "../../utils/format";

export default function MemberList({ members, canManage, onRemove }) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-800 px-5 py-4">
        <h3 className="font-display text-xl font-bold text-white">Team Members</h3>
      </div>
      <div className="divide-y divide-slate-800">
        {members.map((member) => (
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4" key={member.id}>
            <div className="flex items-center gap-3">
              <Avatar name={member.user.name} />
              <div>
                <p className="font-semibold text-white">{member.user.name}</p>
                <p className="text-sm text-slate-400">{member.user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-slate-400 md:block">Joined {formatDate(member.createdAt)}</span>
              <Badge value={member.role} />
              {canManage ? (
                <Button variant="danger" className="px-3 py-2 text-xs" onClick={() => onRemove(member.user.id)}>
                  Remove
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
