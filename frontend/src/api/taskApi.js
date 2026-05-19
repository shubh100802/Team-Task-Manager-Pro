import api from "./client";

export async function fetchTasksRequest(params = {}) {
  const { data } = await api.get("/tasks", { params });
  return data.data;
}

export async function fetchTaskRequest(taskId) {
  const { data } = await api.get(`/tasks/${taskId}`);
  return data.data;
}

export async function createTaskRequest(payload) {
  const { data } = await api.post("/tasks", payload);
  return data.data;
}

export async function updateTaskRequest(taskId, payload) {
  const { data } = await api.put(`/tasks/${taskId}`, payload);
  return data.data;
}

export async function deleteTaskRequest(taskId) {
  const { data } = await api.delete(`/tasks/${taskId}`);
  return data.data;
}
