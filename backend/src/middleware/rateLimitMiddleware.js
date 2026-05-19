const requestBuckets = new Map();

export function rateLimitMiddleware({ windowMs = 60_000, max = 20 } = {}) {
  return (req, res, next) => {
    const identifier = req.user?.id || req.ip || "anonymous";
    const now = Date.now();
    const current = requestBuckets.get(identifier);

    if (!current || current.expiresAt < now) {
      requestBuckets.set(identifier, {
        count: 1,
        expiresAt: now + windowMs,
      });
      return next();
    }

    if (current.count >= max) {
      return res.status(429).json({
        success: false,
        message: "Too many assistant requests. Please wait a moment and try again.",
      });
    }

    current.count += 1;
    requestBuckets.set(identifier, current);
    return next();
  };
}
