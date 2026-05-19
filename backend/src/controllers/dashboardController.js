import { getDashboardStats } from "../services/dashboardService.js";
import { sendResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardStatsController = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats(req.user.id);
  return sendResponse(res, {
    message: "Dashboard statistics fetched successfully",
    data: stats,
  });
});
