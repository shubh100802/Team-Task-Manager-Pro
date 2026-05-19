import api from "./client";

export async function fetchProjectsRequest() {
  const { data } = await api.get("/projects");
  return data.data;
}

export async function fetchProjectRequest(projectId) {
  const { data } = await api.get(`/projects/${projectId}`);
  return data.data;
}

export async function createProjectRequest(payload) {
  const { data } = await api.post("/projects", payload);
  return data.data;
}

export async function updateProjectRequest(projectId, payload) {
  const { data } = await api.put(`/projects/${projectId}`, payload);
  return data.data;
}

export async function deleteProjectRequest(projectId) {
  const { data } = await api.delete(`/projects/${projectId}`);
  return data.data;
}

export async function addProjectMemberRequest(projectId, payload) {
  const { data } = await api.post(`/projects/${projectId}/members`, payload);
  return data.data;
}

export async function removeProjectMemberRequest(projectId, userId) {
  const { data } = await api.delete(`/projects/${projectId}/members/${userId}`);
  return data.data;
}
