import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";

const defaultForm = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  dueDate: "",
  assignedTo: "",
};

export default function TaskFormModal({
  open,
  onClose,
  onSubmit,
  task,
  projectId,
  members,
  currentUserRole,
  loading,
}) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    setForm({
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || "TODO",
      priority: task?.priority || "MEDIUM",
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : "",
      assignedTo: task?.assignedTo || "",
    });
  }, [task]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload =
      currentUserRole === "ADMIN"
        ? {
            ...form,
            projectId,
            dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : "",
          }
        : {
            status: form.status,
          };

    await onSubmit(payload);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task ? "Task Details" : "Create Task"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button form="task-form" type="submit" disabled={loading}>
            {loading ? "Saving..." : task ? "Save Changes" : "Create Task"}
          </Button>
        </>
      }
    >
      <form className="space-y-4" id="task-form" onSubmit={handleSubmit}>
        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required={currentUserRole === "ADMIN"}
          disabled={currentUserRole !== "ADMIN"}
        />
        <Textarea
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          disabled={currentUserRole !== "ADMIN"}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Select label="Status" name="status" value={form.status} onChange={handleChange}>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </Select>
          <Select
            label="Priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            disabled={currentUserRole !== "ADMIN"}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </Select>
        </div>
        {currentUserRole === "ADMIN" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Due date"
              name="dueDate"
              type="datetime-local"
              value={form.dueDate}
              onChange={handleChange}
              className="[color-scheme:dark]"
            />
            <Select label="Assignee" name="assignedTo" value={form.assignedTo} onChange={handleChange}>
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member.user.id} value={member.user.id}>
                  {member.user.name} ({member.role})
                </option>
              ))}
            </Select>
          </div>
        ) : null}
      </form>
    </Modal>
  );
}
