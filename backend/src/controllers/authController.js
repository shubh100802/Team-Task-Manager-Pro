import { sendResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { forgotPassword, getCurrentUser, login, resetPassword, signup } from "../services/authService.js";

export const signupController = asyncHandler(async (req, res) => {
  const result = await signup(req.validated.body);
  return sendResponse(res, {
    statusCode: 201,
    message: "Account created successfully",
    data: result,
  });
});

export const loginController = asyncHandler(async (req, res) => {
  const result = await login(req.validated.body);
  return sendResponse(res, {
    message: "Login successful",
    data: result,
  });
});

export const meController = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.id);
  return sendResponse(res, {
    message: "User profile fetched successfully",
    data: user,
  });
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
  const result = await forgotPassword(req.validated.body.email);
  return sendResponse(res, {
    message: "Forgot password request processed successfully",
    data: result,
  });
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  const result = await resetPassword(req.validated.body.token, req.validated.body.password);
  return sendResponse(res, {
    message: "Password reset successfully",
    data: result,
  });
});
