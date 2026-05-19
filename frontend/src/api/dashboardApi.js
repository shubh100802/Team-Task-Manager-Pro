import api from "./client";

export async function fetchDashboardStatsRequest() {
  const { data } = await api.get("/dashboard/stats");
  return data.data;
}
