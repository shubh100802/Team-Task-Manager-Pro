import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(form);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-scene flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="auth-orb-layer">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
        <div className="auth-orb auth-orb-4" />
      </div>

      <div className="auth-glass-card relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-800/90 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden border-r border-slate-800/80 bg-gradient-to-br from-slate-950/80 via-indigo-950/70 to-slate-900/60 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Team Task Manager</p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-tight">Ship coordinated work without losing clarity.</h1>
            <p className="mt-4 max-w-md text-slate-300">
              Bring projects, ownership, priorities, and team visibility into one calm workspace.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="rounded-3xl border border-slate-700/80 bg-slate-900/50 p-5">
              <p className="text-sm text-cyan-300">Seed account</p>
              <p className="mt-2 font-semibold">admin@teamtask.com / Password123</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 p-8 lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">Welcome back</p>
          <h2 className="mt-3 font-display text-4xl font-bold text-white">Sign in to your workspace</h2>
          <p className="mt-3 text-sm text-slate-400">Stay on top of delivery, assignments, and project health.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
            <div className="flex justify-end">
              <Link className="text-sm font-medium text-cyan-400 transition hover:text-cyan-300" to="/forgot-password">
                Forgot password?
              </Link>
            </div>
            <Button className="w-full py-3" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Need an account?{" "}
            <Link className="font-semibold text-cyan-400" to="/signup">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
