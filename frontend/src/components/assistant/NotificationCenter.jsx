import { Bell } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "../../hooks/useNotifications";

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-2 text-sm text-slate-400 transition hover:border-slate-700 hover:text-white"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Bell size={16} />
        <span className="hidden md:inline">Notifications</span>
        {unreadCount ? <span className="rounded-full bg-indigo-500 px-2 py-0.5 text-xs text-white">{unreadCount}</span> : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-14 z-30 w-80 rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-panel">
          <h3 className="px-2 pb-2 text-sm font-semibold text-white">Workspace notifications</h3>
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {notifications.length ? (
              notifications.map((notification) => (
                <button
                  className={`block w-full rounded-xl border px-3 py-3 text-left transition ${
                    notification.read
                      ? "border-slate-800 bg-slate-950/50 text-slate-400"
                      : "border-slate-700 bg-slate-950 text-slate-200 hover:border-slate-600"
                  }`}
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                >
                  <p className="text-sm font-semibold">{notification.title}</p>
                  <p className="mt-1 text-sm">{notification.message}</p>
                </button>
              ))
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-4 text-sm text-slate-400">
                No notifications yet.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
