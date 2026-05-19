import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
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
      await signup(form);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
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

      <div className="auth-glass-card relative z-10 w-full max-w-xl rounded-[2rem] border border-slate-800/90 p-8 lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">Build your team space</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">Create your account</h1>
        <p className="mt-3 text-sm text-slate-400">Start organizing projects, tasks, and teammates in one workspace.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <Input label="Full name" name="name" value={form.name} onChange={handleChange} required />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
          <Button className="w-full py-3" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          Already have an account?{" "}
          <Link className="font-semibold text-cyan-400" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
