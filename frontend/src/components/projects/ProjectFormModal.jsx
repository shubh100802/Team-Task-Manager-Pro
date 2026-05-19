import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import Textarea from "../ui/Textarea";

const initialState = {
  title: "",
  description: "",
};

export default function ProjectFormModal({ open, onClose, onSubmit, project, loading }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    setForm({
      title: project?.title || "",
      description: project?.description || "",
    });
  }, [project]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={project ? "Edit Project" : "Create Project"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button form="project-form" type="submit" disabled={loading}>
            {loading ? "Saving..." : project ? "Update Project" : "Create Project"}
          </Button>
        </>
      }
    >
      <form className="space-y-4" id="project-form" onSubmit={handleSubmit}>
        <Input label="Project title" name="title" value={form.title} onChange={handleChange} required />
        <Textarea label="Description" name="description" value={form.description} onChange={handleChange} />
      </form>
    </Modal>
  );
}
