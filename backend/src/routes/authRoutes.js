import { Router } from "express";
import {
  forgotPasswordController,
  loginController,
  meController,
  resetPasswordController,
  signupController,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "../validators/authValidators.js";

const router = Router();

router.post("/signup", validate(signupSchema), signupController);
router.post("/login", validate(loginSchema), loginController);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPasswordController);
router.post("/reset-password", validate(resetPasswordSchema), resetPasswordController);
router.get("/me", authMiddleware, meController);

export default router;
