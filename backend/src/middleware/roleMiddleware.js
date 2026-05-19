import { ensureProjectAdmin } from "../utils/projectAccess.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export function roleMiddleware(getProjectId) {
  return asyncHandler(async (req, _res, next) => {
    const projectId = getProjectId(req);

    if (!projectId) {
      throw new ApiError(400, "Project id is required for role validation");
    }

    await ensureProjectAdmin(projectId, req.user.id);
    next();
  });
}
