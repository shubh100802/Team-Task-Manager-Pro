import api from "./client";

export async function loginRequest(payload) {
  const { data } = await api.post("/auth/login", payload);
  return data.data;
}

export async function signupRequest(payload) {
  const { data } = await api.post("/auth/signup", payload);
  return data.data;
}

export async function fetchMeRequest() {
  const { data } = await api.get("/auth/me");
  return data.data;
}

export async function forgotPasswordRequest(payload) {
  const { data } = await api.post("/auth/forgot-password", payload);
  return data.data;
}

export async function resetPasswordRequest(payload) {
  const { data } = await api.post("/auth/reset-password", payload);
  return data.data;
}
