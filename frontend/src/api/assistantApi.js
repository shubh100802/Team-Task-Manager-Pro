import api from "./client";

export async function fetchAssistantContextRequest(route) {
  const { data } = await api.get("/assistant/context", {
    params: { route },
  });
  return data.data;
}

export async function assistantChatRequest(payload) {
  const { data } = await api.post("/assistant/chat", payload);
  return data.data;
}
