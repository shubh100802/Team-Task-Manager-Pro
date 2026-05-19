import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordRequest } from "../api/authApi";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await resetPasswordRequest({ token, password });
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to reset password");
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
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">Reset access</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">Set a new password</h1>
        <p className="mt-3 text-sm text-slate-400">Choose a strong new password to restore secure access to your workspace.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <Input label="New password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <Button className="w-full py-3" type="submit" disabled={loading || !token}>
            {loading ? "Resetting..." : "Reset password"}
          </Button>
        </form>

        {!token ? <p className="mt-4 text-sm text-red-400">Reset token is missing or invalid.</p> : null}

        <p className="mt-6 text-sm text-slate-400">
          Back to{" "}
          <Link className="font-semibold text-cyan-400" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
