import { Router } from "express";
import { assistantChatController, assistantContextController } from "../controllers/assistantController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { rateLimitMiddleware } from "../middleware/rateLimitMiddleware.js";
import { validate } from "../middleware/validate.js";
import { assistantChatSchema, assistantContextSchema } from "../validators/assistantValidators.js";

const router = Router();

router.use(authMiddleware);
router.use(rateLimitMiddleware({ windowMs: 60_000, max: 25 }));

router.get("/context", validate(assistantContextSchema), assistantContextController);
router.post("/chat", validate(assistantChatSchema), assistantChatController);

export default router;
