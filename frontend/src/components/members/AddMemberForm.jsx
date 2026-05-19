import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

export default function AddMemberForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    email: "",
    role: "MEMBER",
  });

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm({ email: "", role: "MEMBER" });
  };

  return (
    <form className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-panel" onSubmit={handleSubmit}>
      <div className="mb-4">
        <h3 className="font-display text-lg font-bold text-white">Add Team Member</h3>
        <p className="mt-1 text-sm text-slate-400">Invite a user by email and choose the right project role.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-[2fr_1fr_auto]">
      <Input label="User email" name="email" value={form.email} onChange={handleChange} required />
      <Select label="Role" name="role" value={form.role} onChange={handleChange}>
        <option value="MEMBER">Member</option>
        <option value="ADMIN">Admin</option>
      </Select>
      <div className="flex items-end">
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Member"}
        </Button>
      </div>
      </div>
    </form>
  );
}
