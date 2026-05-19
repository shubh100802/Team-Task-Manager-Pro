export function sendResponse(res, { statusCode = 200, message, data = null }) {
  return res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data,
  });
}
