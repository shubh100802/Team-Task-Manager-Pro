import { chatWithAssistant, getAssistantContext } from "../services/assistantService.js";
import { sendResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const assistantContextController = asyncHandler(async (req, res) => {
  const route = req.validated.query?.route || req.query.route || "/dashboard";
  const result = await getAssistantContext(req.user.id, route);
  return sendResponse(res, {
    message: "Assistant context generated successfully",
    data: result,
  });
});

export const assistantChatController = asyncHandler(async (req, res) => {
  const result = await chatWithAssistant({
    userId: req.user.id,
    route: req.validated.body.route,
    message: req.validated.body.message,
  });

  return sendResponse(res, {
    message: "Assistant response generated successfully",
    data: result,
  });
});
