import Input from "../ui/Input";
import Select from "../ui/Select";

export default function TaskFilters({ filters, onChange }) {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <Input
        label="Search"
        name="search"
        placeholder="Find tasks by title or description"
        value={filters.search}
        onChange={onChange}
      />
      <Select label="Status" name="status" value={filters.status} onChange={onChange}>
        <option value="">All statuses</option>
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </Select>
      <Select label="Priority" name="priority" value={filters.priority} onChange={onChange}>
        <option value="">All priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </Select>
      <Select label="Project" name="projectId" value={filters.projectId} onChange={onChange}>
        <option value="">All projects</option>
        {filters.projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.title}
          </option>
        ))}
      </Select>
    </div>
  );
}
