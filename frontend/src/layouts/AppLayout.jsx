import {
  ChevronLeft,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Menu,
  Search,
  Settings,
  UserCircle2,
  Users,
  X,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import NotificationCenter from "../components/assistant/NotificationCenter";
import { fetchProjectsRequest } from "../api/projectApi";
import { fetchTasksRequest } from "../api/taskApi";
import { useAuth } from "../hooks/useAuth";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: ListTodo },
  { to: "/team-members", label: "Team Members", icon: Users },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchProjects, setSearchProjects] = useState([]);
  const [searchTasks, setSearchTasks] = useState([]);

  useEffect(() => {
    const loadSearchData = async () => {
      try {
        const [projects, tasks] = await Promise.all([fetchProjectsRequest(), fetchTasksRequest()]);
        setSearchProjects(projects);
        setSearchTasks(tasks);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load search data");
      }
    };

    loadSearchData();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return searchProjects.filter(
      (project) =>
        project.title.toLowerCase().includes(term) ||
        project.description?.toLowerCase().includes(term),
    ).slice(0, 4);
  }, [searchProjects, searchTerm]);

  const filteredTasks = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return searchTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term) ||
        task.description?.toLowerCase().includes(term),
    ).slice(0, 5);
  }, [searchTasks, searchTerm]);

  const handleSearchNavigate = (path) => {
    navigate(path);
    setSearchOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-slate-950 px-3 py-3 lg:px-5">
      <div
        className={`mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1500px] gap-4 transition-all ${
          collapsed ? "lg:grid-cols-[96px_1fr]" : "lg:grid-cols-[280px_1fr]"
        }`}
      >
        {open ? <button className="fixed inset-0 z-30 bg-slate-950/70 lg:hidden" onClick={() => setOpen(false)} /> : null}
        <aside
          className={`glass-panel fixed inset-y-3 left-3 z-40 ${collapsed ? "w-24" : "w-72"} rounded-3xl p-4 shadow-soft transition-all duration-200 lg:static lg:block ${
            open ? "block" : "hidden lg:block"
          }`}
        >
          <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} gap-3`}>
            <div className={`flex items-center ${collapsed ? "justify-center" : ""} gap-3`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 text-lg font-bold text-white">TT</div>
              {!collapsed ? (
                <div>
                  <p className="font-display text-xl font-bold text-white">Team Task</p>
                  <p className="text-sm text-slate-400">Manager SaaS</p>
                </div>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="hidden rounded-xl border border-slate-800 p-2 text-slate-400 transition hover:border-slate-700 hover:text-white lg:inline-flex"
                onClick={() => setCollapsed((prev) => !prev)}
              >
                <ChevronLeft size={16} className={`${collapsed ? "rotate-180" : ""} transition-transform`} />
              </button>
              <button className="rounded-xl border border-slate-800 p-2 text-slate-400 transition hover:border-slate-700 hover:text-white lg:hidden" onClick={() => setOpen(false)}>
                <X size={16} />
              </button>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center ${collapsed ? "justify-center" : ""} gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "border border-indigo-500/40 bg-indigo-500/15 text-white"
                        : "border border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-800/70 hover:text-white"
                    }`
                  }
                  title={collapsed ? link.label : undefined}
                >
                  <Icon size={18} />
                  {!collapsed ? link.label : null}
                </NavLink>
              );
            })}
          </nav>

          {!collapsed ? (
            <div className="mt-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-indigo-500/15 to-cyan-400/10 p-5 text-white">
              <p className="text-sm text-cyan-300">Workflow pulse</p>
              <h3 className="mt-2 font-display text-2xl font-bold">Stay aligned.</h3>
              <p className="mt-2 text-sm text-slate-300">Track work, unblock teammates, and keep delivery moving.</p>
            </div>
          ) : null}
        </aside>

        <main className="page-shell overflow-hidden">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 px-4 py-4 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                className="rounded-xl border border-slate-800 p-2 text-slate-300 transition hover:border-slate-700 hover:text-white lg:hidden"
                onClick={() => setOpen((prev) => !prev)}
              >
                <Menu size={18} />
              </button>
              <div>
                <p className="text-sm text-slate-400">Welcome back</p>
                <h1 className="font-display text-2xl font-bold text-white">{user?.name}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden lg:block">
                <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-400">
                <Search size={16} />
                <input
                  className="w-52 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                  placeholder="Search projects or tasks"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                />
                </div>
                {searchOpen && searchTerm.trim() ? (
                  <div className="absolute left-0 right-0 top-14 z-20 rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-panel">
                    {filteredProjects.length === 0 && filteredTasks.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-slate-400">No matching projects or tasks found.</div>
                    ) : (
                      <>
                        {filteredProjects.length ? (
                          <div className="mb-2">
                            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Projects</p>
                            {filteredProjects.map((project) => (
                              <button
                                className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                                key={project.id}
                                onClick={() => handleSearchNavigate(`/projects/${project.id}`)}
                              >
                                <span className="font-medium">{project.title}</span>
                              </button>
                            ))}
                          </div>
                        ) : null}
                        {filteredTasks.length ? (
                          <div>
                            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Tasks</p>
                            {filteredTasks.map((task) => (
                              <button
                                className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                                key={task.id}
                                onClick={() => handleSearchNavigate(task.projectId ? `/projects/${task.projectId}` : "/tasks")}
                              >
                                <span className="font-medium">{task.title}</span>
                                {task.project?.title ? <span className="ml-2 text-xs text-slate-500">in {task.project.title}</span> : null}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                ) : null}
              </div>
              <div className="hidden md:block">
                <NotificationCenter />
              </div>
              <div className="relative">
                <button
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 transition hover:border-slate-700"
                  onClick={() => setProfileOpen((prev) => !prev)}
                >
                  <Avatar name={user?.name} className="h-9 w-9 rounded-xl text-xs" />
                  <div className="hidden text-left md:block">
                    <p className="text-sm font-semibold text-white">{user?.name}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                </button>
                {profileOpen ? (
                  <div className="absolute right-0 top-14 z-20 w-52 rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-panel">
                    <NavLink
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                      onClick={() => setProfileOpen(false)}
                      to="/profile"
                    >
                      <UserCircle2 size={16} />
                      Profile
                    </NavLink>
                    <button
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                      onClick={() => {
                        setProfileOpen(false);
                        setSettingsOpen(true);
                      }}
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                    <button
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                      onClick={logout}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
              <div className="md:hidden">
                <div className="flex items-center gap-2">
                  <NotificationCenter />
                  <Button variant="ghost" className="px-3 py-2" onClick={logout}>
                    <LogOut size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <section className="min-h-[calc(100vh-8rem)] p-4 lg:p-8">
            <Outlet />
          </section>
        </main>
      </div>
      <Modal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Account Settings"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSettingsOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setSettingsOpen(false);
                navigate("/profile");
              }}
            >
              Open Profile
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-400">Signed in as</p>
            <p className="mt-1 font-semibold text-white">{user?.name}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-400">Workspace access</p>
            <p className="mt-1 text-sm text-slate-300">Review your memberships, profile details, and account information from the profile page.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
