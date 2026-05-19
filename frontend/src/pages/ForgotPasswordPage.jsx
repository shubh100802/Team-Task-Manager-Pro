import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { forgotPasswordRequest } from "../api/authApi";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await forgotPasswordRequest({ email });
      setResult(response);
      toast.success("Reset instructions generated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to process request");
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
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">Secure account recovery</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">Forgot your password?</h1>
        <p className="mt-3 text-sm text-slate-400">Enter your registered email and we’ll generate a secure reset link for development use.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <Input label="Registered email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Button className="w-full py-3" type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate reset link"}
          </Button>
        </form>

        {result?.resetUrl ? (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm font-semibold text-white">Development reset link</p>
            <a className="mt-2 block break-all text-sm text-cyan-400" href={result.resetUrl}>
              {result.resetUrl}
            </a>
          </div>
        ) : null}

        <p className="mt-6 text-sm text-slate-400">
          Remembered your password?{" "}
          <Link className="font-semibold text-cyan-400" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
